-- Sprint 4 ek: bildirimleri segment bazlı hedefleme
-- hedef_tipi enum'ı: 'herkes' | 'premium' | 'free' | 'belirli'
-- 'premium': aktif premium_bitis olan kullanıcılar
-- 'free': premium_bitis null veya geçmiş olanlar

begin;

-- 1) check constraint güncelle
alter table public.bildirimler drop constraint if exists bildirimler_hedef_tipi_check;
alter table public.bildirimler add constraint bildirimler_hedef_tipi_check
  check (hedef_tipi in ('herkes', 'premium', 'free', 'belirli'));

-- 2) SELECT policy güncelle — segmentlere göre
drop policy if exists "bildirim_authenticated_read" on public.bildirimler;
create policy "bildirim_authenticated_read" on public.bildirimler
  for select using (
    yayinda = true
    and auth.uid() is not null
    and (
      hedef_tipi = 'herkes'
      or (
        hedef_tipi = 'premium'
        and exists (
          select 1 from public.kullanicilar k
          where k.id = auth.uid()
            and k.premium_bitis is not null
            and k.premium_bitis > now()
        )
      )
      or (
        hedef_tipi = 'free'
        and exists (
          select 1 from public.kullanicilar k
          where k.id = auth.uid()
            and (k.premium_bitis is null or k.premium_bitis <= now())
        )
      )
      or (
        hedef_tipi = 'belirli'
        and exists (
          select 1 from public.bildirim_hedef h
          where h.bildirim_id = bildirimler.id and h.user_id = auth.uid()
        )
      )
    )
  );

notify pgrst, 'reload schema';

commit;
