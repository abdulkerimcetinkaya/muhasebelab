import { createHash } from 'node:crypto';

/** SHA-256 hash hesapla — content-based dedupe için. */
export const sha256 = (icerik: string | Buffer): string => {
  return createHash('sha256').update(icerik).digest('hex');
};
