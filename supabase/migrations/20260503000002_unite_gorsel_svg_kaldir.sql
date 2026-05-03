-- MuhasebeLab — unite-gorseller bucket'tan SVG mime type kaldırıldı
--
-- SVG dosyaları içlerinde <script> taşıyabilir. Şu anda <img> ile
-- render edildiği için pratik XSS riski yok, ama defense-in-depth
-- amacıyla kaldırılıyor: editör zaten SVG'ye ihtiyaç duymuyor (raster
-- görseller — karikatür, illustration — yeterli).

update storage.buckets
   set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
 where id = 'unite-gorseller';
