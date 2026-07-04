import { siteMetadata } from "@/data/metadata"
import type { Theme } from "@/lib/types"

export const themeColors: Record<Theme, { accent: string; accentBg: string; accentText: string }> =
  {
    blue: { accent: "#3b82f6", accentBg: "#eff6ff", accentText: "#1d4ed8" },
    purple: { accent: "#a855f7", accentBg: "#faf5ff", accentText: "#7e22ce" },
    green: { accent: "#22c55e", accentBg: "#f0fdf4", accentText: "#15803d" },
    orange: { accent: "#f97316", accentBg: "#fff7ed", accentText: "#c2410c" },
    rose: { accent: "#f43f5e", accentBg: "#fff1f2", accentText: "#be123c" },
    teal: { accent: "#14b8a6", accentBg: "#f0fdfa", accentText: "#0f766e" },
    indigo: { accent: "#6366f1", accentBg: "#eef2ff", accentText: "#4338ca" },
    amber: { accent: "#f59e0b", accentBg: "#fffbeb", accentText: "#b45309" },
    cyan: { accent: "#06b6d4", accentBg: "#ecfeff", accentText: "#0e7490" },
    violet: { accent: "#8b5cf6", accentBg: "#f5f3ff", accentText: "#6d28d9" },
  }

/**
 * Canonical, ordered list of the available accent color themes.
 * Useful anywhere the full set of themes needs to be iterated over (e.g. a theme picker menu).
 */
export const THEME_OPTIONS: Theme[] = Object.keys(themeColors) as Theme[]

/**
 * Returns the accent color, background color, and text color for the current theme.
 * The theme is determined by the `theme` property in `siteMetadata`.
 * This function is used to ensure consistent theming across Open Graph images and other components.
 */
export function getOgThemeColors() {
  return themeColors[siteMetadata.theme]
}
