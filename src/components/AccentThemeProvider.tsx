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
