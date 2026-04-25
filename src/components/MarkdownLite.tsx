// Çok küçük bir markdown render — **bold**, satır başı `- ` listeleri ve paragraf
// Tam markdown değil, AI yanıtlarını okunabilir göstermek için yeterli.

interface Props {
  text: string;
  className?: string;
}

const inlineParse = (s: string, key: string) => {
  // **bold** parçalarını ayır
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    const m = /^\*\*(.+)\*\*$/.exec(p);
    if (m) return <strong key={`${key}-${i}`}>{m[1]}</strong>;
    return <span key={`${key}-${i}`}>{p}</span>;
  });
};

export const MarkdownLite = ({ text, className }: Props) => {
  const satirlar = text.split('\n');
  const elemanlar: React.ReactNode[] = [];
  let listeBuf: string[] = [];

  const listeyiKapat = (key: string) => {
    if (listeBuf.length === 0) return;
    elemanlar.push(
      <ul key={`l-${key}`} className="list-disc pl-5 space-y-1 my-2">
        {listeBuf.map((item, i) => (
          <li key={i}>{inlineParse(item, `${key}-${i}`)}</li>
        ))}
      </ul>,
    );
    listeBuf = [];
  };

  satirlar.forEach((raw, i) => {
    const satir = raw.trim();
    if (satir.startsWith('- ') || satir.startsWith('* ')) {
      listeBuf.push(satir.slice(2));
    } else if (satir === '') {
      listeyiKapat(`${i}`);
    } else {
      listeyiKapat(`${i}`);
      elemanlar.push(
        <p key={`p-${i}`} className="my-1.5">
          {inlineParse(satir, `p${i}`)}
        </p>,
      );
    }
  });
  listeyiKapat('end');

  return (
    <div
      className={`text-sm text-stone-800 dark:text-zinc-200 leading-relaxed font-medium ${className ?? ''}`}
    >
      {elemanlar}
    </div>
  );
};
