-- MuhasebeLab — Admin → kullanıcı bildirim sistemi
--
-- bildirimler: admin tarafından yazılan duyurular (herkese açık)
-- bildirim_okundu: per-user okuma takibi
--
-- Hedefleme yok (MVP): tüm authenticated kullanıcılar tüm yayındaki
-- bildirimleri görür. Polling tabanlı (60s aralık), realtime yok.

create table public.bildirimler (
  id uuid primary key default gen_random_uuid(),
  baslik text not null check (length(baslik) between 1 and 200),
  metin text not null check (length(metin) between 1 and 2000),
  tip text not null default 'duyuru'
    check (tip in ('duyuru', 'bilgi', 'uyari', 'guncelleme')),
  link text,
  yayinda boolean not null default true,
  olusturan_id uuid default auth.uid()
    references public.kullanicilar(id) on delete set null,
  created_at timestamptz not null default now()
);

create index bildirimler_yayinda_created_idx
  on public.bildirimler (yayinda, created_at desc);

alter table public.bildirimler enable row level security;

-- Authenticated kullanıcı yayındaki bildirimleri okur
drop policy if exists "bildirim_authenticated_read" on public.bildirimler;
create policy "bildirim_authenticated_read" on public.bildirimler
  for select using (yayinda = true and auth.uid() is not null);

-- Admin tüm CRUD
drop policy if exists "bildirim_admin_select_all" on public.bildirimler;
create policy "bildirim_admin_select_all" on public.bildirimler
  for select using (public.is_admin());

drop policy if exists "bildirim_admin_insert" on public.bildirimler;
create policy "bildirim_admin_insert" on public.bildirimler
  for insert with check (public.is_admin());

drop policy if exists "bildirim_admin_update" on public.bildirimler;
create policy "bildirim_admin_update" on public.bildirimler
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "bildirim_admin_delete" on public.bildirimler;
create policy "bildirim_admin_delete" on public.bildirimler
  for delete using (public.is_admin());

-- Okuma takibi (per-user)
create table public.bildirim_okundu (
  bildirim_id uuid not null
    references public.bildirimler(id) on delete cascade,
  user_id uuid not null
    references public.kullanicilar(id) on delete cascade,
  okundu_at timestamptz not null default now(),
  primary key (bildirim_id, user_id)
);

create index bildirim_okundu_user_idx
  on public.bildirim_okundu (user_id);

alter table public.bildirim_okundu enable row level security;

drop policy if exists "okundu_own_select" on public.bildirim_okundu;
create policy "okundu_own_select" on public.bildirim_okundu
  for select using (auth.uid() = user_id);

drop policy if exists "okundu_own_insert" on public.bildirim_okundu;
create policy "okundu_own_insert" on public.bildirim_okundu
  for insert with check (auth.uid() = user_id);

drop policy if exists "okundu_own_delete" on public.bildirim_okundu;
create policy "okundu_own_delete" on public.bildirim_okundu
  for delete using (auth.uid() = user_id);

notify pgrst, 'reload schema';
