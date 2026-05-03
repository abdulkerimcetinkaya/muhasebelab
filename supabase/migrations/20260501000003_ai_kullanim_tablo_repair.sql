-- ai_kullanim tablosunun gerçekten var olduğunu garantile (idempotent).
-- 20260425000001 migration kayıtlı görünmesine rağmen prod'da tablo bulunamıyor;
-- olası sebep: db reset / squash / transaction rollback. Bu repair tabloyu,
-- RLS'i ve politikayı kuvvetli olarak yeniden kurar.

create table if not exists ai_kullanim (
  kullanici_id uuid not null references auth.users(id) on delete cascade,
  tarih date not null default current_date,
  sayac int not null default 0 check (sayac >= 0),
  primary key (kullanici_id, tarih)
);

alter table ai_kullanim enable row level security;

drop policy if exists "ai_kullanim_self_select" on ai_kullanim;
create policy "ai_kullanim_self_select" on ai_kullanim
  for select using (auth.uid() = kullanici_id);

-- Yazma yalnız security definer RPC üzerinden — direkt yazma için politika yok

notify pgrst, 'reload schema';
