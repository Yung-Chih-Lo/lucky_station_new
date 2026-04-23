export { traTheme } from './tokens'
import { accents, paperTokens } from './tokens'

export const traBrand = {
  ...paperTokens,
  accent: accents.tra.base,
  accentHover: accents.tra.hover,
  accentActive: accents.tra.active,
  onAccent: accents.tra.onAccent,
} as const
