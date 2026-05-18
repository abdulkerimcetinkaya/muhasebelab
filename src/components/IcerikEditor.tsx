import { useEffect, useMemo, useState } from 'react';
import {
  useCreateBlockNote,
  useBlockNoteEditor,
  useComponentsContext,
  FormattingToolbar,
  FormattingToolbarController,
  getFormattingToolbarItems,
} from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { Block } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { supabase } from '../lib/supabase';
import { ozelSema } from '../lib/blocknote-schema';
import { SozlukAdminModal } from './SozlukAdminModal';

interface Props {
  initialContent: unknown | null;
  onChange: (blocks: Block[]) => void;
}

const STORAGE_BUCKET = 'unite-gorseller';

// Drag-drop / paste edilen görseli Supabase Storage'a yükler, public URL döndürür.
const gorselYukle = async (file: File): Promise<string> => {
  const uzanti = file.name.split('.').pop()?.toLowerCase() || 'png';
  const yol = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${uzanti}`;

  console.log('[IcerikEditor] Yükleme başlıyor:', { yol, boyut: file.size, mime: file.type });

  const { data: oturum } = await supabase.auth.getSession();
  console.log('[IcerikEditor] Oturum:', oturum.session ? oturum.session.user.email : 'YOK');

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(yol, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    console.error('[IcerikEditor] Storage hatası:', error);
    alert(`Görsel yükleme hatası:\n\n${error.message}\n\n(Detay konsola yazıldı)`);
    throw new Error(`Görsel yükleme hatası: ${error.message}`);
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(yol);
  console.log('[IcerikEditor] Yükleme başarılı:', data.publicUrl);
  return data.publicUrl;
};

/**
 * Notion-tarzı blok editör (admin panelinde kullanılır).
 * BlockNote dokümanı JSON olarak `unites.icerik` kolonuna yazılır.
 *
 * Özel "term" inline style: kullanıcı metni seçince çıkan formatting toolbar'a
 * (bold/italic'in yanına) "Sözlük" butonu eklenir; tıklanınca açıklama modalı
 * açılır. Mevcut term üzerine tıklayınca buton seçili görünür ve modal
 * düzenleme/silme modunda açılır.
 *
 * Görsel yükleme: drag-drop / paste / slash-menu üzerinden eklenen görseller
 * `unite-gorseller` Storage bucket'ına yüklenir.
 */
export const IcerikEditor = ({ initialContent, onChange }: Props) => {
  const initialBlocks = useMemo(() => {
    if (!initialContent) return undefined;
    if (Array.isArray(initialContent) && initialContent.length > 0) {
      return initialContent as Block[];
    }
    return undefined;
  }, [initialContent]);

  const editor = useCreateBlockNote({
    schema: ozelSema,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialContent: initialBlocks as any,
    uploadFile: gorselYukle,
  });

  // Editör değiştiğinde parent'a bildir.
  const [hazir, setHazir] = useState(false);
  useEffect(() => {
    if (!editor) return;
    setHazir(true);
    const off = editor.onChange(() => {
      onChange(editor.document as unknown as Block[]);
    });
    return () => {
      if (typeof off === 'function') off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // Sözlük modal state — toolbar butonundan tetiklenir.
  const [sozlukAcik, setSozlukAcik] = useState(false);
  const [secilenMetin, setSecilenMetin] = useState('');
  const [mevcutAciklama, setMevcutAciklama] = useState('');

  const sozlukButonAc = () => {
    const secim = editor.getSelectedText();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aktifStiller: any = editor.getActiveStyles();
    const mevcut = (aktifStiller?.term as string | undefined) ?? '';
    // Eğer seçim yoksa ama cursor mevcut term üzerinde, mevcut aciklamayı düzenle.
    // (Aksi halde kullanıcıdan seçim yapmasını iste.)
    if (!secim && !mevcut) {
      alert('Önce bir kelime ya da kelime grubunu seç, sonra Sözlük butonuna bas.');
      return;
    }
    setSecilenMetin(secim || '—');
    setMevcutAciklama(mevcut);
    setSozlukAcik(true);
  };

  const sozlukKaydet = (aciklama: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.addStyles({ term: aciklama } as any);
    setSozlukAcik(false);
  };

  const sozlukSil = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.removeStyles({ term: true } as any);
    setSozlukAcik(false);
  };

  if (!hazir) {
    return (
      <div className="bn-icerik bn-yukleniyor">
        <div className="text-[13px] text-ink-soft font-mono tracking-[0.16em] uppercase">
          editör hazırlanıyor…
        </div>
      </div>
    );
  }

  return (
    <div className="bn-icerik">
      <BlockNoteView
        editor={editor}
        theme="light"
        slashMenu
        formattingToolbar={false}
        sideMenu
      >
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              {getFormattingToolbarItems()}
              <SozlukToolbarButton key="sozlukButton" onAc={sozlukButonAc} />
            </FormattingToolbar>
          )}
        />
      </BlockNoteView>

      <SozlukAdminModal
        acik={sozlukAcik}
        secilenMetin={secilenMetin}
        baslangicAciklama={mevcutAciklama}
        onKaydet={sozlukKaydet}
        onSil={sozlukSil}
        onKapat={() => setSozlukAcik(false)}
      />
    </div>
  );
};

/**
 * Formatting toolbar'da yer alan özel "Sözlük" butonu.
 * Mevcut term mark'ı varsa seçili görünür (toggle gibi); tıklanınca
 * parent'a haber verir (modal açılır).
 */
const SozlukToolbarButton = ({ onAc }: { onAc: () => void }) => {
  const Components = useComponentsContext();
  const editor = useBlockNoteEditor();

  if (!Components || !editor) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aktif = !!(editor.getActiveStyles() as any)?.term;

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={aktif ? 'Sözlük açıklamasını düzenle' : 'Sözlüğe ekle'}
      label="Sözlük"
      icon={<BookGlyph />}
      isSelected={aktif}
      onClick={() => onAc()}
    />
  );
};

// BlockNote butonları küçük SVG istiyor — lucide-react'ten Icon yerine
// inline SVG (BlockNote toolbar stil ezmesiyle uyumlu).
const BookGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);
