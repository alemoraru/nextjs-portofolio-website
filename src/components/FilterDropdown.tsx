import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { FaChevronDown, FaCheck, FaTag } from "react-icons/fa"
import { useClickOutside } from "@/hooks/useClickOutside"
import { cn } from "@/lib/utils"

interface FilterDropdownProps {
  items: { name: string; count: number }[]
  /** The items ticked in the panel, which only take effect once applied. */
  selectedItems: string[]
  /** How many filters are currently applied, shown as a badge on the button. */
  appliedCount: number
  onToggle: (item: string) => void
  onApply: () => void
  onClear: () => void
  /** Called when the panel closes without applying, so unapplied ticks can be discarded. */
  onDismiss?: () => void
  label: string
}

/**
 * FilterDropdown component that provides a dropdown for filtering items.
 * It allows users to search for and select multiple items, then apply or clear the filters.
 */
export default function FilterDropdown({
  items,
  selectedItems,
  appliedCount,
  onToggle,
  onApply,
  onClear,
  onDismiss,
  label,
}: FilterDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [query, setQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeDropdown = () => {
    setIsDropdownOpen(false)
    setQuery("")
  }

  const handleDismiss = () => {
    closeDropdown()
    onDismiss?.()
  }

  useClickOutside(dropdownRef, handleDismiss, { enabled: isDropdownOpen })

  // Close the dropdown when filters are applied
  const handleApply = () => {
    onApply()
    closeDropdown()
  }

  const visibleItems = items.filter(({ name }) =>
    name.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={isDropdownOpen ? handleDismiss : () => setIsDropdownOpen(true)}
        aria-expanded={isDropdownOpen}
        className={cn(
          "relative cursor-pointer inline-flex items-center gap-2 h-10 px-3.5 rounded-xl border",
          "text-sm font-medium text-gray-800 dark:text-gray-200",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          "hover:border-gray-400 dark:hover:border-gray-600",
          "transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
          "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black",
          isDropdownOpen
            ? "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600"
            : "border-gray-300 dark:border-gray-700"
        )}
      >
        <FaTag className="w-3.5 h-3.5" />
        <span className="truncate">{label}</span>
        <FaChevronDown
          className={cn(
            "w-3 h-3 transition-transform duration-200",
            isDropdownOpen && "rotate-180"
          )}
        />
        {appliedCount > 0 && (
          <span
            className={cn(
              "absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full",
              "inline-flex items-center justify-center",
              "bg-accent-600 dark:bg-accent-500 text-white text-xs font-bold",
              "shadow-md border border-white dark:border-black"
            )}
            title={`${appliedCount} applied`}
          >
            {appliedCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "origin-top-left absolute z-10 mt-2 w-80 max-w-[calc(100vw-4rem)] overflow-hidden",
              "bg-white dark:bg-gray-800",
              "border border-gray-300 dark:border-gray-700",
              "rounded-xl shadow-xl"
            )}
          >
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}`}
                aria-label={`Search ${label.toLowerCase()}`}
                className={cn(
                  "peer block w-full h-11 px-3.5 bg-transparent",
                  "border-b border-gray-300 dark:border-gray-700",
                  "text-base sm:text-sm text-gray-800 dark:text-gray-200",
                  "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  "focus:outline-none"
                )}
              />
              {/* Accent underline that grows from the center outwards while focused */}
              <span
                className={cn(
                  "absolute bottom-0 inset-x-0 h-0.5 bg-accent-500 pointer-events-none",
                  "scale-x-0 peer-focus:scale-x-100 origin-center",
                  "transition-transform duration-300 ease-out motion-reduce:transition-none"
                )}
                aria-hidden="true"
              />
            </div>

            <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar">
              {visibleItems.length === 0 && (
                <p className="px-2 py-2 text-sm text-gray-600 dark:text-gray-400">No matches</p>
              )}
              {visibleItems.map(({ name, count }) => (
                <label
                  key={name}
                  className={cn(
                    "flex items-center gap-2.5 min-h-9 px-2 cursor-pointer group",
                    "rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50",
                    "transition-colors duration-200"
                  )}
                >
                  <span className="relative inline-block w-[18px] h-[18px] shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(name)}
                      onChange={() => onToggle(name)}
                      className="peer absolute opacity-0 w-full h-full z-10 cursor-pointer"
                    />
                    <span
                      className={cn(
                        "block w-full h-full rounded border border-gray-400 dark:border-gray-500",
                        "peer-checked:bg-accent-600 peer-checked:border-accent-600",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-accent-500 peer-focus-visible:ring-offset-1",
                        "transition-all duration-200"
                      )}
                    ></span>
                    <FaCheck className="absolute top-0 left-0 w-full h-full p-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-medium group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                    {name}
                  </span>
                  <span className="ml-auto text-xs text-gray-600 dark:text-gray-400">{count}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center p-2 border-t border-gray-300 dark:border-gray-700">
              <button
                type="button"
                onClick={onClear}
                className={cn(
                  "h-9 px-2 rounded-xl cursor-pointer",
                  "text-sm font-medium text-gray-600 dark:text-gray-300",
                  "hover:text-gray-900 dark:hover:text-white hover:underline",
                  "transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                )}
                title="Clear filters"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleApply}
                className={cn(
                  "h-9 px-4 rounded-xl cursor-pointer text-sm font-semibold",
                  "bg-accent-600 dark:bg-accent-500 text-white",
                  "hover:bg-accent-700 dark:hover:bg-accent-600",
                  "transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                )}
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
