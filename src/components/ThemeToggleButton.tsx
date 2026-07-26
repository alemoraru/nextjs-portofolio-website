"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import React, { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { FaChevronDown } from "react-icons/fa"
import { FaMoon, FaSun } from "react-icons/fa6"
import { useAccentTheme } from "@/components/AccentThemeProvider"
import ThemeColorMenu from "@/components/ThemeColorMenu"
import { useClickOutside } from "@/hooks/useClickOutside"
import { cn } from "@/lib/utils"
import type { Theme } from "@/lib/types"

const LONG_PRESS_DURATION_MS = 500
const LONG_PRESS_MOVE_THRESHOLD_PX = 10

/**
 * Runs `apply` inside a circular view-transition reveal centered at (x, y),
 * falling back to applying it immediately if the browser doesn't support the API.
 * Returns a promise that resolves once the transition has fully finished — callers
 * should defer any other state changes (e.g. closing the color menu) until then,
 * since updates made while the transition is in flight are hidden inside its
 * frozen before/after snapshots and won't visibly animate.
 *
 * `apply` is committed via `flushSync` so React writes the DOM change (the theme
 * class) synchronously before the transition captures its "new" snapshot; without
 * it React batches the update, the snapshot captures the old theme, and the reveal
 * appears to freeze before the theme abruptly pops in.
 */
function runViewTransitionReveal(x: number, y: number, apply: () => void): Promise<void> {
  if (!document.startViewTransition) {
    apply()
    return Promise.resolve()
  }

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const transition = document.startViewTransition(() => {
    flushSync(apply)
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  })

  return transition.finished
}

/**
 * A functional component that renders a button to toggle between light and dark themes.
 * Right-clicking (or long-pressing on touch devices) opens a menu to switch the accent color
 * theme instead; a small caret provides the same menu via keyboard/click.
 */
export default function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false)
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const { theme: accentTheme, setTheme: setAccentTheme } = useAccentTheme()

  const containerRef = useRef<HTMLDivElement>(null)
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressFiredRef = useRef(false)
  const suppressNextClickRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useClickOutside(containerRef, () => setIsColorMenuOpen(false))

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-700",
          "bg-gray-100 dark:bg-gray-800 animate-pulse"
        )}
      />
    )
  }

  /** Toggles light/dark mode with a circular reveal; closes the color menu once the reveal finishes. */
  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      return
    }

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    const wasColorMenuOpen = isColorMenuOpen

    // Center the reveal on the button itself. Touch- and keyboard-generated clicks
    // often report clientX/clientY as 0, which would otherwise anchor the ripple to
    // the top-left of the viewport instead of the button.
    const rect = event.currentTarget.getBoundingClientRect()
    const originX = rect.left + rect.width / 2
    const originY = rect.top + rect.height / 2

    runViewTransitionReveal(originX, originY, () => setTheme(nextTheme)).then(() => {
      if (wasColorMenuOpen) setIsColorMenuOpen(false)
    })
  }

  /** Applies the chosen accent color immediately and closes the color menu. */
  const handleColorSelect = (theme: Theme) => {
    setIsColorMenuOpen(false)
    setAccentTheme(theme)
  }

  /** Opens the accent color menu on right-click instead of showing the native context menu. */
  const handleContextMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsColorMenuOpen(true)
  }

  /** Cancels any pending long-press timer. */
  const clearLongPressTimer = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }
  }

  /** Starts tracking a touch and schedules the long-press to open the color menu. */
  const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    longPressFiredRef.current = false

    longPressTimeoutRef.current = setTimeout(() => {
      longPressFiredRef.current = true
      setIsColorMenuOpen(true)
      navigator.vibrate?.(10)
    }, LONG_PRESS_DURATION_MS)
  }

  /** Cancels the long-press if the touch moves too far (treated as a scroll, not a hold). */
  const handleTouchMove = (event: React.TouchEvent<HTMLButtonElement>) => {
    if (!touchStartRef.current) return
    const touch = event.touches[0]
    const distance = Math.hypot(
      touch.clientX - touchStartRef.current.x,
      touch.clientY - touchStartRef.current.y
    )
    if (distance > LONG_PRESS_MOVE_THRESHOLD_PX) {
      clearLongPressTimer()
    }
  }

  /** Ends the touch, clearing any pending timer and suppressing the trailing click if a long-press already fired. */
  const handleTouchEnd = () => {
    clearLongPressTimer()
    if (longPressFiredRef.current) {
      suppressNextClickRef.current = true
      longPressFiredRef.current = false
    }
    touchStartRef.current = null
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={cn(
          "relative w-11 h-11 rounded-lg transition-all duration-200",
          "border border-gray-300 dark:border-gray-700",
          "bg-gray-100 dark:bg-gray-900",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          "hover:border-gray-400 dark:hover:border-gray-600",
          "active:scale-95",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
          "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black",
          "flex items-center justify-center",
          "cursor-pointer shadow-sm hover:shadow-md"
        )}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode. Right-click or long-press to change accent color.`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
              mass: 0.5,
            }}
            className="absolute pointer-events-none"
          >
            {resolvedTheme === "dark" ? (
              <FaSun className="w-5 h-5 text-yellow-500" />
            ) : (
              <FaMoon className="w-5 h-5 text-gray-600" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Small caret trigger: keyboard/click-accessible equivalent of right-click/long-press */}
      <button
        type="button"
        onClick={() => setIsColorMenuOpen(prev => !prev)}
        aria-label="Choose accent color"
        aria-haspopup="true"
        aria-expanded={isColorMenuOpen}
        className={cn(
          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full transition-all duration-200",
          "bg-white dark:bg-gray-900",
          "border border-gray-300 dark:border-gray-600",
          "hover:scale-125 hover:border-accent-500 dark:hover:border-accent-400",
          "active:scale-90",
          "flex items-center justify-center cursor-pointer",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        )}
      >
        <motion.div animate={{ rotate: isColorMenuOpen ? -180 : 0 }} transition={{ duration: 0.2 }}>
          <FaChevronDown className="w-1.5 h-1.5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>

      <ThemeColorMenu
        isOpen={isColorMenuOpen}
        activeTheme={accentTheme}
        onSelect={handleColorSelect}
      />
    </div>
  )
}
