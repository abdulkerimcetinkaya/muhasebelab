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
        bg: 'var(--bg)',
        'bg-warm': 'var(--bg-warm)',
        'bg-tint': 'var(--bg-tint)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          tint: 'var(--surface-tint)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          mute: 'var(--ink-mute)',
          quiet: 'var(--ink-quiet)',
        },
        line: {
          DEFAULT: 'var(--line)',
          soft: 'var(--line-soft)',
          strong: 'var(--line-strong)',
        },
        sky: {
          DEFAULT: 'var(--sky)',
          deep: 'var(--sky-deep)',
          soft: 'var(--sky-soft)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          deep: 'var(--accent-deep)',
          soft: 'var(--accent-soft)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          deep: 'var(--primary-deep)',
        },
        premium: {
          DEFAULT: 'var(--premium)',
          deep: 'var(--premium-deep)',
          soft: 'var(--premium-soft)',
        },
        copper: {
          DEFAULT: 'var(--copper)',
          deep: 'var(--copper-deep)',
          soft: 'var(--copper-soft)',
        },
        success: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
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
