-- MuhasebeLab — Puan + yardım takibi yeniden tasarımı
--
-- Yeni puanlama:
--   Hatasız + yardımsız çözüm  → tam puan (kolay 5 / orta 10 / zor 20)
--   AI asistan kullanıldı       → tam − 2 (ipucu özelliği UI'dan kaldırıldı)
--   Çözüm gösterildi            → 0 puan (kilitli)
--   Min puan 0 (negatif yok)
--
-- Streak: artık SORU ÇÖZME değil, GÜNLÜK GİRİŞ bazlı. App, oturum
-- açıldığında bugünün tarihi için aktivite tablosuna upsert yapacak
-- (cozulen_sayi 0 ile, soru çözüldükçe artar).
--
-- Best-score: aynı soru tekrar çözülürse en yüksek puan kazanılan kayıt
-- yarışı kazanır (yukle aşamasında frontend hesaplar).

alter table public.ilerleme
  add column if not exists kullanilan_ai boolean not null default false;

alter table public.ilerleme
  add column if not exists cozum_gosterildi boolean not null default false;

-- Kazanılan puanı her satırda saklamak: backend tek-kaynak-doğruluk olur,
-- frontend total puan hesabını basit bir SUM ile yapar.
alter table public.ilerleme
  add column if not exists kazanilan_puan int;

comment on column public.ilerleme.kullanilan_ai is
  'Soru çözümü sırasında AI asistanı açıldıysa true → puan = tam_puan - 2';
comment on column public.ilerleme.cozum_gosterildi is
  'Kullanıcı çözümü gösterdiyse true → puan = 0 (kilitli)';
comment on column public.ilerleme.kazanilan_puan is
  'Bu çözüm kayıtında gerçekten kazanılan puan (0..tam_puan). Null = eski veri.';

notify pgrst, 'reload schema';
