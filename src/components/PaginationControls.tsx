import Link from "next/link"
import React from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

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

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}) => {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex justify-center items-center gap-2 mt-10">
      {/* Prev Button */}
      <Link
        href={buildPageUrl(baseUrl, Math.max(1, currentPage - 1), searchParams)}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-lg",
          "border border-gray-300 dark:border-gray-700",
          "bg-gray-100 dark:bg-gray-800",
          "text-gray-700 dark:text-gray-200",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-black",
          currentPage === 1
            ? "opacity-40 cursor-not-allowed pointer-events-none"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 active:scale-95"
        )}
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
      >
        <FaChevronLeft className="w-3.5 h-3.5" />
      </Link>

      {/* First page */}
      <Link
        href={buildPageUrl(baseUrl, 1, searchParams)}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-lg",
          "border transition-all duration-200 text-sm font-semibold",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-black",
          currentPage === 1
            ? "bg-accent-600 dark:bg-accent-500 text-white border-accent-600 dark:border-accent-500 cursor-default pointer-events-none shadow-sm"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 active:scale-95"
        )}
        aria-current={currentPage === 1 ? "page" : undefined}
      >
        1
      </Link>

      {/* Left Ellipsis */}
      {currentPage > 3 && (
        <span className="px-2 text-gray-500 dark:text-gray-400 select-none" aria-hidden="true">
          ···
        </span>
      )}

      {/* Previous page number (if not 1 and not already shown) */}
      {currentPage > 2 && (
        <Link
          href={buildPageUrl(baseUrl, currentPage - 1, searchParams)}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "border border-gray-300 dark:border-gray-700",
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-700 dark:text-gray-200",
            "text-sm font-semibold transition-all duration-200",
            "hover:bg-gray-200 dark:hover:bg-gray-700",
            "hover:border-gray-400 dark:hover:border-gray-600",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
            "dark:focus-visible:ring-offset-black"
          )}
        >
          {currentPage - 1}
        </Link>
      )}

      {/* Current page (not 1 or last) */}
      {currentPage !== 1 && currentPage !== totalPages && (
        <span
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "bg-accent-600 dark:bg-accent-500 text-white",
            "border border-accent-600 dark:border-accent-500",
            "text-sm font-semibold cursor-default shadow-sm"
          )}
          aria-current="page"
        >
          {currentPage}
        </span>
      )}

      {/* Next page number (if not last and not already shown) */}
      {currentPage < totalPages - 1 && (
        <Link
          href={buildPageUrl(baseUrl, currentPage + 1, searchParams)}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "border border-gray-300 dark:border-gray-700",
            "bg-gray-100 dark:bg-gray-800",
            "text-gray-700 dark:text-gray-200",
            "text-sm font-semibold transition-all duration-200",
            "hover:bg-gray-200 dark:hover:bg-gray-700",
            "hover:border-gray-400 dark:hover:border-gray-600",
            "active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
            "dark:focus-visible:ring-offset-black"
          )}
        >
          {currentPage + 1}
        </Link>
      )}

      {/* Right Ellipsis */}
      {currentPage < totalPages - 2 && (
        <span className="px-2 text-gray-500 dark:text-gray-400 select-none" aria-hidden="true">
          ···
        </span>
      )}

      {/* Last page */}
      {totalPages > 1 && (
        <Link
          href={buildPageUrl(baseUrl, totalPages, searchParams)}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "border transition-all duration-200 text-sm font-semibold",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
            "dark:focus-visible:ring-offset-black",
            currentPage === totalPages
              ? "bg-accent-600 dark:bg-accent-500 text-white border-accent-600 dark:border-accent-500 cursor-default pointer-events-none shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 active:scale-95"
          )}
          aria-current={currentPage === totalPages ? "page" : undefined}
        >
          {totalPages}
        </Link>
      )}

      {/* Next Button */}
      <Link
        href={buildPageUrl(baseUrl, Math.min(totalPages, currentPage + 1), searchParams)}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-lg",
          "border border-gray-300 dark:border-gray-700",
          "bg-gray-100 dark:bg-gray-800",
          "text-gray-700 dark:text-gray-200",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-black",
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed pointer-events-none"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 active:scale-95"
        )}
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
      >
        <FaChevronRight className="w-3.5 h-3.5" />
      </Link>
    </nav>
  )
}

export default PaginationControls
