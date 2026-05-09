#!/usr/bin/env node
/**
 * STIL-DNA token normalize script
 * - stone/zinc Tailwind class'larını semantic token'lara çevirir
 * - dark:zinc-X variant'ları kaldırır (token auto-swap eder)
 * - hardcoded hex bg/text'leri token'a çevirir
 *
 * Çalıştırma: node scripts/dna-token-normalize.mjs
 * Dosyalar: src/pages/**\/*.tsx + src/components/**\/*.tsx
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src/pages', 'src/components'];
const EXCLUDE = ['_legacy-reference.html'];

// =============================================================
// Mapping kuralları — uygulama sırası önemli (uzun pattern önce)
// =============================================================

/**
 * Type 1: dark: variant collapse — light + dark birleşik şart
 * Pattern: `(text|bg|border)-stone-N dark:(text|bg|border)-zinc-M` → token
 */
const DARK_COLLAPSE = [
  // Text
  [/\btext-stone-900\s+dark:text-zinc-(?:50|100|200)\b/g, 'text-ink'],
  [/\btext-stone-800\s+dark:text-zinc-(?:100|200|300)\b/g, 'text-ink'],
  [/\btext-stone-700\s+dark:text-zinc-(?:200|300|400)\b/g, 'text-ink-soft'],
  [/\btext-stone-600\s+dark:text-zinc-(?:300|400|500)\b/g, 'text-ink-soft'],
  [/\btext-stone-500\s+dark:text-zinc-(?:400|500|600)\b/g, 'text-ink-mute'],
  [/\btext-stone-400\s+dark:text-zinc-(?:500|600|700)\b/g, 'text-ink-quiet'],
  [/\btext-stone-300\s+dark:text-zinc-(?:600|700)\b/g, 'text-ink-quiet'],

  // Background
  [/\bbg-stone-50\s+dark:bg-zinc-9(?:00|50)(?:\/\d+)?\b/g, 'bg-bg-tint'],
  [/\bbg-stone-100\s+dark:bg-zinc-(?:800|900)(?:\/\d+)?\b/g, 'bg-surface-2'],
  [/\bbg-stone-200\s+dark:bg-zinc-(?:700|800)(?:\/\d+)?\b/g, 'bg-line-soft'],
  [/\bbg-white\s+dark:bg-zinc-(?:800|900)(?:\/\d+)?\b/g, 'bg-surface'],
  [/\bbg-stone-900\s+dark:bg-zinc-50\b/g, 'bg-ink'],

  // Border
  [/\bborder-stone-100\s+dark:border-zinc-(?:700|800|900)\b/g, 'border-line-soft'],
  [/\bborder-stone-200\s+dark:border-zinc-(?:700|800)(?:\/\d+)?\b/g, 'border-line'],
  [/\bborder-stone-300\s+dark:border-zinc-(?:600|700)\b/g, 'border-line-strong'],
  [/\bborder-stone-700\s+dark:border-zinc-(?:300|400)\b/g, 'border-line-strong'],
  [/\bborder-stone-800\s+dark:border-zinc-(?:200|300)\b/g, 'border-line-strong'],
  [/\bborder-stone-900\s+dark:border-zinc-(?:50|100|200)\b/g, 'border-ink'],
];

/**
 * Type 2: stand-alone stone/zinc → token
 */
const SOLO_STONE = [
  // Text
  [/\btext-stone-900\b/g, 'text-ink'],
  [/\btext-stone-800\b/g, 'text-ink'],
  [/\btext-stone-700\b/g, 'text-ink-soft'],
  [/\btext-stone-600\b/g, 'text-ink-soft'],
  [/\btext-stone-500\b/g, 'text-ink-mute'],
  [/\btext-stone-400\b/g, 'text-ink-quiet'],
  [/\btext-stone-300\b/g, 'text-ink-quiet'],

  // Background
  [/\bbg-stone-50\b/g, 'bg-bg-tint'],
  [/\bbg-stone-100\b/g, 'bg-surface-2'],
  [/\bbg-stone-200\b/g, 'bg-line-soft'],
  [/\bbg-stone-300\b/g, 'bg-line'],
  [/\bbg-stone-800\b/g, 'bg-ink-soft'],
  [/\bbg-stone-900\b/g, 'bg-ink'],

  // Border
  [/\bborder-stone-100\b/g, 'border-line-soft'],
  [/\bborder-stone-200\b/g, 'border-line'],
  [/\bborder-stone-300\b/g, 'border-line-strong'],
  [/\bborder-stone-700\b/g, 'border-line-strong'],
  [/\bborder-stone-800\b/g, 'border-line-strong'],
  [/\bborder-stone-900\b/g, 'border-ink'],

  // Hover variants
  [/\bhover:bg-stone-50\b/g, 'hover:bg-bg-tint'],
  [/\bhover:bg-stone-100\b/g, 'hover:bg-surface-2'],
  [/\bhover:bg-stone-200\b/g, 'hover:bg-line-soft'],
  [/\bhover:text-stone-900\b/g, 'hover:text-ink'],
  [/\bhover:text-stone-700\b/g, 'hover:text-ink-soft'],
  [/\bhover:border-stone-300\b/g, 'hover:border-line-strong'],
  [/\bhover:border-stone-400\b/g, 'hover:border-ink'],
  [/\bhover:border-stone-700\b/g, 'hover:border-line-strong'],
  [/\bhover:border-stone-900\b/g, 'hover:border-ink'],
];

