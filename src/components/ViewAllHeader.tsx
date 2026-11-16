"use client"

import Link from "next/link"
import HoverArrow from "@/components/HoverArrow"
import { cn } from "@/lib/utils"

interface ViewAllButtonProps {
  /** Section heading shown on the left as an `<h2>` (e.g. "Recent Work"). */
  title: string
  /** Page the "View all" link goes to (e.g. `/projects`). */
  pageUrl: string
  /** Total number of items on the linked page, shown in the badge next to "View all". */
  itemCount: number
  /** What the linked page lists, read out after the count (e.g. "blog posts" → "View all 12 blog posts"). */
  itemLabel: string
}

/**
 * A functional component that renders a section heading with a "View all" link to a specified page.
 */
export default function ViewAllHeader({
  title,
  pageUrl,
  itemCount,
  itemLabel,
}: ViewAllButtonProps) {
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
        {/* The {" "} text nodes keep words apart in the link name (the flex gap only spaces them visually) */}
        <span>View all</span>{" "}
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
        {/* Visually the section title gives context; on its own the link would just be "View all 12" */}{" "}
        <span className="sr-only">{itemLabel}</span>
        <HoverArrow className="text-base" />
      </Link>
    </div>
  )
}
