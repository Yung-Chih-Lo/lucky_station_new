import type { ThemeConfig } from 'antd'

export const traBrand = {
  bg: 'linear-gradient(135deg, #fef9e7 0%, #e0f2fe 100%)',
  bgFallback: '#f0f9ff',
  surface: 'rgba(255, 255, 255, 0.65)',
  surfaceStrong: 'rgba(255, 255, 255, 0.85)',
  text: '#1a1a2e',
  textMuted: '#475569',
  accent: '#F97316',
  accentHover: '#FB923C',
  accentActive: '#EA580C',
  onAccent: '#FFFFFF',
  border: 'rgba(15, 23, 42, 0.10)',
  borderStrong: 'rgba(15, 23, 42, 0.20)',
  maskBg: 'rgba(15, 23, 42, 0.45)',
  radiusSm: 6,
  radiusMd: 12,
  radiusLg: 20,
  blurAmount: 15,
} as const

export const traTheme: ThemeConfig = {
  token: {
    colorPrimary: traBrand.accent,
    colorBgBase: traBrand.bgFallback,
    colorTextBase: traBrand.text,
    colorBorder: traBrand.border,
    colorBgContainer: traBrand.surface,
    colorBgElevated: traBrand.surfaceStrong,
    borderRadius: traBrand.radiusMd,
    borderRadiusLG: traBrand.radiusLg,
    borderRadiusSM: traBrand.radiusSm,
    fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  },
  components: {
    Button: {
      colorPrimary: traBrand.accent,
      colorPrimaryHover: traBrand.accentHover,
      colorPrimaryActive: traBrand.accentActive,
      primaryColor: traBrand.onAccent,
      colorTextLightSolid: traBrand.onAccent,
      defaultBg: 'rgba(255, 255, 255, 0.7)',
      defaultColor: traBrand.text,
      defaultBorderColor: traBrand.borderStrong,
      controlHeightLG: 48,
      fontWeight: 600,
    },
    Checkbox: {
      colorText: traBrand.text,
      colorPrimary: traBrand.accent,
      colorPrimaryHover: traBrand.accentHover,
      colorWhite: traBrand.onAccent,
      colorBgContainer: 'rgba(255, 255, 255, 0.85)',
      colorBorder: traBrand.borderStrong,
    },
    Modal: {
      contentBg: traBrand.surfaceStrong,
      headerBg: 'transparent',
      titleColor: traBrand.text,
      colorText: traBrand.text,
      colorIcon: traBrand.text,
      colorIconHover: traBrand.accent,
    },
    Typography: {
      colorText: traBrand.text,
      colorTextHeading: traBrand.text,
    },
    Divider: {
      colorSplit: traBrand.border,
    },
    Empty: {
      colorText: traBrand.textMuted,
      colorTextDescription: traBrand.textMuted,
    },
    Tabs: {
      itemColor: traBrand.textMuted,
      itemSelectedColor: traBrand.accent,
      itemActiveColor: traBrand.accent,
      itemHoverColor: traBrand.text,
      inkBarColor: traBrand.accent,
    },
  },
}
