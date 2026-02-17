"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaMoon, FaSun } from "react-icons/fa6"
import { cn } from "@/lib/utils"

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
    return (
      <div
        className={cn(
          "w-11 h-11 rounded-lg border border-gray-300 dark:border-gray-700",
          "bg-gray-100 dark:bg-gray-800 animate-pulse"
        )}
      />
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative w-11 h-11 rounded-lg transition-all duration-200",
        "border border-gray-300 dark:border-gray-700",
        "bg-gray-100 dark:bg-gray-800",
        "hover:bg-gray-200 dark:hover:bg-gray-700",
        "hover:border-gray-400 dark:hover:border-gray-600",
        "active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black",
        "flex items-center justify-center",
        "cursor-pointer shadow-sm hover:shadow-md"
      )}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
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
            <FaSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <FaMoon className="w-5 h-5 text-gray-600" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
