/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Serif"', '"Times New Roman"', 'serif'],
        body: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        // Alpha modifier desteği için: rgb(var(--xxx-rgb) / <alpha-value>)
        // Bu sayede `bg-brand/40` gibi class'lar çalışır
        bg: {
          DEFAULT: 'rgb(var(--bg-rgb) / <alpha-value>)',
          warm: 'rgb(var(--bg-warm-rgb) / <alpha-value>)',
          tint: 'rgb(var(--bg-tint-rgb) / <alpha-value>)',
        },
        'bg-warm': 'rgb(var(--bg-warm-rgb) / <alpha-value>)',
        'bg-tint': 'rgb(var(--bg-tint-rgb) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface-rgb) / <alpha-value>)',
          2: 'rgb(var(--surface-2-rgb) / <alpha-value>)',
          tint: 'var(--surface-tint)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink-rgb) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft-rgb) / <alpha-value>)',
          mute: 'rgb(var(--ink-mute-rgb) / <alpha-value>)',
          quiet: 'rgb(var(--ink-quiet-rgb) / <alpha-value>)',
        },
        line: {
          DEFAULT: 'rgb(var(--line-rgb) / <alpha-value>)',
          soft: 'rgb(var(--line-soft-rgb) / <alpha-value>)',
          strong: 'rgb(var(--line-strong-rgb) / <alpha-value>)',
        },
        sky: {
          DEFAULT: 'rgb(var(--blue-rgb) / <alpha-value>)',
          deep: 'rgb(var(--blue-deep-rgb) / <alpha-value>)',
          soft: 'rgb(var(--blue-soft-rgb) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--blue-rgb) / <alpha-value>)',
          deep: 'rgb(var(--blue-deep-rgb) / <alpha-value>)',
          soft: 'rgb(var(--blue-soft-rgb) / <alpha-value>)',
        },
        // Tek tutarlı mavi accent (skill: max 1 accent, sat<80%)
        brand: {
          DEFAULT: 'rgb(var(--blue-rgb) / <alpha-value>)',
          deep: 'rgb(var(--blue-deep-rgb) / <alpha-value>)',
          soft: 'rgb(var(--blue-soft-rgb) / <alpha-value>)',
          mute: 'rgb(var(--blue-mute-rgb) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--blue-rgb) / <alpha-value>)',
          deep: 'rgb(var(--blue-deep-rgb) / <alpha-value>)',
        },
        premium: {
          DEFAULT: 'rgb(var(--copper-rgb) / <alpha-value>)',
          deep: 'rgb(var(--copper-deep-rgb) / <alpha-value>)',
          soft: 'rgb(var(--copper-soft-rgb) / <alpha-value>)',
        },
        copper: {
          DEFAULT: 'rgb(var(--copper-rgb) / <alpha-value>)',
          deep: 'rgb(var(--copper-deep-rgb) / <alpha-value>)',
          soft: 'rgb(var(--copper-soft-rgb) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success-rgb) / <alpha-value>)',
          soft: 'rgb(var(--success-soft-rgb) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--danger-rgb) / <alpha-value>)',
          soft: 'rgb(var(--danger-soft-rgb) / <alpha-value>)',
        },
        // Geriye dönük
        mint: {
          DEFAULT: 'var(--sky)',
          deep: 'var(--sky-deep)',
          soft: 'var(--sky-soft)',
        },
        peach: {
          DEFAULT: 'var(--accent)',
          deep: 'var(--accent-deep)',
          soft: 'var(--accent-soft)',
        },
        jade: {
          DEFAULT: 'var(--sky-deep)',
          soft: 'var(--sky-soft)',
        },
        paper: {
          DEFAULT: 'var(--bg)',
          deep: 'var(--bg-warm)',
          inset: 'var(--surface)',
        },
        rule: {
          DEFAULT: 'var(--line)',
          strong: 'var(--line-strong)',
          bold: 'var(--line-strong)',
        },
        bordeaux: {
          DEFAULT: 'var(--accent-deep)',
          dark: 'var(--accent-deep)',
          tint: 'var(--accent-soft)',
        },
        ochre: {
          DEFAULT: 'var(--premium)',
          tint: 'var(--premium-soft)',
        },
        verdigris: {
          DEFAULT: 'var(--success)',
          tint: 'var(--success-soft)',
        },
        energy: {
          DEFAULT: 'var(--sky-deep)',
          deep: 'var(--accent-deep)',
          soft: 'var(--sky-soft)',
        },
      },
      borderRadius: {
        'pill': '999px',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'soft': 'var(--shadow-sm)',
        'md-soft': 'var(--shadow-md)',
        'lg-soft': 'var(--shadow-lg)',
        'xl-soft': 'var(--shadow-xl)',
        'mint': 'var(--shadow-mint)',
        'peach': 'var(--shadow-peach)',
      },
    },
  },
  plugins: [],
}
