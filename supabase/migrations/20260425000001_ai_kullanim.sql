-- =====================================================================
-- AI KULLANIM QUOTA — Free kullanıcı 3 sorgu/gün, Premium sınırsız
-- =====================================================================
-- Karar (25 Nisan 2026): AI muhasebe asistanı freemium hibrit'in parçası.
-- Free: 3 sorgu/gün (UTC tarih bazlı), Premium: sınırsız.
-- Edge Function ai_quota_artir RPC'sini çağırır; aşıma giderse 429 döner.

create table if not exists ai_kullanim (
  kullanici_id uuid not null references auth.users(id) on delete cascade,
  tarih date not null default current_date,
  sayac int not null default 0 check (sayac >= 0),
  primary key (kullanici_id, tarih)
);

alter table ai_kullanim enable row level security;

-- Kullanıcı sadece kendi sayaçlarını okuyabilir (UI'da kalan göstermek için)
drop policy if exists "ai_kullanim_self_select" on ai_kullanim;
create policy "ai_kullanim_self_select" on ai_kullanim
  for select using (auth.uid() = kullanici_id);

-- Yazma yalnız security definer RPC üzerinden — direkt insert/update yasak
-- (politika yok = anon/authenticated için yazma kapalı)

-- Atomic kontrol+artır RPC
create or replace function ai_quota_artir(_max int default 3)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  _uid uuid := auth.uid();
  _sayac int;
begin
  if _uid is null then
    return json_build_object('izin_var', false, 'sayac', 0, 'limit', _max, 'hata', 'oturum yok');
  end if;

  -- Bugünkü satırı oluştur veya kilitle
  insert into ai_kullanim (kullanici_id, tarih, sayac)
  values (_uid, current_date, 0)
  on conflict (kullanici_id, tarih) do nothing;

  select sayac into _sayac
  from ai_kullanim
  where kullanici_id = _uid and tarih = current_date
  for update;

  if _sayac >= _max then
    return json_build_object('izin_var', false, 'sayac', _sayac, 'limit', _max);
  end if;

  update ai_kullanim
  set sayac = sayac + 1
  where kullanici_id = _uid and tarih = current_date;

  return json_build_object('izin_var', true, 'sayac', _sayac + 1, 'limit', _max);
end;
$$;

revoke all on function ai_quota_artir(int) from public;
grant execute on function ai_quota_artir(int) to authenticated;
