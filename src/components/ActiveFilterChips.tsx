import React from "react"
import { FaTimes } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface ActiveFilterChipsProps {
  filters: string[]
  onRemove: (filter: string) => void
  onClearAll?: () => void
  clearAllLabel?: string
  className?: string
}

/**
 * Reusable component for displaying active filter chips with remove and clear all functionality.
 */
export default function ActiveFilterChips({
  filters,
  onRemove,
  onClearAll,
  clearAllLabel = "Clear all",
  className = "",
}: ActiveFilterChipsProps) {
  if (!filters || filters.length === 0) return null

  return (
    <div className={cn("flex flex-row flex-wrap items-center gap-2 mb-6", className)}>
      {filters.map(filter => (
        <span
          key={filter}
          className={cn(
            "flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-[13px] font-medium",
            "bg-accent-500/15 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400"
          )}
        >
          {filter}
          <button
            onClick={() => onRemove(filter)}
            aria-label={`Remove filter ${filter}`}
            className={cn(
              "flex items-center justify-center size-5 rounded-full cursor-pointer",
              "hover:bg-accent-500/25 transition-colors duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            )}
            tabIndex={0}
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </span>
      ))}

      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className={cn(
            "px-1.5 py-1 rounded cursor-pointer text-[13px] font-medium",
            "text-gray-600 dark:text-gray-400",
            "hover:text-gray-900 dark:hover:text-white hover:underline",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          )}
          aria-label={clearAllLabel}
          tabIndex={0}
        >
          {clearAllLabel}
        </button>
      )}
    </div>
  )
}
