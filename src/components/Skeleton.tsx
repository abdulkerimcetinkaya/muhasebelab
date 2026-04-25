// Yükleme sırasında içeriği taklit eden iskelet bloklar.
// `animate-pulse` Tailwind'in built-in animasyonu.

interface BlokProps {
  className?: string;
  yuvarlak?: 'sm' | 'lg' | 'xl' | 'full';
}

const RADIUS_MAP: Record<NonNullable<BlokProps['yuvarlak']>, string> = {
  sm: 'rounded-sm',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const Skeleton = ({ className = '', yuvarlak = 'lg' }: BlokProps) => (
  <div
    className={`bg-stone-200 dark:bg-zinc-800 animate-pulse ${RADIUS_MAP[yuvarlak]} ${className}`}
  />
);

interface SatirProps {
  satirSayisi?: number;
}

// Tablo/liste için n satırlık skeleton
export const SkeletonSatirlar = ({ satirSayisi = 5 }: SatirProps) => (
  <div className="space-y-3">
    {Array.from({ length: satirSayisi }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-4 border border-stone-100 dark:border-zinc-800 rounded-xl"
      >
        <Skeleton className="w-10 h-10" yuvarlak="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
        <Skeleton className="w-12 h-3" />
      </div>
    ))}
  </div>
);

// Kart grid için
export const SkeletonKartlar = ({ kartSayisi = 4 }: { kartSayisi?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {Array.from({ length: kartSayisi }).map((_, i) => (
      <div
        key={i}
        className="p-5 border border-stone-100 dark:border-zinc-800 rounded-xl space-y-3"
      >
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    ))}
  </div>
);
