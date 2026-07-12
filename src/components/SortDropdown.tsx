import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { FaChevronDown, FaCheck } from "react-icons/fa"
import { useClickOutside } from "@/hooks/useClickOutside"
import { cn } from "@/lib/utils"

interface SortDropdownProps {
  sortOrder: "newest" | "oldest" | "asc" | "desc"
  onChange: (order: "newest" | "oldest" | "asc" | "desc") => void
  options: { label: string; value: "newest" | "oldest" | "asc" | "desc" }[]
}

/**
 * SortDropdown component that provides a dropdown for selecting sorting options (e.g., newest, oldest).
 * @param sortOrder - The current sort order.
 * @param onChange - Callback function to handle changes in the sort order.
 * @param options - Array of sorting options with labels and values.
 */
export default function SortDropdown({ sortOrder, onChange, options }: SortDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false))

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(prev => !prev)}
        className={cn(
          "cursor-pointer flex items-center justify-between",
          "border border-gray-300 dark:border-gray-700",
          "px-4 py-2.5 rounded-lg",
          "bg-gray-100 dark:bg-gray-800",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          "hover:border-gray-400 dark:hover:border-gray-600",
          "w-full shadow-sm hover:shadow-md",
          "text-sm font-medium text-gray-800 dark:text-gray-200",
          "transition-all duration-200",
          "active:scale-98",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
          "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
        )}
      >
        <span>{options.find(option => option.value === sortOrder)?.label || "Sort"}</span>
        <motion.div
          animate={{ rotate: isDropdownOpen ? -180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2"
        >
          <FaChevronDown className="text-sm" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "origin-top-right absolute right-0 mt-2 w-48",
              "bg-white dark:bg-gray-800",
              "border border-gray-300 dark:border-gray-700",
              "rounded-lg shadow-xl backdrop-blur-sm",
              "overflow-hidden text-sm z-50"
            )}
          >
            {options.map(({ label, value }) => {
              const isSelected = sortOrder === value
              return (
                <motion.button
                  key={value}
                  onClick={() => {
                    onChange(value)
                    setIsDropdownOpen(false)
                  }}
                  className={cn(
                    "cursor-pointer flex items-center justify-between w-full text-left",
                    "px-4 py-2.5",
                    "transition-colors duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset",
                    "focus-visible:ring-accent-500",
                    isSelected
                      ? "bg-accent-500/10 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 font-semibold"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  )}
                >
                  <span>{label}</span>
                  {isSelected && <FaCheck className="w-3.5 h-3.5" />}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