/**
 * Type 3: stand-alone zinc → token (genelde dark: prefix'siz kaldı)
 */
const SOLO_ZINC = [
  // dark: prefix'li olanlar token kullandığında gereksiz, sil
  [/\bdark:text-zinc-(?:50|100|200)\b/g, ''],
  [/\bdark:text-zinc-(?:300|400)\b/g, ''],
  [/\bdark:text-zinc-(?:500|600)\b/g, ''],
  [/\bdark:text-zinc-(?:700|800|900)\b/g, ''],
  [/\bdark:bg-zinc-(?:800|900|950)(?:\/\d+)?\b/g, ''],
  [/\bdark:bg-zinc-(?:700|800)\/40\b/g, ''],
  [/\bdark:bg-zinc-(?:50|100|200)\b/g, ''],
  [/\bdark:border-zinc-(?:700|800|900)(?:\/\d+)?\b/g, ''],
  [/\bdark:border-zinc-(?:300|400|500|600)\b/g, ''],
  [/\bdark:hover:bg-zinc-\d{3}(?:\/\d+)?\b/g, ''],
  [/\bdark:hover:text-zinc-\d{3}\b/g, ''],
  [/\bdark:hover:border-zinc-\d{3}\b/g, ''],
  [/\bdark:focus:border-zinc-\d{3}\b/g, ''],
  [/\bdark:focus:bg-zinc-\d{3}(?:\/\d+)?\b/g, ''],
  [/\bdark:focus:text-zinc-\d{3}\b/g, ''],
  [/\bdark:focus:ring-zinc-\d{3}\b/g, ''],
  [/\bdark:divide-zinc-\d{3}(?:\/\d+)?\b/g, ''],
  [/\bdark:placeholder:text-zinc-\d{3}\b/g, ''],
  [/\bdark:placeholder-zinc-\d{3}\b/g, ''],
  // raw zinc (dark: prefix'siz kaldı — yanlış kullanım)
  [/\bbg-zinc-(?:800|900|950)(?:\/\d+)?\b/g, 'bg-surface'],
  [/\bbg-zinc-(?:700|800)\/40\b/g, 'bg-surface-2'],
  [/\btext-zinc-(?:50|100|200)\b/g, 'text-ink'],
  [/\btext-zinc-(?:300|400)\b/g, 'text-ink-soft'],
  [/\btext-zinc-(?:500|600)\b/g, 'text-ink-mute'],
  [/\btext-zinc-(?:700|800|900)\b/g, 'text-ink'],
  [/\bborder-zinc-(?:700|800|900)\b/g, 'border-line'],
  [/\bborder-zinc-(?:300|400|500|600)\b/g, 'border-line-strong'],
  // text-stone-50 (light text on dark bg) → text-bg (paper white token)
  [/\btext-stone-50\b/g, 'text-bg'],
  [/\btext-stone-100\b/g, 'text-bg-tint'],
  [/\bbg-white\b/g, 'bg-surface'],
  [/\bborder-white(?:\/\d+)?\b/g, 'border-bg'],
  // shadow-stone — hairline dark shadow → kaldır veya minimize
  [/\bshadow-stone-900\/\d+\b/g, ''],
  [/\bshadow-amber-500\/\d+\b/g, ''],
  // Premium border (amber) — Premium UI'da kaldı
  [/\bborder-amber-400\b/g, 'border-premium'],
];

/**
 * Type 8: red → danger (skill: desaturated)
 */
