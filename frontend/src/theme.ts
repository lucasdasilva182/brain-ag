export const theme = {
  colors: {
    background: '#161615',
    surface: '#212120',
    surfaceRaised: '#2A2A28',
    primary: '#3FBE73',
    primaryLight: '#6FDB9A',
    primaryDark: '#2C8F55',
    accent: '#FFFFFF',
    text: '#F3F3F0',
    textMuted: '#9A9A93',
    border: '#34342F',
    danger: '#E8604C',
    dangerBg: 'rgba(232, 96, 76, 0.12)',
    warning: '#E8B34C',
  },
  font: {
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', -apple-system, sans-serif",
  },
  radius: '8px',
  spacing: (n: number) => `${n * 4}px`,
} as const;

export type Theme = typeof theme;
