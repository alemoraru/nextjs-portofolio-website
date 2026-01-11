"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Table of Contents item interface.
 * This represents a single heading in the article.
 */
interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Component that generates a table of contents based on the headings of an article.
 * Positioned on the left side of the page with a Substack-style design.
 * Hidden on mobile/tablet screens.
 */
export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string>("")
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const article = document.querySelector("article")
    if (!article) return

    const headingElements = article.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems: TocItem[] = []

    headingElements.forEach((heading, index) => {
      // Exclude headings that are inside a section element (e.g., "Other posts that might interest you")
      if (heading.closest("section")) {
        return
      }

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

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -35% 0px",
        threshold: 0,
      }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  // Close ToC when clicking outside
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        panelRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded])

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
      setIsExpanded(false)
    }
  }

  if (headings.length === 0) return null

  // Find minimum heading level to use as baseline
  const minLevel = Math.min(...headings.map(h => h.level))

  // Get indent class based on heading level
  const getIndentClass = (level: number) => {
    const relativeLevel = level - minLevel
    switch (relativeLevel) {
      case 0:
        return "pl-0"
      case 1:
        return "pl-6"
      case 2:
        return "pl-12"
      case 3:
        return "pl-16"
      default:
        return "pl-20"
    }
  }

  return (
    <>
      {/* Horizontal lines - always visible on the left */}
      <button
        ref={buttonRef}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "hidden lg:block fixed left-5 top-1/2 -translate-y-1/2 z-50 px-2 py-3 cursor-pointer",
          "rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
        )}
        aria-label="Toggle table of contents"
      >
        <div className="space-y-3">
          {headings.map(heading => {
            const isActive = heading.id === activeId
            return (
              <div
                key={heading.id}
                className={`
                  h-0.5 w-4 rounded-full transition-all duration-200
                  ${isActive ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-400 dark:bg-gray-600"}
                `}
              />
            )
          })}
        </div>
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div
          ref={panelRef}
          className={cn(
            "hidden lg:block fixed left-16 top-1/2 -translate-y-1/2 z-50 w-60 max-h-[80vh] shadow-2xl p-6",
            "overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
          )}
        >
          <h2 className="text-xs font-semibold tracking-wider text-gray-900 dark:text-gray-100 mb-6">
            CONTENTS
          </h2>

          <nav className="space-y-1">
            {headings.map(heading => {
              const isActive = heading.id === activeId

              return (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "flex items-start w-full text-left py-1 rounded transition-colors cursor-pointer text-sm",
                    getIndentClass(heading.level),
                    isActive
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  {heading.text}
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
