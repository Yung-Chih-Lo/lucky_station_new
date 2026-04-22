import type { ThemeConfig } from 'antd'

export const brand = {
  bg: '#1E1B4B',
  surface: 'rgba(255, 255, 255, 0.06)',
  surfaceStrong: 'rgba(255, 255, 255, 0.10)',
  text: '#F5F3FF',
  textMuted: '#A5B4FC',
  accentGold: '#D4A574',
  accentGoldHover: '#E0B889',
  accentGoldActive: '#C39864',
  onAccent: '#1E1B4B',
  border: 'rgba(255, 255, 255, 0.12)',
  borderStrong: 'rgba(255, 255, 255, 0.22)',
  maskBg: 'rgba(15, 13, 40, 0.72)',
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 16,
} as const

export function brandCssVars(): string {
  return `:root {
  --brand-bg: ${brand.bg};
  --brand-surface: ${brand.surface};
  --brand-surface-strong: ${brand.surfaceStrong};
  --brand-text: ${brand.text};
  --brand-text-muted: ${brand.textMuted};
  --brand-accent-gold: ${brand.accentGold};
  --brand-accent-gold-hover: ${brand.accentGoldHover};
  --brand-on-accent: ${brand.onAccent};
  --brand-border: ${brand.border};
  --brand-border-strong: ${brand.borderStrong};
  --brand-radius-sm: ${brand.radiusSm}px;
  --brand-radius-md: ${brand.radiusMd}px;
  --brand-radius-lg: ${brand.radiusLg}px;
}`
}

export const brandTheme: ThemeConfig = {
  token: {
    colorPrimary: brand.accentGold,
    colorBgBase: brand.bg,
    colorTextBase: brand.text,
    colorBorder: brand.border,
    colorBgContainer: brand.surface,
    colorBgElevated: brand.surfaceStrong,
    borderRadius: brand.radiusMd,
    borderRadiusLG: brand.radiusLg,
    borderRadiusSM: brand.radiusSm,
    fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
  },
  components: {
    Button: {
      colorPrimary: brand.accentGold,
      colorPrimaryHover: brand.accentGoldHover,
      colorPrimaryActive: brand.accentGoldActive,
      primaryColor: brand.onAccent,
      colorTextLightSolid: brand.onAccent,
      defaultBg: 'transparent',
      defaultColor: brand.text,
      defaultBorderColor: brand.border,
      controlHeightLG: 48,
      fontWeight: 600,
    },
    Checkbox: {
      colorText: brand.text,
      colorPrimary: brand.accentGold,
      colorPrimaryHover: brand.accentGoldHover,
      colorWhite: brand.onAccent,
      colorBgContainer: 'transparent',
      colorBorder: brand.borderStrong,
    },
    Modal: {
      contentBg: brand.surfaceStrong,
      headerBg: 'transparent',
      titleColor: brand.text,
      colorText: brand.text,
      colorIcon: brand.text,
      colorIconHover: brand.accentGold,
    },
    Typography: {
      colorText: brand.text,
      colorTextHeading: brand.text,
    },
    Divider: {
      colorSplit: brand.border,
    },
    Empty: {
      colorText: brand.textMuted,
      colorTextDescription: brand.textMuted,
    },
  },
}
