"use client"

import { motion } from "framer-motion"
import React from "react"
import { PRESENT } from "@/lib/constants"
import { cn, formatDuration } from "@/lib/utils"

/**
 * Timeline component that wraps around timeline items. It draws one continuous line that stays
 * in place while the items reveal themselves over it, and fades out through the last item.
 * @param children - The timeline items to be displayed, i.e., job positions, promotions, roles within a company.
 * @constructor
 */
export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-4xl w-full">
      <span
        className={cn(
          "absolute left-1.5 top-3 bottom-0 w-0.5",
          "bg-linear-to-b from-gray-300 dark:from-gray-700 from-[calc(100%-6rem)] to-transparent"
        )}
        aria-hidden="true"
      />
      <div role="list" aria-label="Work history timeline">
        {children}
      </div>
    </div>
  )
}

interface TimelineItemProps {
  title: string
  duration: string
  location: string
  children: React.ReactNode
}

/**
 * Formats a role's "MM/YYYY - MM/YYYY" duration the same way as the rest of the site.
 * Durations in any other format are displayed as written.
 * @param duration the duration of the role, e.g., "02/2025 - Present"
 * @returns the formatted duration, e.g., "Feb 2025 – Present"
 */
function formatRoleDuration(duration: string) {
  const [start, end] = duration
    .split(" - ")
    .map(date => date.replace(/^(\d{2})\/(\d{4})$/, "$2-$1"))
  const isMonthYear = (date?: string) => /^\d{4}-\d{2}$/.test(date ?? "")

  return isMonthYear(start) && (isMonthYear(end) || end === PRESENT)
    ? formatDuration(start, end)
    : duration
}

/**
 * TimelineItem component that represents a single item in the timeline, i.e., a single role within a company.
 * Its marker and content rise into view together as the reader scrolls to them, and a role that
 * is still ongoing gets a bright marker and a "Current" tag.
 * @param title the title of the role
 * @param duration the duration of the role, e.g., "02/2025 - Present"
 * @param location the location of the role, e.g., "New York, NY"
 * @param children the content of the role, e.g., bulleted list of responsibilities
 * @constructor
 */
export function TimelineItem({ title, duration, location, children }: TimelineItemProps) {
  const isCurrent = duration.endsWith(PRESENT)

  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative pb-9 last:pb-0 pl-9"
    >
      {/* Faded colors are mixed with the background so the line doesn't show through the marker */}
      <span
        className={cn(
          "absolute left-0 top-1.5 size-3.5 rounded-full border-2",
          isCurrent
            ? "bg-accent-500 border-accent-500 ring-4 ring-accent-500/20"
            : cn(
                "bg-[color-mix(in_srgb,var(--accent-500)_25%,var(--background))]",
                "border-[color-mix(in_srgb,var(--accent-500)_50%,var(--background))]"
              )
        )}
        aria-hidden="true"
      />

      <h3 className="mt-0 mb-1.5 text-lg sm:text-xl font-semibold leading-snug">
        {title}
        {isCurrent && (
          <span
            className={cn(
              "inline-block ml-2 px-2 py-px rounded-full align-[2px] text-xs font-medium",
              "bg-accent-500/15 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400"
            )}
          >
            Current
          </span>
        )}
      </h3>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
        <span>{formatRoleDuration(duration)}</span>
        <span>{location}</span>
      </div>
      <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{children}</div>
    </motion.div>
  )
}
