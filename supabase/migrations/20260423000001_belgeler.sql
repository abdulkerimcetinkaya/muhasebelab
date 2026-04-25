-- =====================================================================
-- BELGELER (sorulara ekli fatura/perakende-fis/cek/senet/dekont)
-- =====================================================================
-- Statik veride 35 sorunun belgeleri elle yazılmıştı; artık DB'den okunacak.
-- Şema esnek tutuluyor (jsonb): tip ayrımı uygulamada Belge discriminated union
-- ile yapılıyor (src/types/index.ts → Belge).

alter table sorular
  add column if not exists belgeler jsonb not null default '[]'::jsonb;

-- Sanity check: dizi olduğundan emin ol
alter table sorular
  add constraint sorular_belgeler_array_check
  check (jsonb_typeof(belgeler) = 'array');
