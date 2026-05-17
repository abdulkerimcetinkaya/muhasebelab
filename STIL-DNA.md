# MuhasebeAkademi — Tasarım DNA'sı

**Son güncelleme:** 9 Mayıs 2026
**Hedef:** Tüm sayfalar tek bir görsel kimliği paylaşır. Token'lar `index.css` içinde, `tailwind.config.js`'e bağlı.

---

## 1. Karakter

- **Kirli beyaz dominant** + **slate mavi accent**
- Akademik ama modern · editorial restraint
- Hairline (1px) bordürler, küçük corner radius (8-12px)
- Sayısal tipografi (mono) restraint için
- Emoji yok — Thiings 3D PNG veya Lucide ikon

---

## 2. Token sistemi (asla hardcoded renk yok)

### Yüzey
| Token | Light | Dark | Kullanım |
|---|---|---|---|
| `bg` | `#f6f5f1` kirli beyaz | `#0f1620` slate near-black | sayfa zemini |
| `bg-warm` | `#efede7` | `#131b27` | sunken yüzey |
| `bg-tint` | `#faf9f5` | `#18212e` | hover/highlight |
| `surface` | `#ffffff` | `#1b2533` | kart yüzeyi |
| `surface-2` | `#f1efe9` | `#202b3b` | ikincil kart |

### Mürekkep (text)
| Token | Light | Kullanım |
|---|---|---|
| `ink` | `#1a2538` | başlık, primary text |
| `ink-soft` | `#4a5a72` | body text |
| `ink-mute` | `#7a8597` | meta, label |
| `ink-quiet` | `#aab3c0` | placeholder, disabled |

### Hairline
| Token | Kullanım |
|---|---|
| `line` | standart bordür |
| `line-soft` | minimal divider |
| `line-strong` | hover, active border |

### Accent (TEK accent — `brand`)
| Token | Hex | Kullanım |
|---|---|---|
| `brand` | `#2c4f7c` slate blue | CTA, link |
| `brand-deep` | `#1d3a5f` | hover, pressed |
| `brand-soft` | `#d8e3f0` | badge bg, tint |
| `brand-mute` | `#5d7ba2` | secondary blue |

### Anlamsal
| Token | Kullanım |
|---|---|
| `success` (mat sage) | doğru, tamam |
| `danger` (mat brick) | hata, uyarı |
| `premium` / `copper` (mat amber) | sadece Premium UI |

---

## 3. Tipografi

- **Display:** `Geist` (font-display, font-bold) — başlıklar, hero
- **Body:** `Geist` (font-body) — paragraf, button, label
- **Mono:** `Geist Mono` (font-mono, .tnum) — sayı, tag, eyebrow
- **Italic Serif:** `Instrument Serif` (`emph` class) — vurgu

**Hiyerarşi (skill kuralı):** ölçek değil, **font-weight + color** ile kur.
- H1: `text-3xl md:text-5xl tracking-tight font-bold`
- H2: `text-2xl md:text-3xl tracking-tight font-bold`
- H3: `text-xl font-bold tracking-tight`
- Body: `text-[15px] leading-relaxed`
- Eyebrow: `eyebrow` class (mono, uppercase, 0.16em tracking)

---

## 4. Component patterns

### Kart
- Sadece elevation gerekirse: `surface` veya `surface-lift`
- Aksi halde `border-t border-line` veya `divide-y divide-line` ile grupla
- Asla `bg-stone-X` veya `bg-zinc-X` kullanma

### Buton
- Primary: `btn btn-primary` (ink bg, bg text)
- Soft: `btn btn-soft` (surface, hairline)
- Ghost: `btn btn-ghost`
- Link-style: `btn-link`
- Tactile feedback: `:active { translateY(0.5px) }` (built-in)

### Chip / badge
- `chip` (default — line border)
- `chip chip-primary` (ink bg)
- `chip chip-mint` (sky/blue soft)
- `chip chip-success`, `chip chip-danger`, `chip chip-premium`

### Hairline divider
- `<hr class="hairline" />` veya `border-t border-line`
- Çift hairline: `hairline-strong`

---

## 5. Layout

- Sayfa wrapper: `max-w-[1240px] mx-auto px-5 sm:px-8`
- Geniş içerik (article): `max-w-5xl mx-auto`
- Hero: split layout (anti-center). Ortalanmış hero **yok**.
- Cards-grid: `grid-cols-1 md:grid-cols-2` veya asimetrik (2fr 1fr) — **3 eşit kolon yasak**.
- Boy: `min-h-[100dvh]` (asla `h-screen`).

---

## 6. Motion

- Page enter: `rise` class (0.6s cubic-bezier)
- Stagger: `rise-2`, `rise-3`... (delay)
- Spring physics for interactive elements (Framer): `stiffness: 100, damping: 20`
- Linear easing yasak — daima `cubic-bezier(0.22, 1, 0.36, 1)` veya spring

---

## 7. Yasaklar (skill rules)

- ❌ `text-stone-X`, `bg-stone-X`, `border-stone-X` (kullanılmaz — token kullan)
- ❌ `text-zinc-X`, `bg-zinc-X` (dark mode için ayrı kural — token auto-swap eder)
- ❌ `bg-[#...]`, `text-[#...]` hardcoded hex (token kullan)
- ❌ Saf siyah (`#000`) — `ink` token kullan
- ❌ `Inter` font (Geist'e geç)
- ❌ Emoji — Thiings veya Lucide
- ❌ 3 eşit kolon hero/feature row
- ❌ Centered hero (split kullan)
- ❌ Generic 3D box shadow / neon glow
- ❌ Pure white button glow / AI lila renk

---

## 8. Sayfa başlığı pattern (DergiPark esini)

Her major sayfa şu yapıda olmalı:

```
1. Eyebrow (mono, uppercase) — sayfa kategorisi
2. H1 (display, bold, tracking-tight)
3. Açıklama / lead (15px, ink-soft, max-w-2xl)
4. Meta satırı (mono, ink-mute, separator: ·)
5. CTA (primary + ghost)
```

Veya hero banner için (KonuSayfasi pattern):
- `bg-brand-deep` veya `bg-ink` zemin
- Beyaz / bg-tint metin
- White CTA primary, soft border ghost button
