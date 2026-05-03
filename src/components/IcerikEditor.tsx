import { useEffect, useMemo, useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { Block } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { supabase } from '../lib/supabase';

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
 * Tema MuhasebeLab paletine (beyaz/mavi, Inter Tight) uydurulur — index.css'teki
 * `.bn-icerik` class'ı detaylı stil ezmesi yapar.
 *
 * Görsel yükleme: drag-drop / paste / slash-menu üzerinden eklenen görseller
 * `unite-gorseller` Storage bucket'ına yüklenir; sadece admin yazabilir, herkes okur.
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
    initialContent: initialBlocks,
    uploadFile: gorselYukle,
  });

  // Editör değiştiğinde parent'a bildir.
  // useEffect ile abone ol — onChange ref değişimine duyarsız tutmak için yerelde tut.
  const [hazir, setHazir] = useState(false);
  useEffect(() => {
    if (!editor) return;
    setHazir(true);
    const off = editor.onChange(() => {
      onChange(editor.document);
    });
    return () => {
      if (typeof off === 'function') off();
    };
    // editor referansı stabil; onChange ref değişimi ile yeniden abone olmamak için
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

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
        formattingToolbar
        sideMenu
      />
    </div>
  );
};
