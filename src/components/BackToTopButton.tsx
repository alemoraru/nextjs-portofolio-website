"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { FaArrowUp } from "react-icons/fa"
import { cn } from "@/lib/utils"

/** Scroll distance (px) past which the button becomes visible. */
const SHOW_THRESHOLD_PX = 400

/**
 * Floating "back to top" button shown on long detail pages (blog post / project /
 * work item). Fades in once the reader has scrolled past {@link SHOW_THRESHOLD_PX}
 * and smoothly scrolls back to the top of the page. Pinned to the bottom-right of
 * the viewport.
 */
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    let frame = 0

    const updateVisibility = () => {
      frame = 0
      setIsVisible(window.scrollY > SHOW_THRESHOLD_PX)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateVisibility)
    }

    updateVisibility()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "fixed bottom-6 right-6 z-40 w-11 h-11 rounded-lg",
            "flex items-center justify-center cursor-pointer",
            "border border-gray-300 dark:border-gray-700",
            "bg-gray-100 dark:bg-gray-900",
            "text-gray-600 dark:text-gray-300",
            "shadow-sm hover:shadow-md",
            "transition-colors duration-200",
            "hover:bg-gray-200 dark:hover:bg-gray-700",
            "hover:border-gray-400 dark:hover:border-gray-600",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
          )}
        >
          <FaArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
