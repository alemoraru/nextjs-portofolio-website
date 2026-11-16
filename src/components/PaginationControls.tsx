import Link from "next/link"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface PaginationControlsProps {
  /** The currently active page (1-indexed). */
  currentPage: number
  /** The total number of pages. Nothing is rendered when this is 1 or less. */
  totalPages: number
  /** The path that page links point to (e.g. "/blog"). */
  baseUrl: string
  /** Current query params (sort, filters, ...) to preserve across page links. */
  searchParams?: { [key: string]: string | string[] | undefined }
}

/**
 * Builds the URL for a given page, preserving all other query params.
 * Page 1 omits the `page` param so it maps to the canonical base URL.
 * @param baseUrl - The path to link to.
 * @param page - The target page number.
 * @param searchParams - Existing query params to carry over (any `page` entry is replaced).
 */
function buildPageUrl(
  baseUrl: string,
  page: number,
  searchParams?: { [key: string]: string | string[] | undefined }
) {
  const params = new URLSearchParams()
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page") return // We'll set page below
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else if (value !== undefined) {
        params.set(key, value)
      }
    })
  }
  if (page > 1) {
    params.set("page", page.toString())
  }
  const query = params.toString()
  return query ? `${baseUrl}?${query}` : baseUrl
}

/** Shared box for every pagination item. */
const ITEM_BASE = "w-9 h-9 flex items-center justify-center rounded-xl"

/** Focus ring for the items that are links. */
const FOCUS_RING = cn(
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
  "dark:focus-visible:ring-offset-black"
)

/** Look of a page number you can go to. */
const PAGE_LINK_CLASSES = cn(
  ITEM_BASE,
  "border border-gray-300 dark:border-gray-700",
  "bg-gray-100 dark:bg-gray-800",
  "text-gray-700 dark:text-gray-200",
  "text-sm font-semibold transition-all duration-200",
  "hover:bg-gray-200 dark:hover:bg-gray-700",
  "hover:border-gray-400 dark:hover:border-gray-600",
  "active:scale-95",
  FOCUS_RING
)

/** Look of the current page. */
const CURRENT_PAGE_CLASSES = cn(
  ITEM_BASE,
  "bg-accent-600 dark:bg-accent-500 text-white",
  "border border-accent-600 dark:border-accent-500",
  "text-sm font-semibold cursor-default shadow-sm"
)

/** Look of the Previous/Next arrows (`disabled` greys them out on the first/last page). */
const arrowClasses = (disabled: boolean) =>
  cn(
    ITEM_BASE,
    "border border-gray-300 dark:border-gray-700",
    "bg-gray-100 dark:bg-gray-800",
    "text-gray-700 dark:text-gray-200",
    "transition-all duration-200",
    disabled
      ? "opacity-40 cursor-not-allowed"
      : cn(
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          "hover:border-gray-400 dark:hover:border-gray-600",
          "active:scale-95",
          FOCUS_RING
        )
  )

/** The "···" between page numbers; purely visual. */
function Ellipsis() {
  return (
    <span className="px-1 sm:px-2 text-gray-500 dark:text-gray-400 select-none" aria-hidden="true">
      ···
    </span>
  )
}

/**
 * Accessible pagination nav with prev/next buttons, always-visible first and last pages,
 * and a window around the current page, collapsed with ellipses.
 * Page numbers read as "Page N"; the current page and the Previous/Next arrows on the first/last
 * page aren't links, so keyboard users don't land on controls that go nowhere.
 * It sits at the bottom of its flex-column parent (`mt-auto`) and wraps on narrow screens.
 * @param currentPage - The currently active page (1-indexed).
 * @param totalPages - The total number of pages. Renders nothing when 1 or less.
 * @param baseUrl - The path that page links point to.
 * @param searchParams - Query params to preserve across page links.
 */
export default function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  /** A page number: a link, or plain text marked as the current page. */
  const pageItem = (page: number) => {
    // Visible as just the number; read as "Page N"
    const label = (
      <>
        <span className="sr-only">Page</span> {page}
      </>
    )
    return page === currentPage ? (
      <span key={page} className={CURRENT_PAGE_CLASSES} aria-current="page">
        {label}
      </span>
    ) : (
      <Link
        key={page}
        href={buildPageUrl(baseUrl, page, searchParams)}
        className={PAGE_LINK_CLASSES}
      >
        {label}
      </Link>
    )
  }

  /** The Previous/Next arrow: a link, or a greyed-out placeholder on the first/last page. */
  const arrowItem = (direction: "previous" | "next") => {
    const isPrevious = direction === "previous"
    const target = isPrevious ? currentPage - 1 : currentPage + 1
    const Chevron = isPrevious ? FaChevronLeft : FaChevronRight
    const icon = <Chevron aria-hidden="true" className="w-3.5 h-3.5" />

    // Nowhere to go: keep the arrow for the layout, but out of the tab order and the a11y tree
    if (target < 1 || target > totalPages) {
      return (
        <span className={arrowClasses(true)} aria-hidden="true">
          {icon}
        </span>
      )
    }
    return (
      <Link
        href={buildPageUrl(baseUrl, target, searchParams)}
        className={arrowClasses(false)}
        aria-label={isPrevious ? "Previous page" : "Next page"}
      >
        {icon}
      </Link>
    )
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 mt-auto pt-10 pb-2"
    >
      {arrowItem("previous")}

      {/* First page, then the window around the current page, then the last page */}
      {pageItem(1)}
      {currentPage > 3 && <Ellipsis />}
      {currentPage > 2 && pageItem(currentPage - 1)}
      {currentPage !== 1 && currentPage !== totalPages && pageItem(currentPage)}
      {currentPage < totalPages - 1 && pageItem(currentPage + 1)}
      {currentPage < totalPages - 2 && <Ellipsis />}
      {pageItem(totalPages)}

      {arrowItem("next")}
    </nav>
  )
}
