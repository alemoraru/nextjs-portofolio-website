"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * The "breadcrumbs" component that displays the current path as a series of links.
 */
export default function Breadcrumbs() {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  // Only show breadcrumbs for /blog, /projects, /work and their subpaths
  const allowedRoots = ["blog", "projects", "work"]

  // Show breadcrumbs for allowed root paths and their subpaths
  // Note: We don't validate slugs here as invalid slugs will 404 at the page level
  const showBreadcrumbs = segments.length > 0 && allowedRoots.includes(segments[0])

  return (
    <div className="flex items-center gap-2 text-lg text-black dark:text-white my-auto">
      <Link
        href="/"
        className="hover:text-blue-500 dark:hover:text-blue-400 font-semibold
                   transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {/* Initials on mobile */}
        <span className="block md:hidden text-lg">JD</span>
        {/* Full name on desktop */}
        <span className="hidden md:inline text-lg">John Doe</span>
      </Link>

      {/* Crumbs part: show only on mobile, not on desktop */}
      <span className="flex md:hidden items-center gap-1.5">
        {showBreadcrumbs &&
          segments.map((segment, i) => {
            const href = "/" + segments.slice(0, i + 1).join("/")
            const label = segment.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase())
            return (
              <span key={href} className="flex items-center gap-1.5">
                <span className="text-gray-400 dark:text-gray-600 font-mono text-sm">/</span>
                <Link
                  href={href}
                  className="text-sm font-medium text-black dark:text-white
                             hover:text-blue-500 dark:hover:text-blue-400
                             transition-all duration-200 hover:underline
                             underline-offset-2 decoration-blue-500/50"
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
