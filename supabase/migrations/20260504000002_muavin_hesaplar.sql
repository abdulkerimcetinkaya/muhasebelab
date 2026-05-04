-- muavin_hesaplar tablosu — alt/yardımcı hesaplar (120.001, 320.001 vb.)
-- Strateji:
--   - Muavin tablo-driven: ana hesabın muavini varsa kullanımı zorunlu (UI dropdown + uyarı)
--   - Soft-delete: aktif=false olan muavinler dropdown'da görünmez ama eski referansları korur
--   - Sadece numerik kod (örn: 120.001, 120.001.001)
--   - ana_kod kod'un prefix'i olmalı (120 → 120.001)

begin;

create table public.muavin_hesaplar (
  kod          text primary key,
  ana_kod      text not null
               references public.hesap_plani(kod) on delete restrict,
  ad           text not null,
  tip          text not null check (tip in (
                 'musteri', 'tedarikci', 'banka',
                 'personel', 'kasa', 'stok', 'diger'
               )),
  aciklama     text,
  sira         int not null default 0,
  aktif        boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- Kod formatı: XXX.NNN, XXX.NNN.NNN ... (sadece numerik segmentler)
  constraint muavin_kod_format
    check (kod ~ '^[0-9]{3}(\.[0-9]+)+$'),

  -- ana_kod kod'un prefix'i olmalı (örn: ana_kod=120, kod=120.001)
  constraint muavin_ana_kod_uyumu
    check (kod like ana_kod || '.%')
);

create index muavin_hesaplar_ana_kod_idx on public.muavin_hesaplar(ana_kod);
create index muavin_hesaplar_aktif_idx on public.muavin_hesaplar(aktif) where aktif;

-- updated_at otomatik güncelleme
create or replace function public.muavin_hesaplar_updated_at()
returns trigger language plpgsql as $fn$
begin
  new.updated_at := now();
  return new;
end $fn$;

create trigger trg_muavin_hesaplar_updated_at
  before update on public.muavin_hesaplar
  for each row execute function public.muavin_hesaplar_updated_at();

-- RLS
alter table public.muavin_hesaplar enable row level security;

-- Herkese okuma (hesap_plani gibi public katalog)
create policy "muavin_hesaplar_public_read"
  on public.muavin_hesaplar for select using (true);

-- Admin tüm CRUD
create policy "muavin_hesaplar_admin_all"
  on public.muavin_hesaplar for all
  using (is_admin()) with check (is_admin());

commit;
