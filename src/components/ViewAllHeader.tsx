"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ViewAllButtonProps {
  title: string
  pageUrl: string
  itemCount: number
}

/**
 * A functional component that renders a "View All" button with a link to a specified page.
 * @param title - The title to be displayed in the header (e.g., "Recent Work").
 * @param pageUrl - The URL to which the button should link (e.g., "/projects").
 * @param itemCount - The total count of items to display on the "View All" button.
 */
export default function ViewAllHeader({ title, pageUrl, itemCount }: ViewAllButtonProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <Link
        href={pageUrl}
        className={cn(
          "group flex items-center gap-1.5",
          "text-sm font-semibold text-accent-600 dark:text-accent-400",
          "hover:gap-2.5 transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-black rounded-sm"
        )}
      >
        <span>View all</span>
        <span
          className={cn(
            "inline-flex items-center justify-center min-w-5 h-5 px-1.5",
            "bg-accent-500/15 dark:bg-accent-500/15 text-accent-600 dark:text-accent-400",
            "rounded text-xs font-bold",
            "group-hover:bg-accent-500/25 dark:group-hover:bg-accent-500/25",
            "transition-colors duration-200"
          )}
        >
          {itemCount}
        </span>
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: 0 }}
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="text-base"
        >
          →
        </motion.span>
      </Link>
    </div>
  )
}
