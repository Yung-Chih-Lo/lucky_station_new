import type { ThemeConfig } from 'antd'

export const mrtBrand = {
  bg: '#1E1B4B',
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceStrong: 'rgba(255, 255, 255, 0.10)',
  text: '#F5F3FF',
  textMuted: '#A5B4FC',
  accent: '#D4A574',
  accentHover: '#E0B889',
  accentActive: '#C39864',
  onAccent: '#1E1B4B',
  border: 'rgba(255, 255, 255, 0.12)',
  borderStrong: 'rgba(255, 255, 255, 0.22)',
  maskBg: 'rgba(15, 13, 40, 0.72)',
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 16,
} as const

export const mrtTheme: ThemeConfig = {
  token: {
    colorPrimary: mrtBrand.accent,
    colorBgBase: mrtBrand.bg,
    colorTextBase: mrtBrand.text,
    colorBorder: mrtBrand.border,
    colorBgContainer: mrtBrand.surface,
    colorBgElevated: mrtBrand.surfaceStrong,
    borderRadius: mrtBrand.radiusMd,
    borderRadiusLG: mrtBrand.radiusLg,
    borderRadiusSM: mrtBrand.radiusSm,
    fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  },
  components: {
    Button: {
      colorPrimary: mrtBrand.accent,
      colorPrimaryHover: mrtBrand.accentHover,
      colorPrimaryActive: mrtBrand.accentActive,
      primaryColor: mrtBrand.onAccent,
      colorTextLightSolid: mrtBrand.onAccent,
      defaultBg: 'transparent',
      defaultColor: mrtBrand.text,
      defaultBorderColor: mrtBrand.border,
      controlHeightLG: 48,
      fontWeight: 600,
    },
    Checkbox: {
      colorText: mrtBrand.text,
      colorPrimary: mrtBrand.accent,
      colorPrimaryHover: mrtBrand.accentHover,
      colorWhite: mrtBrand.onAccent,
      colorBgContainer: 'transparent',
      colorBorder: mrtBrand.borderStrong,
    },
    Modal: {
      contentBg: mrtBrand.surfaceStrong,
      headerBg: 'transparent',
      titleColor: mrtBrand.text,
      colorText: mrtBrand.text,
      colorIcon: mrtBrand.text,
      colorIconHover: mrtBrand.accent,
    },
    Typography: {
      colorText: mrtBrand.text,
      colorTextHeading: mrtBrand.text,
    },
    Divider: {
      colorSplit: mrtBrand.border,
    },
    Empty: {
      colorText: mrtBrand.textMuted,
      colorTextDescription: mrtBrand.textMuted,
    },
    Tabs: {
      itemColor: mrtBrand.textMuted,
      itemSelectedColor: mrtBrand.accent,
      itemActiveColor: mrtBrand.accent,
      itemHoverColor: mrtBrand.text,
      inkBarColor: mrtBrand.accent,
    },
  },
}
