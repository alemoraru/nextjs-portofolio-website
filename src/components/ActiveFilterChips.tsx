import React from "react"
import { FaTimes, FaTrashAlt } from "react-icons/fa"
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
  clearAllLabel = "Clear All",
  className = "",
}: ActiveFilterChipsProps) {
  if (!filters || filters.length === 0) return null

  return (
    <div
      className={`flex flex-row flex-wrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin ${className}`}
    >
      {filters.map(filter => (
        <span
          key={filter}
          className={cn(
            "flex items-center bg-accent-500/15 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400",
            "px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm"
          )}
        >
          {filter}
          <button
            onClick={() => onRemove(filter)}
            aria-label={`Remove filter ${filter}`}
            className="ml-2 text-accent-500 hover:text-accent-600 focus:outline-none cursor-pointer flex items-center"
            tabIndex={0}
          >
            <FaTimes className="w-4 h-4 md:w-4 md:h-4" />
          </button>
        </span>
      ))}

      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className={cn(
            "flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700",
            "dark:text-gray-200 px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm",
            "hover:bg-gray-300 dark:hover:bg-gray-600 ml-2 cursor-pointer"
          )}
          aria-label={clearAllLabel}
          tabIndex={0}
        >
          <FaTrashAlt className="w-4 h-4 md:w-4 md:h-4 mr-1" />
          {clearAllLabel}
        </button>
      )}
    </div>
  )
}
