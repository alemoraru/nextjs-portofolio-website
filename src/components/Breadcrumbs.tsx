"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { homeIntroConfig } from "@/data/content"
import { cn, getInitials } from "@/lib/utils"

/**
 * The "breadcrumbs" component that displays the current path as a series of links.
 */
export default function Breadcrumbs() {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  // Generate initials from the name
  const initials = getInitials(homeIntroConfig.name)

  // Only show breadcrumbs for /blog, /projects, /work and their subpaths
  const allowedRoots = ["blog", "projects", "work"]

  // Show breadcrumbs for allowed root paths and their subpaths
  // Note: We don't validate slugs here as invalid slugs will 404 at the page level
  const showBreadcrumbs = segments.length > 0 && allowedRoots.includes(segments[0])

  // On individual detail pages (/blog/<slug>, /projects/<slug>, /work/<slug>), the mobile
  // header flips to show the page title once the reader scrolls (see Header), so keep the
  // crumb trail down to just the root segment here instead of also spelling out the slug.
  const isDetailPage = segments.length === 2 && allowedRoots.includes(segments[0])
  const displaySegments = isDetailPage ? segments.slice(0, 1) : segments

  return (
    <div className="flex items-center gap-2 min-w-0 text-lg text-black dark:text-white my-auto">
      <Link
        href="/"
        className={cn(
          "shrink-0 hover:text-accent-500 dark:hover:text-accent-400 font-semibold",
          "transition-all duration-200 hover:scale-105 active:scale-95"
        )}
      >
        {/* Initials on mobile */}
        <span className="block md:hidden text-lg">{initials}</span>
        {/* Full name on desktop */}
        <span className="hidden md:inline text-lg">{homeIntroConfig.name}</span>
      </Link>

      {/* Crumbs part: show only on mobile, not on desktop */}
      <span className="flex md:hidden items-center gap-1.5 min-w-0">
        {showBreadcrumbs &&
          displaySegments.map((segment, i) => {
            const href = "/" + segments.slice(0, i + 1).join("/")

            // Route segments (e.g. a tag slug) can be URL-encoded - decode before
            // formatting so labels read as text instead of raw "%20"-style escapes.
            let decodedSegment = segment
            try {
              decodedSegment = decodeURIComponent(segment)
            } catch {
              // Malformed escape sequence - fall back to the raw segment
            }
            const label = decodedSegment
              .replace(/[-_]/g, " ")
              .replace(/\b\w/g, l => l.toUpperCase())

            // Last segment is the only one that can be arbitrarily long (e.g. a tag
            // name), so it's the only one that needs to shrink/truncate.
            const isLastSegment = i === displaySegments.length - 1

            return (
              <span
                key={href}
                className={cn("flex items-center gap-1.5", isLastSegment && "min-w-0")}
              >
                <span className="text-gray-400 dark:text-gray-600 font-mono text-sm shrink-0">
                  /
                </span>
                <Link
                  href={href}
                  className={cn(
                    "text-sm font-medium text-black dark:text-white",
                    "hover:text-accent-500 dark:hover:text-accent-400",
                    "transition-all duration-200 hover:underline",
                    "underline-offset-2 decoration-accent-500/50",
                    isLastSegment && "truncate min-w-0"
                  )}
                >
                  {label}
                </Link>
              </span>
            )
          })}
      </span>
    </div>
  )
}
