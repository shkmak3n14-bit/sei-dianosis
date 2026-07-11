import { MD3LightTheme, configureFonts } from 'react-native-paper';

/** 既存Web（style.css）のグリーン基調に合わせたモバイルテーマ */
export const sieColors = {
  bg: '#f4f8f6',
  surface: '#ffffff',
  surfaceSoft: '#eef6f1',
  text: '#193229',
  muted: '#49665a',
  accent: '#177b53',
  accentStrong: '#0e5f3f',
  border: '#cfe1d8',
} as const;

const fontConfig = configureFonts({
  config: {
    fontFamily: 'System',
  },
});

export const sieTheme = {
  ...MD3LightTheme,
  fonts: fontConfig,
  colors: {
    ...MD3LightTheme.colors,
    primary: sieColors.accent,
    secondary: sieColors.accentStrong,
    background: sieColors.bg,
    surface: sieColors.surface,
    onSurface: sieColors.text,
    onBackground: sieColors.text,
    outline: sieColors.border,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: sieColors.surface,
      level2: sieColors.surfaceSoft,
    },
  },
};
