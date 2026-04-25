/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Newsreader', '"Iowan Old Style"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: 'var(--paper)',
          deep: 'var(--paper-deep)',
          inset: 'var(--paper-inset)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          mute: 'var(--ink-mute)',
        },
        rule: {
          DEFAULT: 'var(--rule)',
          strong: 'var(--rule-strong)',
          bold: 'var(--rule-bold)',
        },
        bordeaux: {
          DEFAULT: 'var(--bordeaux)',
          dark: 'var(--bordeaux-dark)',
          tint: 'var(--bordeaux-tint)',
        },
        ochre: {
          DEFAULT: 'var(--ochre)',
          tint: 'var(--ochre-tint)',
        },
        verdigris: {
          DEFAULT: 'var(--verdigris)',
          tint: 'var(--verdigris-tint)',
        },
        sumac: {
          DEFAULT: 'var(--sumac)',
        },
      },
      letterSpacing: {
        editorial: '0.18em',
        eyebrow: '0.32em',
        smcaps: '0.04em',
      },
    },
  },
  plugins: [],
}
