import { useEffect } from 'react';

interface Props {
  title: string;
  description: string;
  /** Canonical URL — örn. "/sozluk/amortisman" (relative). */
  canonical?: string;
  /** OpenGraph type. Article tek sayfalar (sözlük terimi) için. */
  type?: 'website' | 'article';
  /** JSON-LD structured data nesnesi (schema.org formatında). */
  jsonLd?: Record<string, unknown>;
  /** Crawler index etmeli mi? false = noindex. */
  index?: boolean;
}

const SITE_BASLIK = 'MuhasebeLab';
const SITE_URL =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : '';

const meta = (selector: string, attr: 'name' | 'property', value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${selector}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, selector);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const linkRel = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/**
 * Sayfa başına title / meta description / OG tags / JSON-LD yönetir.
 * SPA olduğu için useEffect'te DOM'u günceller.
 *
 * Not: Tam SEO için BrowserRouter + sunucu tarafı render (prerender)
 * gerekir. Bu component sadece head meta'larını ayarlar — Google'ın JS
 * crawler'ı bunu okur ama statik HTML kadar güvenilir değil.
 */
export const SeoMeta = ({
  title,
  description,
  canonical,
  type = 'website',
  jsonLd,
  index = true,
}: Props) => {
  useEffect(() => {
    const tamBaslik = title.includes(SITE_BASLIK) ? title : `${title} — ${SITE_BASLIK}`;
    document.title = tamBaslik;

    meta('description', 'name', description);
    meta('robots', 'name', index ? 'index, follow' : 'noindex, nofollow');

    meta('og:site_name', 'property', SITE_BASLIK);
    meta('og:title', 'property', tamBaslik);
    meta('og:description', 'property', description);
    meta('og:type', 'property', type);
    meta('og:locale', 'property', 'tr_TR');

    meta('twitter:card', 'name', 'summary');
    meta('twitter:title', 'name', tamBaslik);
    meta('twitter:description', 'name', description);

    if (canonical && SITE_URL) {
      const tamUrl = `${SITE_URL}${canonical}`;
      linkRel('canonical', tamUrl);
      meta('og:url', 'property', tamUrl);
    }

    // JSON-LD structured data
    let scriptEl = document.head.querySelector<HTMLScriptElement>(
      'script[type="application/ld+json"][data-seo-meta]',
    );
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.setAttribute('type', 'application/ld+json');
        scriptEl.setAttribute('data-seo-meta', '');
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // Component unmount olunca temizle değil — sıradaki sayfa kendi
    // değerleriyle override edecek. Sadece JSON-LD'yi temizliyoruz çünkü
    // bir sonraki sayfada gerekmeyebilir.
    return () => {
      const el = document.head.querySelector(
        'script[type="application/ld+json"][data-seo-meta]',
      );
      el?.remove();
    };
  }, [title, description, canonical, type, jsonLd, index]);

  return null;
};
