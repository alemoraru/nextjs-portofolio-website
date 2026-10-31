import { ReactNode } from "react"

interface FilterToolbarProps {
  /** The filter control, shown on the left. */
  filter: ReactNode
  /** The sort control, shown on the right. */
  sort: ReactNode
  /** The number of results matching the active filters. */
  resultCount: number
  /** Singular name of a result (e.g. "post"), pluralized as needed. */
  resultLabel: string
}

/**
 * Toolbar shown above listing pages, with the filter control on the left and the sort control on
 * the right. On desktop, the result count sits next to the filter control.
 * @param filter - The filter control.
 * @param sort - The sort control.
 * @param resultCount - The number of results matching the active filters.
 * @param resultLabel - Singular name of a result.
 */
export default function FilterToolbar({
  filter,
  sort,
  resultCount,
  resultLabel,
}: FilterToolbarProps) {
  return (
    <div className="flex items-center gap-3 mb-6 w-full">
      <div className="relative z-20">{filter}</div>
      <p className="hidden md:block text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
        <span className="font-semibold text-gray-900 dark:text-white">{resultCount}</span>{" "}
        {resultLabel}
        {resultCount === 1 ? "" : "s"}
      </p>
      <div className="ml-auto">{sort}</div>
    </div>
  )
}