const RED_TO_DANGER = [
  [/\bbg-red-50\b/g, 'bg-danger-soft'],
  [/\bbg-red-100\b/g, 'bg-danger-soft'],
  [/\bbg-red-900\/10\b/g, 'bg-danger/10'],
  [/\bbg-red-900\/20\b/g, 'bg-danger/20'],
  [/\bbg-red-950\/30\b/g, 'bg-danger/20'],

  [/\btext-red-300\b/g, 'text-danger'],
  [/\btext-red-400\b/g, 'text-danger'],
  [/\btext-red-500\b/g, 'text-danger'],
  [/\btext-red-600\b/g, 'text-danger'],
  [/\btext-red-700\b/g, 'text-danger'],

  [/\bborder-red-200\b/g, 'border-danger-soft'],
  [/\bborder-red-700\b/g, 'border-danger'],
  [/\bborder-red-400\b/g, 'border-danger'],
  [/\bborder-red-800\/40\b/g, 'border-danger/40'],
  [/\bborder-red-900\b/g, 'border-danger'],

  // Dark variants — kaldır (token auto-swap)
  [/\sdark:text-red-\d{3}\b/g, ''],
  [/\sdark:bg-red-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:border-red-\d{3}(?:\/\d+)?\b/g, ''],
];

/**
 * Type 9: violet/purple → mavi/copper (AI Lila ban)
 */
const VIOLET_TO_NEUTRAL = [
  [/\bbg-violet-700\b/g, 'bg-brand-deep'],
  [/\bbg-violet-600\b/g, 'bg-brand'],
  [/\bbg-violet-800\b/g, 'bg-brand-deep'],
  [/\bbg-violet-500\b/g, 'bg-brand'],

  [/\bhover:bg-violet-800\b/g, 'hover:bg-brand-deep'],
  [/\bhover:bg-violet-500\b/g, 'hover:bg-brand'],

  [/\sdark:bg-violet-\d{3}\b/g, ''],
  [/\sdark:hover:bg-violet-\d{3}\b/g, ''],

  [/\btext-violet-600\b/g, 'text-brand'],
  [/\btext-violet-700\b/g, 'text-brand-deep'],

  [/\bbg-teal-700\b/g, 'bg-success'],
  [/\btext-teal-600\b/g, 'text-success'],
];

/**
 * Type 10: sky → brand (mavi)
 */
const SKY_TO_BRAND = [
  [/\btext-sky-600\b/g, 'text-brand'],
  [/\btext-sky-300\b/g, 'text-brand-mute'],
  [/\btext-sky-900\b/g, 'text-brand-deep'],
  [/\bbg-sky-100\b/g, 'bg-brand-soft'],
  [/\bbg-sky-950\/40\b/g, 'bg-brand/20'],
  [/\sdark:bg-sky-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:text-sky-\d{3}\b/g, ''],
];

/**
 * Type 11: orphan dark: variants (token zaten auto-swap eder)
 * Bu variant'lar token'ı override eder ve light/dark tutarsızlığa yol açar.
 */
const DARK_ORPHANS = [
  // amber dark variants (token: premium auto-swap eder)
  [/\sdark:bg-amber-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:text-amber-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:border-amber-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:from-amber-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:to-amber-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:hover:bg-amber-\d{3}(?:\/\d+)?\b/g, ''],

  // blue dark variants (token: brand auto-swap eder)
  [/\sdark:bg-blue-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:text-blue-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:border-blue-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:from-blue-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:to-blue-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:hover:bg-blue-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:hover:border-blue-\d{3}(?:\/\d+)?\b/g, ''],

  // emerald dark variants
  [/\sdark:bg-emerald-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:text-emerald-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:border-emerald-\d{3}(?:\/\d+)?\b/g, ''],

  // rose dark variants
  [/\sdark:bg-rose-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:text-rose-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:border-rose-\d{3}(?:\/\d+)?\b/g, ''],

  // red dark variants
  [/\sdark:bg-red-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:text-red-\d{3}(?:\/\d+)?\b/g, ''],
  [/\sdark:border-red-\d{3}(?:\/\d+)?\b/g, ''],
];

/**
 * Type 4: blue Tailwind → brand token
 */
