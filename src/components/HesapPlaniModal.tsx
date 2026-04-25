import { HesapPlaniListesi } from './HesapPlaniListesi';
import { useEsc } from '../lib/hooks/use-esc';

interface Props {
  onKapat: () => void;
}

export const HesapPlaniModal = ({ onKapat }: Props) => {
  useEsc(onKapat);
  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4"
      onClick={onKapat}
    >
      <div
        className="bg-stone-50 dark:bg-zinc-900 max-w-5xl w-full max-h-[90vh] flex flex-col rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <HesapPlaniListesi onKapat={onKapat} modal />
      </div>
    </div>
  );
};
