-- Hata bildirimi RLS'i sıkılaştırma:
-- Mevcut "hata_authenticated_insert" politikası user_id eşleşmesini kontrol etmiyor;
-- oturum açmış bir kullanıcı başkasının user_id'siyle bildirim yazabilir.
-- Yeni check: insert sırasında user_id ya null olmalı ya da auth.uid()'ye eşit olmalı.

drop policy if exists "hata_authenticated_insert" on soru_hatalari;

create policy "hata_authenticated_insert" on soru_hatalari
  for insert
  with check (
    auth.uid() is not null
    and (user_id is null or auth.uid() = user_id)
  );
