import { FaChevronDown } from "react-icons/fa"
import { cn } from "@/lib/utils"

type SortOrder = "newest" | "oldest" | "asc" | "desc"

interface SortToggleProps {
  sortOrder: SortOrder
  onChange: (order: SortOrder) => void
  options: { label: string; value: SortOrder }[]
}

/**
 * SortToggle component that shows the current sort order (e.g., newest first) as a compact button.
 * Clicking it switches to the next option, and the chevron flips with the direction.
 * @param sortOrder - The current sort order.
 * @param onChange - Callback function to handle changes in the sort order.
 * @param options - Array of sorting options with labels and values.
 */
export default function SortToggle({ sortOrder, onChange, options }: SortToggleProps) {
  const currentIndex = options.findIndex(option => option.value === sortOrder)
  const label = options[currentIndex]?.label || "Sort"

  return (
    <button
      type="button"
      onClick={() => onChange(options[(currentIndex + 1) % options.length].value)}
      aria-label={`${label}, change sort order`}
      className={cn(
        "cursor-pointer inline-flex items-center gap-1.5 h-10 px-2.5 -mr-2.5 rounded-xl",
        "text-sm font-medium whitespace-nowrap text-gray-800 dark:text-gray-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "hover:text-gray-900 dark:hover:text-white",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
      )}
    >
      {label}
      <FaChevronDown
        className={cn(
          "w-3 h-3 transition-transform duration-200",
          currentIndex > 0 && "rotate-180"
        )}
      />
    </button>
  )
}
