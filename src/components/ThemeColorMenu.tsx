"use client"

import { motion, type Variants } from "framer-motion"
import { FaCheck } from "react-icons/fa"
import { themeColors, THEME_OPTIONS } from "@/lib/og-theme"
import { cn } from "@/lib/utils"
import type { Theme } from "@/lib/types"

interface ThemeColorMenuProps {
  isOpen: boolean
  activeTheme: Theme
  onSelect: (theme: Theme) => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut", staggerChildren: 0.025 },
  },
}

const swatchVariants: Variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0 },
}

/**
 * Popover menu of accent color swatches, opened by right-clicking or long-pressing
 * the theme toggle button. Highlights the currently active accent color and shows
 * a name tooltip on hover. Animates in on open; disappears immediately on close.
 */
export default function ThemeColorMenu({ isOpen, activeTheme, onSelect }: ThemeColorMenuProps) {
  if (!isOpen) return null

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "origin-top-right absolute right-0 mt-2 w-52",
        "bg-white dark:bg-gray-800",
        "border border-gray-300 dark:border-gray-700",
        "rounded-lg shadow-xl backdrop-blur-sm",
        "p-3 z-50"
      )}
    >
      <div className="grid grid-cols-5 gap-2">
        {THEME_OPTIONS.map(theme => {
          const isSelected = theme === activeTheme
          return (
            <motion.div
              key={theme}
              variants={swatchVariants}
              className="group relative flex items-center justify-center"
            >
              <button
                onClick={() => onSelect(theme)}
                aria-label={`Switch to ${theme} theme`}
                className={cn(
                  "relative w-7 h-7 rounded-full cursor-pointer",
                  "transition-transform duration-150 hover:scale-110 active:scale-95",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  "focus-visible:ring-accent-500 dark:focus-visible:ring-offset-gray-800",
                  isSelected && "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800"
                )}
                style={{ backgroundColor: themeColors[theme].accent }}
              >
                {isSelected && (
                  <FaCheck className="absolute inset-0 m-auto w-3 h-3 text-white drop-shadow" />
                )}
              </button>

              <span
                className={cn(
                  "pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 z-10",
                  "whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium capitalize",
                  "bg-gray-900 text-white dark:bg-gray-700",
                  "opacity-0 scale-95 transition-all duration-150",
                  "group-hover:opacity-100 group-hover:scale-100"
                )}
              >
                {theme}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
