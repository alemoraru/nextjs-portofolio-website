"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

/**
 * NotFound component that displays a 404 error message when a page is not found.
 */
export default function NotFound() {
  // Fun bash commands or dev quotes, all indicating a page is not found
  const funLines = [
    'echo "Oops! This page is 404 not found-ish"',
    'echo "404: This is not the page you are looking for!"',
    'echo "cd /dev/null # Page not found"',
    'echo "cat ~/nowhere # No such file or directory"',
    'echo "git checkout --the-missing-page"',
    'echo "rm -rf ./this-page # Already gone!"',
    'echo "curl -I /404 | grep not-found"',
    'echo "find . -name missing-page # 0 results"',
    'echo "ls ~/404 # Not found"',
    'echo "exit 404 # Page not found-ish"',
    'echo "// TODO: Implement this page"',
    'echo "¯\\_(ツ)_/¯ # 404 not found"',
  ]

  // Select a random line from the funLines array to display
  // eslint-disable-next-line react-hooks/purity
  const randomLine = useMemo(() => funLines[Math.floor(Math.random() * funLines.length)], [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, duration: 0.6 }}
        className="text-6xl md:text-8xl font-extrabold text-blue-600 dark:text-blue-500 mb-4 select-none"
      >
        404
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"
      >
        Page Not Found
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={cn(
          "mb-8 px-4 py-3 rounded-lg",
          "border border-gray-300 dark:border-gray-700",
          "bg-gray-50 dark:bg-gray-900",
          "shadow-sm"
        )}
      >
        <span className="inline-block font-mono text-sm md:text-base text-blue-600 dark:text-blue-400">
          $ {randomLine}
        </span>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Link
          href="/"
          className={cn(
            "group inline-flex items-center gap-2 px-6 py-2 rounded-lg",
            "bg-blue-600 dark:bg-blue-500 text-white font-semibold",
            "hover:bg-blue-700 dark:hover:bg-blue-600",
            "transition-all duration-200 shadow-md hover:shadow-lg",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            "dark:focus-visible:ring-offset-black"
          )}
        >
          <span>Go Home</span>
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="text-lg"
          >
            →
          </motion.span>
        </Link>
      </motion.div>
    </div>
  )
}
