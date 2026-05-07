-- Yıllık plan ekleme + planlar tablosu yoksa baseline kur (self-healing).
--
-- Sorun: 20260425000002_iyzico.sql migration'ı bazı projelerde uygulanmamış
-- olabiliyor (squash, schema reset, manuel müdahale vb). O zaman bu insert
-- patlar. Bu migration tabloyu da kontrol edip yoksa kuruyor.
--
-- UI tarafı yıllık plan'ı (donem='yillik') arıyor ama eski seed'de sadece
-- 'aylik' (1 ay) ve 'donemlik' (3 ay) vardı, ikisi de donem='aylik'.
-- Bu migration "yillik" planı ekler (12 ay, ₺950, aylığa ₺79, %20 tasarruf).

do $$
begin
  if to_regclass('public.planlar') is null then
    -- Tablo yok — baseline ile yeniden kur (20260425000002 ile aynı şema)
    create table planlar (
      kod text primary key,
      ad text not null,
      aciklama text,
      donem odeme_donem not null,
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
  end if;
end $$;

-- Yıllık planı ekle (zaten varsa atla)
insert into planlar (kod, ad, aciklama, donem, ay_sayisi, tutar, sira)
  values (
    'yillik',
    'Yıllık',
    '12 ay sınırsız Premium — aylığa düşen ₺79, %20 tasarruf.',
    'yillik',
    12,
    950.00,
    30
  )
  on conflict (kod) do nothing;
