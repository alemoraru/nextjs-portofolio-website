"use client"

import { motion } from "framer-motion"

/**
 * A functional component that renders a mobile menu toggle button with an animated hamburger icon.
 */
export default function MobileMenuToggle({
  isOpen,
  onToggleAction,
}: {
  isOpen: boolean
  onToggleAction: () => void
}) {
  return (
    <button
      className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg
                 bg-gray-100 dark:bg-gray-800
                 border border-gray-300 dark:border-gray-700
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 hover:border-gray-400 dark:hover:border-gray-600
                 transition-all duration-200 cursor-pointer
                 active:scale-95
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black
                 shadow-sm hover:shadow-md"
      onMouseDown={e => {
        e.stopPropagation()
        onToggleAction()
      }}
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
