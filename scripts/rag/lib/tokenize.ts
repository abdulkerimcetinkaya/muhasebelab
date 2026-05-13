/**
 * Token sayma yardımcısı.
 *
 * OpenAI text-embedding-3-small tiktoken cl100k_base encoder kullanır.
 * Tam doğru saymak için tiktoken/gpt-tokenizer npm paketi gerekir;
 * bu dosya GİTHUB ACTIONS RUNNER'DA çalışacağı için ağır dependency
 * istemiyoruz — yaklaşık karakter-bazlı tahmin kullanıyoruz.
 *
 * Tahmin: Türkçe metinde 1 token ≈ 2.5 karakter (İngilizce'de 4).
 * 200-800 token aralığı dediğimizde gerçek değerden %20 sapabilir;
 * chunk hedefi 500 token tutulduğu için bu güvenli payın içinde.
 */

const TR_KARAKTER_PER_TOKEN = 2.5;

/** Bir metnin yaklaşık token sayısı. */
export const tokenSay = (metin: string): number => {
  return Math.ceil(metin.length / TR_KARAKTER_PER_TOKEN);
};

/** Token sayısına karşılık gelen karakter sayısı (chunk sınırı için). */
export const tokenToKarakter = (token: number): number => {
  return Math.floor(token * TR_KARAKTER_PER_TOKEN);
};
