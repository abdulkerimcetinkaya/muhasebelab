-- İyzico ödeme entegrasyonu — planlar katalog tablosu + odemeler iyileştirmeleri.
-- "Aylık" ve "Dönemlik (3 aylık)" iki plan ile başlıyoruz; pazara çıktıkça çoğaltılabilir.

-- =====================================================================
-- Planlar
-- =====================================================================
create table planlar (
  kod text primary key,                       -- 'aylik', 'donemlik'
  ad text not null,
  aciklama text,
  donem odeme_donem not null,                 -- 'aylik' | 'yillik' (mevcut enum)
  ay_sayisi int not null check (ay_sayisi between 1 and 24),
  tutar numeric(10,2) not null,
  para_birimi text not null default 'TRY',
  aktif bool not null default true,
  sira int not null default 0
);

alter table planlar enable row level security;
create policy "planlar_public_read" on planlar for select using (aktif = true);

insert into planlar (kod, ad, aciklama, donem, ay_sayisi, tutar, sira) values
  ('aylik', 'Aylık', '1 ay sınırsız Premium erişim — istediğin zaman iptal et.', 'aylik', 1, 99.00, 10),
  ('donemlik', 'Dönemlik (3 ay)', '3 ay sınırsız Premium — aylığa göre %15 indirim.', 'aylik', 3, 249.00, 20);

-- =====================================================================
-- odemeler tablosuna iyzico-spesifik alanlar
-- =====================================================================
alter table odemeler
  add column conversation_id text unique,     -- iyzico conversationId — bizim üretiyoruz, callback'te eşleştiriyoruz
  add column plan_kodu text references planlar(kod) on delete restrict,
  add column callback_token text,             -- CF tarafından dönen token, retrieve için kullanıyoruz
  add column hata_mesaji text;

create index odemeler_conversation_idx on odemeler (conversation_id);

-- =====================================================================
-- Ödeme başarılı olunca premium_bitis'i güncelleyen RPC
-- Edge Function service-role ile çağıracak; idempotent (aynı conversation iki kez işlenmez).
-- =====================================================================
create or replace function public.odeme_premium_aktive(
  _user uuid,
  _conversation_id text,
  _plan_kodu text,
  _iyzico_ref text,
  _ham_yanit jsonb
) returns timestamptz
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan record;
  v_mevcut timestamptz;
  v_yeni timestamptz;
  v_durum odeme_durum;
begin
  -- İdempotency: bu conversation zaten işlendi mi?
  select durum into v_durum from odemeler where conversation_id = _conversation_id;
  if v_durum = 'basarili' then
    -- Zaten işlenmiş, mevcut bitiş tarihini dön
    return (select premium_bitis from kullanicilar where id = _user);
  end if;

  select * into v_plan from planlar where kod = _plan_kodu;
  if v_plan is null then
    raise exception 'Plan bulunamadı: %', _plan_kodu;
  end if;

  -- Mevcut premium bitişi varsa onun üzerine ekle (yenileme), yoksa now() üzerine
  select premium_bitis into v_mevcut from kullanicilar where id = _user;
  if v_mevcut is not null and v_mevcut > now() then
    v_yeni := v_mevcut + (v_plan.ay_sayisi || ' months')::interval;
  else
    v_yeni := now() + (v_plan.ay_sayisi || ' months')::interval;
  end if;

  update kullanicilar set premium_bitis = v_yeni where id = _user;

  update odemeler
    set durum = 'basarili',
        basarili_tarih = now(),
        iyzico_ref = _iyzico_ref,
        ham_yanit = _ham_yanit
    where conversation_id = _conversation_id;

  return v_yeni;
end $$;

-- service-role bu fonksiyonu kullanır; authenticated rolüne grant verilmiyor.
revoke all on function public.odeme_premium_aktive(uuid, text, text, text, jsonb) from public;
