/** Design tokens — JS mirror of the CSS custom properties in index.css */
export const T = {
  terracotta: '#C04000',
  amber: '#FF8C00',
  cream: '#FFFDD0',
  beige: '#F5F5DC',
  gold: '#B8860B',
  bronze: '#CD7F32',
  dark: '#1A0A00',
  darkMid: '#2D1400',
  mid: '#5C3000',
  light: '#FFF8F0',
  white: '#FFFFFF',
  glass: 'rgba(255,253,208,0.15)',
  glassBorder: 'rgba(184,134,11,0.25)',
} as const;

export const gradMain = `linear-gradient(135deg, ${T.terracotta} 0%, ${T.amber} 100%)`;
export const gradGold = `linear-gradient(135deg, ${T.gold} 0%, ${T.bronze} 100%)`;
