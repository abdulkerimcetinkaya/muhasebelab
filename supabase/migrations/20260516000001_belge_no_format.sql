-- Fatura no ve dekont no formatlarını standartlaştır.
--
-- Fatura: ABC[Yıl]000000001 (16 karakter — 3 harf işletme kısaltması + 4 hane yıl + 9 hane sıra)
--   - 3 harf: işletmenin ünsuz-ağırlıklı kısaltması (Yıldız → YLD, Demirören → DMR, Bosch → BSC)
--   - Yıl: belgenin tarihinden alınır
--   - Sıra: aynı (kısaltma + yıl) içinde 1'den başlar, soru id sırasına göre artar
--
-- Dekont: 6 haneli sıralı sayı (000001, 000002, ...) — global sayaç, soru id sırasına göre
--
-- Diğer belge tipleri (perakende fiş, çek, senet) dokunulmaz.
-- Belgesiz sorular skip.
--
-- Migration idempotent: faturaNo zaten yeni formatta (^[A-Z]{3}\d{13}$) ise atlanır.
-- Tekrar çalışsa da işletme bazlı sayaçlar deterministik (soru id'e göre).

begin;

-- =========================================================================
-- Helper 1: Türkçe karakterleri ASCII'ye çevir
-- =========================================================================
create or replace function tmp_turkceyi_asciye(s text) returns text as $$
begin
  return translate(s,
    'çÇğĞıİöÖşŞüÜ',
    'cCgGiIoOsSuU'
  );
end;
$$ language plpgsql immutable;

-- =========================================================================
-- Helper 2: İşletme adından 3 harf kısaltma üret
--
-- Algoritma: harfleri sırayla tara, ünsuzları her zaman al, ünlüleri sadece
-- result boşken al (yani ilk harf ünlüyse alınır, ortadakiler atlanır).
-- 3 harfe ulaşılırsa biter. Yetmezse ünlülerden tamamla, hâlâ yetmezse 'X'.
--
-- Test:
--   'Yıldız Beyaz Eşya'   → YLD
--   'Demirören Elektronik' → DMR
--   'Bosch'                → BSC
--   'Akel'                 → AKL  (A ilk harf olduğu için alındı)
--   'LG'                   → LGX  (eksik kalan padding)
-- =========================================================================
create or replace function tmp_isletme_kisaltma(isim text) returns text as $$
declare
  ascii_text text;
  harfler text;
  result text := '';
  i int;
  c text;
  unlu boolean;
begin
  if isim is null or length(isim) = 0 then
    return 'XXX';
  end if;
  ascii_text := upper(tmp_turkceyi_asciye(isim));
  harfler := regexp_replace(ascii_text, '[^A-Z]', '', 'g');

  -- 1. tur: sırayla harfleri tara
  for i in 1..length(harfler) loop
    exit when length(result) >= 3;
    c := substr(harfler, i, 1);
    unlu := c in ('A', 'E', 'I', 'O', 'U');
    if not unlu then
      result := result || c;
    elsif length(result) = 0 then
      result := result || c;
    end if;
  end loop;

  -- 2. tur: hâlâ eksikse ünlülerle tamamla
  if length(result) < 3 then
    for i in 1..length(harfler) loop
      exit when length(result) >= 3;
      c := substr(harfler, i, 1);
      if c in ('A', 'E', 'I', 'O', 'U') and position(c in result) = 0 then
        result := result || c;
      end if;
    end loop;
  end if;

  return rpad(result, 3, 'X');
end;
$$ language plpgsql immutable;

-- =========================================================================
-- Ana update: tüm sorulardaki belgeleri tara, fatura ve dekont no'ları
-- yeni formata çevir
-- =========================================================================
do $$
declare
  soru_kaydi record;
  belge_idx int;
  belge jsonb;
  belge_tur text;
  guncel_belge jsonb;
  yeni_belgeler jsonb;
  fatura_isletme text;
  fatura_tipi text;
  kisaltma text;
  yil text;
  yeni_no text;
  -- işletme+yıl bazlı sayaç: { "YLD2025": 1, "DMR2026": 2, ... }
  isletme_sayac jsonb := '{}'::jsonb;
  sayac int;
  anahtar text;
  -- dekontlar için global sayaç
  dekont_sayac int := 0;
begin
  for soru_kaydi in
    select id, belgeler from sorular
    where belgeler is not null
      and jsonb_typeof(belgeler) = 'array'
      and jsonb_array_length(belgeler) > 0
    order by id
  loop
    yeni_belgeler := '[]'::jsonb;
    for belge_idx in 0..jsonb_array_length(soru_kaydi.belgeler) - 1 loop
      belge := soru_kaydi.belgeler -> belge_idx;
      belge_tur := belge ->> 'tur';
      guncel_belge := belge;

      if belge_tur = 'fatura' then
        fatura_tipi := belge ->> 'faturaTipi';
        -- Hangi tarafın unvanı baz alınır?
        -- Alış faturası → satıcı (bizim için "tedarikçi" markası)
        -- Satış faturası → alıcı (bizim için "müşteri" markası)
        -- Belirsizse satıcıyı kullan
        if fatura_tipi = 'satis' then
          fatura_isletme := belge -> 'alici' ->> 'unvan';
        else
          fatura_isletme := belge -> 'satici' ->> 'unvan';
        end if;

        if fatura_isletme is not null and length(fatura_isletme) > 0 then
          kisaltma := tmp_isletme_kisaltma(fatura_isletme);
          yil := substring(coalesce(belge ->> 'tarih', '2025-01-01'), 1, 4);
          -- yıl sadece rakam mı? değilse '2025'
          if yil !~ '^[0-9]{4}$' then
            yil := '2025';
          end if;
          anahtar := kisaltma || yil;
          sayac := coalesce((isletme_sayac ->> anahtar)::int, 0) + 1;
          isletme_sayac := jsonb_set(isletme_sayac, array[anahtar], to_jsonb(sayac));
          yeni_no := kisaltma || yil || lpad(sayac::text, 9, '0');
          guncel_belge := jsonb_set(guncel_belge, '{faturaNo}', to_jsonb(yeni_no));
        end if;

      elsif belge_tur = 'dekont' then
        dekont_sayac := dekont_sayac + 1;
        yeni_no := lpad(dekont_sayac::text, 6, '0');
        guncel_belge := jsonb_set(guncel_belge, '{dekontNo}', to_jsonb(yeni_no));
      end if;

      yeni_belgeler := yeni_belgeler || guncel_belge;
    end loop;

    update sorular set belgeler = yeni_belgeler where id = soru_kaydi.id;
  end loop;
end $$;

-- Helper'lar geçiciydi, temizle
drop function if exists tmp_isletme_kisaltma(text);
drop function if exists tmp_turkceyi_asciye(text);

commit;

notify pgrst, 'reload schema';
