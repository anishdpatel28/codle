/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Design tokens — mirror src/styles/tokens.ts.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bg: '#0B0D10',
      surface: {
        DEFAULT: '#15181D',
        raised: '#1D2127',
      },
      primary: '#E8E6E1',
      muted: '#878C94',
      hairline: '#262B32',
      accent: '#FF8A3D',
      danger: '#E5484D',
      success: '#5FBF77',
    },
    fontFamily: {
      sans: ['"IBM Plex Sans"', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
    },
    // 4px base unit scale
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      6: '24px',
      8: '32px',
      12: '48px',
      14: '56px',
      16: '64px',
      24: '96px',
      32: '128px',
    },
    extend: {
      fontSize: {
        h1: ['40px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
        h2: ['22px', { lineHeight: '28px' }],
        body: ['16px', { lineHeight: '24px' }],
        meta: ['12px', { lineHeight: '16px', letterSpacing: '0.08em' }],
        mono: ['15px', { lineHeight: '22px' }],
        'mono-lg': ['28px', { lineHeight: '34px' }],
      },
      keyframes: {
        'cursor-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'scanline-sweep': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'flash-red': {
          '0%, 100%': { borderColor: '#262B32' },
          '30%': { borderColor: '#E5484D' },
        },
        'line-expand': {
          '0%': { maxHeight: '0px', opacity: '0' },
          '100%': { maxHeight: '48px', opacity: '1' },
        },
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'scanline-sweep': 'scanline-sweep 150ms ease-out',
        'flash-red': 'flash-red 400ms ease-out',
        'line-expand': 'line-expand 120ms ease-out',
      },
    },
  },
  plugins: [],
};