const BLUE_TO_BRAND = [
  // Konkret hex'ler (KonuSayfasi'ndaki bg-[#1d4ed8] vb.)
  [/\bbg-\[#1d4ed8\]\b/g, 'bg-brand-deep'],
  [/\bbg-\[#2563eb\]\b/g, 'bg-brand'],
  [/\bbg-\[#1e40af\]\b/g, 'bg-brand-deep'],

  // Tailwind blue → brand
  [/\bbg-blue-50\b/g, 'bg-brand-soft'],
  [/\bbg-blue-100\b/g, 'bg-brand-soft'],
  [/\bbg-blue-600\b/g, 'bg-brand'],
  [/\bbg-blue-700\b/g, 'bg-brand-deep'],
  [/\bbg-blue-700\/40\b/g, 'bg-brand-deep/40'],
  [/\bbg-blue-800\b/g, 'bg-brand-deep'],
  [/\bbg-blue-900\b/g, 'bg-brand-deep'],

  [/\btext-blue-50\b/g, 'text-brand-soft'],
  [/\btext-blue-100(?:\/\d+)?\b/g, 'text-bg-tint'],
  [/\btext-blue-200\b/g, 'text-brand-soft'],
  [/\btext-blue-300\b/g, 'text-brand-mute'],
  [/\btext-blue-400\b/g, 'text-brand-mute'],
  [/\btext-blue-600\b/g, 'text-brand'],
  [/\btext-blue-700\b/g, 'text-brand'],
  [/\btext-blue-800\b/g, 'text-brand-deep'],
  [/\btext-blue-900\b/g, 'text-brand-deep'],
  [/\btext-blue-950\b/g, 'text-brand-deep'],

  [/\bborder-blue-200\b/g, 'border-brand-soft'],
  [/\bborder-blue-300(?:\/\d+)?\b/g, 'border-brand-soft'],
  [/\bborder-blue-400\b/g, 'border-brand-mute'],
  [/\bborder-blue-600\b/g, 'border-brand'],
  [/\bborder-blue-700\b/g, 'border-brand-deep'],

  [/\bhover:bg-blue-50\b/g, 'hover:bg-brand-soft'],
  [/\bhover:bg-blue-100\b/g, 'hover:bg-brand-soft'],
  [/\bhover:bg-blue-700\b/g, 'hover:bg-brand-deep'],
  [/\bhover:bg-blue-700\/40\b/g, 'hover:bg-brand-deep/40'],
  [/\bhover:bg-blue-800\b/g, 'hover:bg-brand-deep'],
  [/\bhover:text-blue-700\b/g, 'hover:text-brand'],
  [/\bhover:text-blue-400\b/g, 'hover:text-brand-mute'],

  // group-hover varyantları
  [/\bgroup-hover:text-blue-700\b/g, 'group-hover:text-brand'],
  [/\bgroup-hover:text-blue-400\b/g, 'group-hover:text-brand-mute'],
];

/**
 * Type 5: amber → premium (copper)
 */
const AMBER_TO_PREMIUM = [
  [/\bbg-amber-50\b/g, 'bg-premium-soft'],
  [/\bbg-amber-100\b/g, 'bg-premium-soft'],
  [/\bbg-amber-200\b/g, 'bg-premium-soft'],
  [/\bbg-amber-300\b/g, 'bg-premium'],
  [/\bbg-amber-400\b/g, 'bg-premium'],
  [/\bbg-amber-500\b/g, 'bg-premium'],
  [/\bbg-amber-600\b/g, 'bg-premium-deep'],
  [/\bbg-amber-700\b/g, 'bg-premium-deep'],
  [/\bhover:bg-amber-300\b/g, 'hover:bg-premium'],

  [/\btext-amber-100\b/g, 'text-premium-soft'],
  [/\btext-amber-200\b/g, 'text-premium-soft'],
  [/\btext-amber-300\b/g, 'text-premium'],
  [/\btext-amber-400\b/g, 'text-premium'],
  [/\btext-amber-500\b/g, 'text-premium'],
  [/\btext-amber-600\b/g, 'text-premium'],
  [/\btext-amber-700\b/g, 'text-premium-deep'],
  [/\btext-amber-800\b/g, 'text-premium-deep'],
  [/\btext-amber-900\b/g, 'text-premium-deep'],

  [/\bborder-amber-200\b/g, 'border-premium-soft'],
  [/\bborder-amber-300\b/g, 'border-premium'],
  [/\bborder-amber-400\b/g, 'border-premium'],
  [/\bborder-amber-700\b/g, 'border-premium-deep'],
  [/\bborder-amber-800\/40\b/g, 'border-premium-deep/40'],
  [/\bborder-amber-900\b/g, 'border-premium-deep'],

  [/\bfrom-amber-\d{2,3}(?:\/\d+)?\b/g, 'from-premium-soft'],
  [/\bto-amber-\d{2,3}(?:\/\d+)?\b/g, 'to-premium-soft'],
];

/**
 * Type 6: emerald → success
 */
const EMERALD_TO_SUCCESS = [
  [/\bbg-emerald-50\b/g, 'bg-success-soft'],
  [/\bbg-emerald-100\b/g, 'bg-success-soft'],
  [/\bbg-emerald-200\b/g, 'bg-success-soft'],
  [/\bbg-emerald-500\b/g, 'bg-success'],
  [/\bbg-emerald-600\b/g, 'bg-success'],
  [/\bbg-emerald-700\b/g, 'bg-success'],
  [/\bbg-emerald-800\b/g, 'bg-success'],
  [/\bbg-emerald-600\/30\b/g, 'bg-success/30'],
  [/\bhover:bg-emerald-700\b/g, 'hover:bg-success'],
  [/\bhover:bg-emerald-800\b/g, 'hover:bg-success'],

  [/\btext-emerald-50\b/g, 'text-success-soft'],
  [/\btext-emerald-100\b/g, 'text-success-soft'],
  [/\btext-emerald-200\b/g, 'text-success-soft'],
  [/\btext-emerald-300\b/g, 'text-success'],
  [/\btext-emerald-400\b/g, 'text-success'],
  [/\btext-emerald-500\b/g, 'text-success'],
  [/\btext-emerald-600\b/g, 'text-success'],
  [/\btext-emerald-700\b/g, 'text-success'],
  [/\btext-emerald-800\b/g, 'text-success'],

  [/\bborder-emerald-200\b/g, 'border-success-soft'],
  [/\bborder-emerald-300\b/g, 'border-success-soft'],
  [/\bborder-emerald-500\b/g, 'border-success'],
  [/\bborder-emerald-600\b/g, 'border-success'],
  [/\bborder-emerald-700\/50\b/g, 'border-success/50'],
  [/\bborder-emerald-700\b/g, 'border-success'],

  [/\bhover:border-emerald-500\b/g, 'hover:border-success'],
  [/\bhover:border-emerald-600\b/g, 'hover:border-success'],
  [/\bfocus:border-emerald-500\b/g, 'focus:border-success'],

  [/\bfrom-emerald-\d{2,3}\b/g, 'from-success'],
  [/\bto-emerald-\d{2,3}\b/g, 'to-success'],
];

/**
 * Type 7: rose → danger
 */
const ROSE_TO_DANGER = [
  [/\bbg-rose-50\b/g, 'bg-danger-soft'],
  [/\bbg-rose-100\b/g, 'bg-danger-soft'],
  [/\bbg-rose-200\b/g, 'bg-danger-soft'],
  [/\bbg-rose-500\b/g, 'bg-danger'],
  [/\bbg-rose-600\b/g, 'bg-danger'],
  [/\bbg-rose-700\b/g, 'bg-danger'],
  [/\bhover:bg-rose-700\b/g, 'hover:bg-danger'],

  [/\btext-rose-300\b/g, 'text-danger'],
  [/\btext-rose-400\b/g, 'text-danger'],
  [/\btext-rose-500\b/g, 'text-danger'],
  [/\btext-rose-600\b/g, 'text-danger'],
  [/\btext-rose-700\b/g, 'text-danger'],
  [/\btext-rose-800\b/g, 'text-danger'],

  [/\bborder-rose-200\b/g, 'border-danger-soft'],
  [/\bborder-rose-300\b/g, 'border-danger-soft'],
  [/\bborder-rose-500\b/g, 'border-danger'],
  [/\bborder-rose-600\b/g, 'border-danger'],
  [/\bborder-rose-700\b/g, 'border-danger'],

  [/\bfocus:border-rose-500\b/g, 'focus:border-danger'],
  [/\bfocus:border-rose-600\b/g, 'focus:border-danger'],
];

/**
 * Type 12: Extra patterns + edge cases
 */
const EXTRA = [
  // Gradient patterns
  [/\bfrom-blue-(?:50|100)\b/g, 'from-brand-soft'],
  [/\bfrom-blue-(?:600|700|800|900)\b/g, 'from-brand'],
  [/\bto-blue-(?:50|100)\b/g, 'to-brand-soft'],
  [/\bto-blue-(?:600|700|800|900)\b/g, 'to-brand'],
  [/\bfrom-rose-\d{2,3}\b/g, 'from-danger-soft'],
  [/\bto-rose-\d{2,3}\b/g, 'to-danger-soft'],
  [/\bfrom-emerald-\d{2,3}\b/g, 'from-success-soft'],
  [/\bto-emerald-\d{2,3}\b/g, 'to-success-soft'],

  // Hover/focus border specifics
  [/\bhover:border-blue-500\b/g, 'hover:border-brand'],
  [/\bhover:border-blue-600\b/g, 'hover:border-brand-deep'],
  [/\bhover:border-amber-500\b/g, 'hover:border-premium'],
  [/\bhover:border-amber-600\b/g, 'hover:border-premium-deep'],
  [/\bhover:border-rose-400\b/g, 'hover:border-danger'],
  [/\bhover:border-rose-500\b/g, 'hover:border-danger'],
  [/\bhover:border-emerald-400\b/g, 'hover:border-success'],

  // Borders
  [/\bborder-blue-100\b/g, 'border-brand-soft'],
  [/\bborder-rose-400\b/g, 'border-danger'],

  // hover:bg with various shades
  [/\bhover:bg-rose-700\b/g, 'hover:bg-danger'],
  [/\bhover:bg-rose-800\b/g, 'hover:bg-danger'],
  [/\bhover:bg-rose-(?:50|100)\b/g, 'hover:bg-danger-soft'],

  // Rose remaining
  [/\bbg-rose-300\b/g, 'bg-danger'],
  [/\bbg-rose-400\b/g, 'bg-danger'],

  // Text
  [/\btext-emerald-900\b/g, 'text-success'],

  // bg-stone-950 (rare modal overlay)
  [/\bbg-stone-950(?:\/\d+)?\b/g, 'bg-ink/55'],

  // Orange — Premium UI accent
  [/\btext-orange-500\b/g, 'text-premium'],
  [/\bbg-orange-500\b/g, 'bg-premium'],
];

const ALL_RULES = [
  ...DARK_COLLAPSE,
  ...SOLO_STONE,
  ...SOLO_ZINC,
  ...BLUE_TO_BRAND,
  ...AMBER_TO_PREMIUM,
  ...EMERALD_TO_SUCCESS,
  ...ROSE_TO_DANGER,
  ...RED_TO_DANGER,
  ...VIOLET_TO_NEUTRAL,
  ...SKY_TO_BRAND,
  ...DARK_ORPHANS,
  ...EXTRA,
];

// =============================================================
// Scan + apply
// =============================================================

function* walkDir(dir) {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of ents) {
    const p = path.join(dir, ent.name);
    if (EXCLUDE.includes(ent.name)) continue;
    if (ent.isDirectory()) yield* walkDir(p);
    else if (/\.(tsx|ts)$/.test(ent.name)) yield p;
  }
}

let totalReplacements = 0;
let touchedFiles = 0;

for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walkDir(root)) {
    const orig = fs.readFileSync(file, 'utf8');
    let next = orig;
    let fileReplacements = 0;

    for (const [pattern, replacement] of ALL_RULES) {
      const matches = next.match(pattern);
      if (matches) {
        fileReplacements += matches.length;
        next = next.replace(pattern, replacement);
      }
    }

    // Whitespace temizliği — SADECE className="..." içinde, indentation'a dokunma!
    // Pattern: className="...class1...class2..." → fazla boşluğu temizle.
    next = next.replace(/className="([^"]*)"/g, (_match, classes) => {
      const cleaned = classes.trim().replace(/\s+/g, ' ');
      return `className="${cleaned}"`;
    });
    // Template literal: className={`...`} formatı için ayrı pass
    next = next.replace(/className=\{`([^`]*)`\}/g, (_match, classes) => {
      // Template literal içinde ${} interpolation olabilir — sadece ardışık boşlukları azalt
      const cleaned = classes.replace(/  +/g, ' ').replace(/^ +| +$/g, '');
      return `className={\`${cleaned}\`}`;
    });

    if (next !== orig) {
      fs.writeFileSync(file, next);
      console.log(`✓ ${file}  (${fileReplacements} replacements)`);
      totalReplacements += fileReplacements;
      touchedFiles++;
    }
  }
}

console.log(`\n=== ÖZET ===`);
console.log(`Toplam dosya: ${touchedFiles}`);
console.log(`Toplam replacement: ${totalReplacements}`);
