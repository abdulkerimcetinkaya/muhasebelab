-- Sprint 4 — Hedefli bildirim
-- bildirimler.hedef_tipi: 'herkes' (default) veya 'belirli'
-- bildirim_hedef tablosu: belirli kullanıcılara hedefli bildirimler için

begin;

-- 1) hedef_tipi kolonu
alter table public.bildirimler
  add column if not exists hedef_tipi text not null default 'herkes'
  check (hedef_tipi in ('herkes', 'belirli'));

-- 2) bildirim_hedef tablosu
create table if not exists public.bildirim_hedef (
  bildirim_id uuid not null
    references public.bildirimler(id) on delete cascade,
  user_id uuid not null
    references public.kullanicilar(id) on delete cascade,
  primary key (bildirim_id, user_id)
);

create index if not exists bildirim_hedef_user_id_idx on public.bildirim_hedef(user_id);
create index if not exists bildirim_hedef_bildirim_id_idx on public.bildirim_hedef(bildirim_id);

alter table public.bildirim_hedef enable row level security;

-- 3) bildirim_hedef RLS
-- Authenticated: kendi user_id'siyle eşleşen satırları okur (kendisinin hedeflenip hedeflenmediğini bilmek için zaten policy)
drop policy if exists "bildirim_hedef_self_read" on public.bildirim_hedef;
create policy "bildirim_hedef_self_read" on public.bildirim_hedef
  for select using (auth.uid() = user_id);

-- Admin tüm CRUD
drop policy if exists "bildirim_hedef_admin_all" on public.bildirim_hedef;
create policy "bildirim_hedef_admin_all" on public.bildirim_hedef
  for all using (public.is_admin()) with check (public.is_admin());

-- 4) bildirimler okuma policy'si — hedefleme uyumlu
drop policy if exists "bildirim_authenticated_read" on public.bildirimler;
create policy "bildirim_authenticated_read" on public.bildirimler
  for select using (
    yayinda = true
    and auth.uid() is not null
    and (
      hedef_tipi = 'herkes'
      or exists (
        select 1 from public.bildirim_hedef h
        where h.bildirim_id = bildirimler.id and h.user_id = auth.uid()
      )
    )
  );

notify pgrst, 'reload schema';

commit;
