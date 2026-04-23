export {
  accentForMode,
  accents,
  mrtTheme,
  paperTokens,
  themeFor,
  traTheme,
} from './tokens'
export type { ThemeMode } from './tokens'

// Back-compat re-exports: earlier code imported `brand`, `brandTheme`, or the
// mode-specific `mrtBrand` / `traBrand`. Nothing in the new surface consumes
// them, but keep them resolvable so a stray import does not break the build.
import { accents, mrtTheme, paperTokens } from './tokens'
export const brand = { ...paperTokens, accent: accents.mrt.base }
export const brandTheme = mrtTheme
