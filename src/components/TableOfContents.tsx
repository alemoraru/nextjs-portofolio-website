"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useClickOutside } from "@/hooks/useClickOutside"
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

/** Caps how tall the collapsed line-index can grow, regardless of article length. */
const MAX_LINES_CONTAINER_HEIGHT = "50vh"

/** Gradient that fades the last ~30% of the line-index to transparent when it overflows. */
const OVERFLOW_FADE_MASK = "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"

interface TableOfContentsProps {
  /**
   * CSS selector of the element whose headings are listed. Defaults to the page's `article`.
   * Use it to skip page chrome headings (e.g. the title or "Tech Stack") and only list MDX content.
   */
  contentSelector?: string
}

/**
 * Component that generates a table of contents based on the headings of an article.
 * Positioned on the left side of the page with a Substack-style design.
 * Hidden on mobile/tablet screens.
 * Renders into a portal on `document.body` so it stays fixed to the viewport at all times.
 * @param contentSelector - CSS selector of the element to read headings from (default: "article").
 */
export default function TableOfContents({ contentSelector = "article" }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeId, setActiveId] = useState<string>("")
  const [isLineIndexOverflowing, setIsLineIndexOverflowing] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lineIndexRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = document.querySelector(contentSelector)
    if (!container) return

    const headingElements = container.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems: TocItem[] = []

    headingElements.forEach((heading, index) => {
      // Exclude headings that are inside a section element (e.g., "Other posts that might interest you")
      if (heading.closest("section")) {
        return
      }

      if (!heading.id) {
        heading.id = `heading-${index}`
      }

      // Exclude the "#" anchor link injected by rehype-autolink-headings
      const clone = heading.cloneNode(true) as HTMLElement
      clone.querySelectorAll(".anchor-link").forEach(el => el.remove())

      tocItems.push({
        id: heading.id,
        text: clone.textContent?.trim() || "",
        level: parseInt(heading.tagName.substring(1)),
      })
    })

    setHeadings(tocItems)
  }, [contentSelector])

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

  // Detect whether the line-index overflows its max height, so the fade-out
  // mask only appears when there's actually more content below the fold.
  useEffect(() => {
    const container = lineIndexRef.current
    if (!container) return
    setIsLineIndexOverflowing(container.scrollHeight > container.clientHeight)
  }, [headings])

  // Close ToC when clicking outside
  useClickOutside([buttonRef, panelRef], () => setIsExpanded(false), {
    enabled: isExpanded,
    closeOnEscape: false,
  })

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

  // Get indent class based on heading level (for expanded panel)
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

  // Get width class for horizontal lines (collapsed state)
  const getLineWidthClass = (level: number) => {
    const relativeLevel = level - minLevel
    switch (relativeLevel) {
      case 0:
        return "w-4"
      case 1:
        return "w-3"
      default:
        return "w-2"
    }
  }

  // Rendered in a portal on <body>: `fixed` positioning breaks inside transformed ancestors
  // (e.g. the animated article), which made the ToC appear in the content before jumping left.
  return createPortal(
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
        <div
          ref={lineIndexRef}
          className="space-y-3 flex flex-col items-end overflow-hidden"
          style={{
            maxHeight: MAX_LINES_CONTAINER_HEIGHT,
            maskImage: isLineIndexOverflowing ? OVERFLOW_FADE_MASK : undefined,
            WebkitMaskImage: isLineIndexOverflowing ? OVERFLOW_FADE_MASK : undefined,
          }}
        >
          {headings.map(heading => {
            const isActive = heading.id === activeId
            return (
              <div
                key={heading.id}
                className={cn(
                  "h-0.5 rounded-full transition-all duration-200 shrink-0",
                  getLineWidthClass(heading.level),
                  isActive ? "bg-gray-800 dark:bg-gray-200" : "bg-gray-400 dark:bg-gray-600"
                )}
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
            "hidden lg:block fixed left-16 top-1/2 -translate-y-1/2 z-50 w-60 max-h-[75vh] shadow-2xl p-6",
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
    </>,
    document.body
  )
}
