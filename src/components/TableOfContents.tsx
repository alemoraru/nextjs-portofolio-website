"use client"

import { useEffect, useState } from "react"
import { FaChevronDown, FaList, FaAngleRight } from "react-icons/fa"

interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Component that generates a table of contents based on the headings of an article.
 * This can be used to provide quick navigation in automatically generated MDX pages (e.g., blog posts).
 */
export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const article = document.querySelector("article")
    if (!article) return

    const headingElements = article.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems: TocItem[] = []

    headingElements.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`
      }

      tocItems.push({
        id: heading.id,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.substring(1)),
      })
    })

    setHeadings(tocItems)
  }, [])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  if (headings.length === 0) return null

  // Find minimum heading level to use as baseline
  const minLevel = Math.min(...headings.map(h => h.level))

  return (
    <div className="w-full sm:w-fit mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FaList className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span>Table of Contents</span>
        </div>
        <FaChevronDown
          className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-3 pb-2 space-y-0.5 overflow-y-auto max-h-120 custom-scrollbar">
          {headings.map(heading => {
            const indentLevel = heading.level - minLevel

            // Map indent levels to Tailwind classes
            const getIndentClass = (level: number) => {
              switch (level) {
                case 0:
                  return "pl-2"
                case 1:
                  return "pl-6"
                case 2:
                  return "pl-10"
                case 3:
                  return "pl-14"
                case 4:
                  return "pl-18"
                default:
                  return "pl-22"
              }
            }

            return (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`
                  flex items-center gap-2 w-full text-left py-2 pr-3 rounded-md text-sm transition-colors
                  text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100
                  ${getIndentClass(indentLevel)}
                  ${indentLevel > 0 ? "text-xs" : ""}
                  ${indentLevel > 1 ? "opacity-90" : ""}
                `}
              >
                <FaAngleRight className="w-3 h-3 shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="truncate">{heading.text}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
