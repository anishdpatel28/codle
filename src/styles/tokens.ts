// Design tokens for use in TS. Kept in sync with tailwind.config.js.
export const color = {
  bg: '#0B0D10',
  surface: '#15181D',
  surfaceRaised: '#1D2127',
  primary: '#E8E6E1',
  muted: '#878C94',
  hairline: '#262B32',
  accent: '#FF8A3D',
  danger: '#E5484D',
  success: '#5FBF77',
} as const;

// Glyph pool for the decrypt scramble.
export const scrambleGlyphs = '#%@&$01XZ/\\<>*?=+'.split('');

// Timing (ms) for the hint reveal.
export const reveal = {
  expandMs: 120,
  scrambleMs: 300,
  scrambleTickMs: 40,
  settlePerTick: 3,
  settleTickMs: 45,
  scanlineMs: 150,
} as const;
