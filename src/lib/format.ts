export const paraFormat = (n: number | string | null | undefined): string => {
  if (n === 0 || n === '' || n === null || n === undefined) return '';
  const num = typeof n === 'string' ? Number(n) : n;
  if (Number.isNaN(num)) return '';
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const bugununTarihi = (): string => new Date().toISOString().split('T')[0];
