import type { ThemeConfig } from 'antd'
import { mrtBrand, mrtTheme } from './mrt'
import { traBrand, traTheme } from './tra'

export type ThemeMode = 'mrt' | 'tra'

export { mrtBrand, mrtTheme, traBrand, traTheme }

export function themeFor(mode: ThemeMode): ThemeConfig {
  return mode === 'tra' ? traTheme : mrtTheme
}

/* Back-compat aliases for code that already imported `brand` / `brandTheme` /
   `brandCssVars` from the original single-file theme module. These all resolve
   to the MRT theme so existing imports keep working unchanged. */
export const brand = mrtBrand
export const brandTheme = mrtTheme
