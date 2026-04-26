/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-warm': 'var(--bg-warm)',
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
        primary: {
          DEFAULT: 'var(--primary)',
          deep: 'var(--primary-deep)',
          soft: 'var(--primary-soft)',
          tint: 'var(--primary-tint)',
        },
        energy: {
          DEFAULT: 'var(--energy)',
          deep: 'var(--energy-deep)',
          soft: 'var(--energy-soft)',
        },
        premium: {
          DEFAULT: 'var(--premium)',
          deep: 'var(--premium-deep)',
          soft: 'var(--premium-soft)',
        },
        success: {
          DEFAULT: 'var(--success)',
          soft: 'var(--success-soft)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          soft: 'var(--danger-soft)',
        },
        // Geriye dönük (eski editorial sınıfları)
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
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-deep)',
          tint: 'var(--primary-tint)',
        },
        ochre: {
          DEFAULT: 'var(--premium)',
          tint: 'var(--premium-soft)',
        },
        verdigris: {
          DEFAULT: 'var(--success)',
          tint: 'var(--success-soft)',
        },
      },
      borderRadius: {
        'pill': '999px',
        '4xl': '32px',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'soft': 'var(--shadow-sm)',
        'md-soft': 'var(--shadow-md)',
        'lg-soft': 'var(--shadow-lg)',
        'xl-soft': 'var(--shadow-xl)',
        'primary': 'var(--shadow-primary)',
        'energy': 'var(--shadow-energy)',
      },
    },
  },
  plugins: [],
}
