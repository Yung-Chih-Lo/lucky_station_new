import type { ThemeConfig } from 'antd'

export type ThemeMode = 'mrt' | 'tra'

export const paperTokens = {
  bg: '#F3ECDC',
  surface: '#FFFBF0',
  surfaceElevated: '#FFFFFF',
  ink: '#1A1D2B',
  inkMuted: '#6B6557',
  rule: 'rgba(26, 29, 43, 0.15)',
  ruleStrong: 'rgba(26, 29, 43, 0.28)',
  seal: '#C8954A',
  success: '#2F7D4F',
  warn: '#F2B63D',
  maskBg: 'rgba(26, 29, 43, 0.45)',
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 16,
} as const

export const accents = {
  mrt: {
    base: '#E8421C',
    hover: '#F25A36',
    active: '#C6361A',
    soft: 'rgba(232, 66, 28, 0.12)',
    onAccent: '#FFFFFF',
  },
  tra: {
    base: '#15365C',
    hover: '#1F4A78',
    active: '#0F2A49',
    soft: 'rgba(21, 54, 92, 0.12)',
    onAccent: '#FFFFFF',
  },
} as const

export function accentForMode(mode: ThemeMode) {
  return accents[mode]
}

function buildTheme(mode: ThemeMode): ThemeConfig {
  const a = accents[mode]
  return {
    token: {
      colorPrimary: a.base,
      colorBgBase: paperTokens.bg,
      colorTextBase: paperTokens.ink,
      colorBorder: paperTokens.rule,
      colorBgContainer: paperTokens.surface,
      colorBgElevated: paperTokens.surfaceElevated,
      borderRadius: paperTokens.radiusMd,
      borderRadiusLG: paperTokens.radiusLg,
      borderRadiusSM: paperTokens.radiusSm,
      fontFamily: 'var(--font-sans), "Noto Sans TC", system-ui, sans-serif',
    },
    components: {
      Button: {
        colorPrimary: a.base,
        colorPrimaryHover: a.hover,
        colorPrimaryActive: a.active,
        primaryColor: a.onAccent,
        colorTextLightSolid: a.onAccent,
        defaultBg: paperTokens.surface,
        defaultColor: paperTokens.ink,
        defaultBorderColor: paperTokens.ruleStrong,
        controlHeightLG: 48,
        fontWeight: 600,
      },
      Checkbox: {
        colorText: paperTokens.ink,
        colorPrimary: a.base,
        colorPrimaryHover: a.hover,
        colorWhite: a.onAccent,
        colorBgContainer: paperTokens.surface,
        colorBorder: paperTokens.ruleStrong,
      },
      Modal: {
        contentBg: paperTokens.surfaceElevated,
        headerBg: 'transparent',
        titleColor: paperTokens.ink,
        colorText: paperTokens.ink,
        colorIcon: paperTokens.ink,
        colorIconHover: a.base,
      },
      Typography: {
        colorText: paperTokens.ink,
        colorTextHeading: paperTokens.ink,
      },
      Divider: {
        colorSplit: paperTokens.rule,
      },
      Empty: {
        colorText: paperTokens.inkMuted,
        colorTextDescription: paperTokens.inkMuted,
      },
      Tabs: {
        itemColor: paperTokens.inkMuted,
        itemSelectedColor: a.base,
        itemActiveColor: a.base,
        itemHoverColor: paperTokens.ink,
        inkBarColor: a.base,
      },
    },
  }
}

export const mrtTheme = buildTheme('mrt')
export const traTheme = buildTheme('tra')

export function themeFor(mode: ThemeMode): ThemeConfig {
  return mode === 'tra' ? traTheme : mrtTheme
}
