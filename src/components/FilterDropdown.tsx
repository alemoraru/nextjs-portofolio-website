import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { FaChevronDown, FaBroom, FaCheck } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface FilterDropdownProps {
  items: { name: string; count: number }[]
  selectedItems: string[]
  onToggle: (item: string) => void
  onApply: () => void
  onClear: () => void
  placeholder: string
  resultCount: number
}

/**
 * FilterDropdown component that provides a dropdown for filtering items.
 * It allows users to select multiple items and apply or clear the filters.
 */
export default function FilterDropdown({
  items,
  selectedItems,
  onToggle,
  onApply,
  onClear,
  placeholder,
  resultCount,
}: FilterDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // Close the dropdown when filters are applied
  const handleApply = () => {
    onApply()
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(prev => !prev)}
        className={cn(
          "cursor-pointer flex items-center justify-between relative w-full",
          "border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5",
          "bg-gray-100 dark:bg-gray-800",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          "hover:border-gray-400 dark:hover:border-gray-600",
          "shadow-sm hover:shadow-md transition-all duration-200 active:scale-98",
          "text-sm font-medium text-gray-800 dark:text-gray-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
        )}
      >
        <span className="truncate">
          {selectedItems.length === 0 ? placeholder : `${selectedItems.length} Selected`}
        </span>
        <motion.div
          animate={{ rotate: isDropdownOpen ? -180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2"
        >
          <FaChevronDown className="text-sm" />
        </motion.div>
        {resultCount > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-blue-600 dark:bg-blue-500 text-white
                        text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center
                        shadow-md border border-white dark:border-black"
            title={`${resultCount} results`}
          >
            {resultCount}
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
              "origin-top absolute z-10 mt-2 w-64 p-4 space-y-3",
              "bg-white dark:bg-gray-800",
              "border border-gray-300 dark:border-gray-700",
              "rounded-lg shadow-xl backdrop-blur-sm"
            )}
          >
            <div className="max-h-48 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
              {items.map(({ name, count }) => (
                <motion.label
                  key={name}
                  whileHover={{ x: 4 }}
                  className="flex items-center space-x-3 cursor-pointer group py-2 px-2
                             rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50
                             transition-colors duration-200"
                >
                  <span className="relative inline-block w-5 h-5 shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(name)}
                      onChange={() => onToggle(name)}
                      className="peer absolute opacity-0 w-full h-full z-10 cursor-pointer"
                    />
                    <span
                      className="block w-full h-full rounded border border-gray-400 dark:border-gray-500
                                 peer-checked:bg-blue-600 peer-checked:border-blue-600
                                 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1
                                 transition-all duration-200"
                    ></span>
                    <FaCheck className="absolute top-0 left-0 w-full h-full p-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {name}{" "}
                    <span className="text-gray-500 dark:text-gray-400 font-normal">({count})</span>
                  </span>
                </motion.label>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleApply}
                className={cn(
                  "px-4 py-2 rounded-lg cursor-pointer text-sm font-medium",
                  "bg-blue-600 dark:bg-blue-500 text-white",
                  "hover:bg-blue-700 dark:hover:bg-blue-600",
                  "shadow-sm hover:shadow-md transition-all duration-200 active:scale-95",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                )}
              >
                Apply
              </button>
              <button
                onClick={onClear}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer",
                  "text-sm font-medium text-gray-600 dark:text-gray-300",
                  "hover:text-red-500 dark:hover:text-red-400",
                  "hover:bg-red-50 dark:hover:bg-red-950/30",
                  "transition-all duration-200 active:scale-95",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
                )}
                title="Clear filters"
              >
                <FaBroom />
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
