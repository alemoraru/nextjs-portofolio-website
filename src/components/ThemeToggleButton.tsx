"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaMoon, FaSun } from "react-icons/fa6"

/**
 * A functional component that renders a button to toggle between light and dark themes.
 */
export default function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 mt-1 rounded-full transition-colors cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200"
      aria-label="Toggle Dark Mode"
    >
      {resolvedTheme === "dark" ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
    </button>
  )
}
