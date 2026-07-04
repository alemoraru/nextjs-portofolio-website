"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { siteMetadata } from "@/data/metadata"
import { THEME_OPTIONS } from "@/lib/og-theme"
import type { Theme } from "@/lib/types"

const ACCENT_THEME_STORAGE_KEY = "accent-theme"

interface AccentThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const AccentThemeContext = createContext<AccentThemeContextValue | null>(null)

function isValidTheme(value: string | null): value is Theme {
  return value !== null && (THEME_OPTIONS as string[]).includes(value)
}

/**
 * Reads the accent theme from `localStorage` and, if it's a recognized theme, sets it
 * as the `data-theme` attribute on `<html>`. No-ops if nothing valid is stored, or if
 * `localStorage` is unavailable (e.g. disabled storage, private browsing).
 *
 * @param storageKey - The `localStorage` key the accent theme is persisted under.
 * @param validThemes - The set of recognized theme values; anything else stored is ignored.
 */
function applyStoredAccentTheme(storageKey: string, validThemes: string[]) {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored && validThemes.indexOf(stored) !== -1) {
      document.documentElement.setAttribute("data-theme", stored)
    }
  } catch {
    // localStorage may be unavailable (e.g. disabled storage, private browsing).
  }
}

// Serializes `applyStoredAccentTheme` as a real function (rather than a hand-built string
// of JS) so its logic stays type-checked and reviewable; only the JSON-serialized arguments
// below are spliced into the emitted script, never raw code fragments. Runs synchronously,
// before React hydrates, so the stored accent color is applied before first paint;
// otherwise the page briefly flashes the server-rendered default (`siteMetadata.theme`)
// before switching to the visitor's saved choice.
const NO_FLASH_SCRIPT = `(${applyStoredAccentTheme.toString()})(${JSON.stringify(
  ACCENT_THEME_STORAGE_KEY
)}, ${JSON.stringify(THEME_OPTIONS)})`

/**
 * Provides the currently selected accent color theme and persists it to localStorage,
 * applying it to the document via the `data-theme` attribute. Falls back to
 * `siteMetadata.theme` when no (valid) value has been stored yet.
 */
export function AccentThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(siteMetadata.theme)

  useEffect(() => {
    const stored = localStorage.getItem(ACCENT_THEME_STORAGE_KEY)
    if (isValidTheme(stored)) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(ACCENT_THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <AccentThemeContext.Provider value={{ theme, setTheme }}>
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      {children}
    </AccentThemeContext.Provider>
  )
}

/**
 * Hook for reading and updating the current accent color theme.
 * Must be used within an `AccentThemeProvider`.
 */
export function useAccentTheme() {
  const context = useContext(AccentThemeContext)
  if (!context) {
    throw new Error("useAccentTheme must be used within an AccentThemeProvider")
  }
  return context
}
