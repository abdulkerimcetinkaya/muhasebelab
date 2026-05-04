-- Admin kullanıcı yönetimi için RLS — Sprint 1 (görüntüleme)
-- Admin: ilerleme, aktivite, kazanilan_rozetler, odemeler tablolarını okuyabilir
-- (kullanıcı detay sayfasında gösterilecek)

begin;

create policy "ilerleme_admin_select" on ilerleme
  for select using (is_admin());

create policy "aktivite_admin_select" on aktivite
  for select using (is_admin());

create policy "kazanilan_rozetler_admin_select" on kazanilan_rozetler
  for select using (is_admin());

create policy "odemeler_admin_select" on odemeler
  for select using (is_admin());

commit;
