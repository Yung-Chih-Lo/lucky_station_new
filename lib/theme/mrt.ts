export { mrtTheme, accents as mrtAccents } from './tokens'
import { accents, paperTokens } from './tokens'

export const mrtBrand = {
  ...paperTokens,
  accent: accents.mrt.base,
  accentHover: accents.mrt.hover,
  accentActive: accents.mrt.active,
  onAccent: accents.mrt.onAccent,
} as const
