import { HesapPlaniListesi } from './HesapPlaniListesi';

interface Props {
  acik: boolean;
  onKapat: () => void;
}

export const HesapPlaniYanPanel = ({ acik, onKapat }: Props) => (
  <>
    {acik && (
      <div
        className="fixed inset-0 z-40 bg-stone-900/20 transition-opacity"
        onClick={onKapat}
      />
    )}
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-stone-50 dark:bg-zinc-900 z-50 slide-panel ${acik ? 'open' : ''} shadow-2xl flex flex-col`}
    >
      <HesapPlaniListesi onKapat={onKapat} modal={false} />
    </div>
  </>
);
