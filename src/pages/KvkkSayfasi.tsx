import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

// KVKK Aydınlatma Metni — 6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında.
// Türkiye yasal zorunluluğu: kişisel veri toplarken aydınlatma metni gösterilmeli.
// Bu şablonu mutlaka KVKK uzmanı / avukat ile gözden geçirin; üretim öncesi resmi
// VERBİS kaydı ve veri sorumlusu beyanı gerekebilir.
export const KvkkSayfasi = () => {
  const nav = useNavigate();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={() => nav(-1)}
        className="flex items-center gap-2 text-sm text-stone-500 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-zinc-100 mb-8 font-semibold"
      >
        <Icon name="ArrowLeft" size={14} />
        <span>Geri</span>
      </button>

      <div className="text-[10px] tracking-[0.3em] uppercase text-stone-500 dark:text-zinc-500 font-bold mb-3">
        KVKK · Aydınlatma Metni
      </div>
      <h1 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-2">
        Kişisel Verilerin Korunması
      </h1>
      <p className="text-stone-600 dark:text-zinc-400 text-sm font-medium mb-10">
        6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, MuhasebeLab
        olarak kullanıcılarımızın kişisel verilerinin işlenmesine dair sizi aydınlatmak
        istiyoruz.
      </p>

      <div className="space-y-7 text-[15px] text-stone-700 dark:text-zinc-300 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            1. Veri Sorumlusu
          </h2>
          <p>
            MuhasebeLab platformu için veri sorumlusu sıfatıyla iletişim adresi:{' '}
            <a
              href="mailto:bilgi@muhasebelab.com"
              className="text-blue-700 dark:text-blue-400 underline"
            >
              bilgi@muhasebelab.com
            </a>
            . Verilerinizle ilgili tüm sorularınızı bu adrese iletebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            2. İşlenen Kişisel Veriler
          </h2>
          <p className="mb-3">Hesap oluşturma ve hizmet sunumu sırasında aşağıdaki kişisel
          verilerinizi topluyoruz:</p>
          <ul className="space-y-2 list-disc pl-6">
            <li><strong>Kimlik:</strong> kullanıcı adı (takma ad)</li>
            <li><strong>İletişim:</strong> e-posta adresi</li>
            <li><strong>Eğitim:</strong> üniversite, bölüm, sınıf bilgisi (opsiyonel)</li>
            <li><strong>Demografik:</strong> doğum yılı (opsiyonel)</li>
            <li><strong>Kullanım:</strong> çözdüğünüz sorular, ilerleme verileri, puan ve rozetler</li>
            <li><strong>İşlem:</strong> ödeme onayları (Premium aboneliği için, İyzico üzerinden — kart bilgileri bizde tutulmaz)</li>
            <li><strong>Teknik:</strong> tarayıcı, IP adresi, cihaz bilgisi (genel istatistik amacıyla)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            3. Verilerin İşleme Amaçları
          </h2>
          <ul className="space-y-2 list-disc pl-6">
            <li>Hesap oluşturma, kimlik doğrulama ve hizmet sunumu</li>
            <li>İlerleme takibi, puan/rozet sistemi ve kişiselleştirilmiş öneriler</li>
            <li>Ödeme işlemleri ve abonelik yönetimi</li>
            <li>İstatistik ve ürün geliştirme (anonimleştirilmiş)</li>
            <li>İzin verdiğiniz takdirde e-posta bülteni gönderimi</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            4. Hukuki Sebep
          </h2>
          <p>
            Verileriniz KVKK Madde 5'te öngörülen <em>"sözleşmenin kurulması ve ifası"</em>{' '}
            ile <em>"meşru menfaat"</em> hukuki sebeplerine, pazarlama iletişimi için ise{' '}
            <em>"açık rıza"</em>nıza dayalı olarak işlenmektedir.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            5. Veri Aktarımı
          </h2>
          <p className="mb-3">Verileriniz aşağıdaki üçüncü taraflara, yalnızca hizmet sunumu için gerekli olan kapsamla aktarılır:</p>
          <ul className="space-y-2 list-disc pl-6">
            <li><strong>Supabase</strong> (veri depolama, kimlik doğrulama — Avrupa Birliği)</li>
            <li><strong>Vercel</strong> (uygulama barındırma)</li>
            <li><strong>İyzico</strong> (yalnızca Premium aboneliği için ödeme)</li>
            <li><strong>Google Gemini</strong> (yalnızca AI asistan kullanımında, soru bağlamı)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            6. Saklama Süresi
          </h2>
          <p>
            Hesap aktif olduğu sürece veriler saklanır. Hesap silindikten 30 gün sonra tüm
            kişisel verileriniz (anonim istatistikler hariç) kalıcı olarak silinir.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            7. Haklarınız
          </h2>
          <p className="mb-3">KVKK Madde 11 kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="space-y-2 list-disc pl-6">
            <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşleme amacını ve hangi taraflara aktarıldığını öğrenme</li>
            <li>Yanlış işlenen verilerin düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini talep etme</li>
            <li>İşlemeye karşı itiraz etme</li>
            <li>Açık rızanızı her an geri çekme</li>
          </ul>
          <p className="mt-3">
            Talepleriniz için{' '}
            <a
              href="mailto:bilgi@muhasebelab.com"
              className="text-blue-700 dark:text-blue-400 underline"
            >
              bilgi@muhasebelab.com
            </a>{' '}
            adresine yazabilirsiniz; en geç 30 gün içinde yanıt veriyoruz.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold tracking-tight mb-3 text-stone-900 dark:text-zinc-100">
            8. Çerezler
          </h2>
          <p>
            MuhasebeLab yalnızca oturum yönetimi (giriş bilgisi) için zorunlu çerezleri
            kullanır. Pazarlama veya izleme amaçlı üçüncü taraf çerezi kullanmıyoruz.
          </p>
        </section>

        <section className="border-t border-stone-200 dark:border-zinc-800 pt-7">
          <p className="text-xs text-stone-500 dark:text-zinc-500 font-medium">
            Son güncelleme: 26 Nisan 2026 · Bu metin yasal değişiklikler ve hizmet
            kapsamımızdaki güncellemelere göre revize edilebilir; önemli değişiklikleri
            e-posta ile bildiririz.
          </p>
        </section>
      </div>
    </main>
  );
};
