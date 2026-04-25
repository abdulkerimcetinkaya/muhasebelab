// İyzico REST API yardımcısı — V2 imzalama (HMAC-SHA256).
// Sandbox: https://sandbox-api.iyzipay.com  Prod: https://api.iyzipay.com
// API key/secret Supabase env'den okunuyor:
//   IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL

const enc = new TextEncoder();

const apiKey = (): string => Deno.env.get('IYZICO_API_KEY') ?? '';
const secretKey = (): string => Deno.env.get('IYZICO_SECRET_KEY') ?? '';
const baseUrl = (): string =>
  Deno.env.get('IYZICO_BASE_URL') ?? 'https://sandbox-api.iyzipay.com';

const hmacSha256Hex = async (key: string, payload: string): Promise<string> => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const base64 = (s: string): string => btoa(s);

const randomKey = (): string => `${Date.now()}-${crypto.randomUUID()}`;

// IYZWSv2 imzası: signature = hex(hmac_sha256(secret, randomKey + uri + body))
//                authString = "apiKey:" + key + "&randomKey:" + r + "&signature:" + sig
//                Authorization: IYZWSv2 base64(authString)
export const iyzicoIstek = async <T>(uri: string, body: unknown): Promise<T> => {
  if (!apiKey() || !secretKey()) {
    throw new Error(
      'iyzico API anahtarları ayarlı değil — Supabase env: IYZICO_API_KEY, IYZICO_SECRET_KEY',
    );
  }
  const r = randomKey();
  const bodyJson = JSON.stringify(body);
  const payload = r + uri + bodyJson;
  const signature = await hmacSha256Hex(secretKey(), payload);
  const authString = `apiKey:${apiKey()}&randomKey:${r}&signature:${signature}`;
  const authorization = `IYZWSv2 ${base64(authString)}`;

  const res = await fetch(`${baseUrl()}${uri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
      'x-iyzi-rnd': r,
    },
    body: bodyJson,
  });
  const json = (await res.json()) as T & { status?: string; errorMessage?: string };
  if (json.status && json.status !== 'success') {
    throw new Error(`iyzico: ${json.errorMessage ?? 'bilinmeyen hata'}`);
  }
  return json;
};

// =====================================================================
// CF (Checkout Form) — token bazlı, 3D Secure dahil
// =====================================================================

export interface CFInitYanit {
  status: string;
  token: string;
  paymentPageUrl: string;
  conversationId: string;
}

export interface CFRetrieveYanit {
  status: string;
  paymentStatus?: string;        // 'SUCCESS' | 'FAILURE' | ...
  paymentId?: string;
  conversationId: string;
  price?: number;
  paidPrice?: number;
  currency?: string;
  errorMessage?: string;
}

export interface SepetUrun {
  id: string;
  name: string;
  category1: string;
  itemType: 'VIRTUAL' | 'PHYSICAL';
  price: string;       // iyzico string olarak fiyat istiyor
}

export interface KullaniciBilgi {
  id: string;
  name: string;
  surname: string;
  email: string;
  identityNumber: string;        // mock TC — '11111111111' varsayılan
  registrationAddress: string;
  city: string;
  country: string;
  ip: string;
}

export interface CFInitIstek {
  locale: 'tr' | 'en';
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: 'TRY';
  basketId: string;
  paymentGroup: 'PRODUCT' | 'SUBSCRIPTION';
  callbackUrl: string;
  enabledInstallments: number[];
  buyer: KullaniciBilgi;
  shippingAddress: { contactName: string; city: string; country: string; address: string };
  billingAddress: { contactName: string; city: string; country: string; address: string };
  basketItems: SepetUrun[];
}

export const cfInit = (istek: CFInitIstek): Promise<CFInitYanit> =>
  iyzicoIstek('/payment/iyzipos/checkoutform/initialize/auth/ecom', istek);

export const cfRetrieve = (token: string, conversationId: string): Promise<CFRetrieveYanit> =>
  iyzicoIstek('/payment/iyzipos/checkoutform/auth/ecom/detail', {
    locale: 'tr',
    conversationId,
    token,
  });
