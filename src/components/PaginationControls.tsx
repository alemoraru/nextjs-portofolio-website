import React from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Link from "next/link"

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
    <div className="flex justify-center items-center gap-2 mt-8">
      {/* Prev Button */}
      <Link
        href={buildPageUrl(baseUrl, Math.max(1, currentPage - 1), searchParams)}
        className={`w-8 h-8 flex items-center justify-center px-0 py-0 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-transform duration-150 ${currentPage === 1 ? "cursor-default opacity-60 pointer-events-none" : "cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"}`}
        aria-label="Previous page"
      >
        <FaChevronLeft className="w-4 h-4" />
      </Link>

      {/* First page */}
      <Link
        href={buildPageUrl(baseUrl, 1, searchParams)}
        className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 ${currentPage === 1 ? "bg-blue-500 text-white cursor-default pointer-events-none" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"}`}
        aria-current={currentPage === 1 ? "page" : undefined}
      >
        1
      </Link>

      {/* Left Ellipsis */}
      {currentPage > 3 && <span className="px-2 select-none">...</span>}

      {/* Previous page number (if not 1 and not already shown) */}
      {currentPage > 2 && (
        <Link
          href={buildPageUrl(baseUrl, currentPage - 1, searchParams)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700`}
        >
          {currentPage - 1}
        </Link>
      )}

      {/* Current page (not 1 or last) */}
      {currentPage !== 1 && currentPage !== totalPages && (
        <span
          className={`w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white transition-colors duration-150 cursor-default`}
        >
          {currentPage}
        </span>
      )}

      {/* Next page number (if not last and not already shown) */}
      {currentPage < totalPages - 1 && (
        <Link
          href={buildPageUrl(baseUrl, currentPage + 1, searchParams)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700`}
        >
          {currentPage + 1}
        </Link>
      )}

      {/* Right Ellipsis */}
      {currentPage < totalPages - 2 && <span className="px-2 select-none">...</span>}

      {/* Last page */}
      {totalPages > 1 && (
        <Link
          href={buildPageUrl(baseUrl, totalPages, searchParams)}
          className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 ${currentPage === totalPages ? "bg-blue-500 text-white cursor-default pointer-events-none" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          aria-current={currentPage === totalPages ? "page" : undefined}
        >
          {totalPages}
        </Link>
      )}

      {/* Next Button */}
      <Link
        href={buildPageUrl(baseUrl, Math.min(totalPages, currentPage + 1), searchParams)}
        className={`w-8 h-8 flex items-center justify-center px-0 py-0 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-transform duration-150 ${currentPage === totalPages ? "cursor-default opacity-60 pointer-events-none" : "cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"}`}
        aria-label="Next page"
      >
        <FaChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}

export default PaginationControls
