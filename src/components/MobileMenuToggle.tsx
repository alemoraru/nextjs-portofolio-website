"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Ref } from "react"

interface MobileMenuToggleProps {
  /** Forwarded to the `<button>`, so the menu's click-outside handler can ignore presses on it. */
  ref?: Ref<HTMLButtonElement>
  /** Whether the mobile menu is open; drives the icon (hamburger ↔ X), `aria-label` and `aria-expanded`. */
  isOpen: boolean
  /** Called on every activation (click, tap, Enter or Space) to open or close the menu. */
  onToggleAction: () => void
}

/**
 * A functional component that renders a mobile menu toggle button with an animated hamburger icon.
 * It toggles on `click`, so it works with a mouse, touch, Enter/Space, screen readers and voice
 * control alike.
 */
export default function MobileMenuToggle({ ref, isOpen, onToggleAction }: MobileMenuToggleProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "md:hidden w-11 h-11 flex items-center justify-center rounded-xl",
        "bg-gray-100 dark:bg-gray-900",
        "border border-gray-300 dark:border-gray-700",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "hover:border-gray-400 dark:hover:border-gray-600",
        "transition-all duration-200 cursor-pointer",
        "active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black",
        "shadow-sm hover:shadow-md"
      )}
      onClick={onToggleAction}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-6 h-6 flex flex-col items-center justify-center pointer-events-none"
      >
        {/* Top bar */}
        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : -6,
          }}
          className="absolute w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full"
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        {/* Middle bar - fades out */}
        <motion.span
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.5 : 1,
          }}
          className="absolute w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full"
          transition={{ duration: 0.15 }}
        />
        {/* Bottom bar */}
        <motion.span
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : 6,
          }}
          className="absolute w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full"
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      </motion.div>
    </button>
  )
}
