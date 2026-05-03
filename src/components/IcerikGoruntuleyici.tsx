import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import type { Block } from '@blocknote/core';
import { useMemo } from 'react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface Props {
  icerik: unknown | null;
}

/**
 * Read-only BlockNote viewer. UniteSayfasi'nda kullanıcı tarafında
 * üniteye ait konu anlatımını gösterir. Boşsa null döner — caller boş
 * durumu (örn. "İçerik henüz hazırlanmadı") kendi karar versin.
 */
export const IcerikGoruntuleyici = ({ icerik }: Props) => {
  const blocks = useMemo<Block[] | undefined>(() => {
    if (!icerik) return undefined;
    if (Array.isArray(icerik) && icerik.length > 0) return icerik as Block[];
    return undefined;
  }, [icerik]);

  const editor = useCreateBlockNote({
    initialContent: blocks,
  });

  if (!blocks) return null;

  return (
    <div className="bn-icerik bn-okunur">
      <BlockNoteView editor={editor} editable={false} theme="light" />
    </div>
  );
};
