"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { desktopNavItems } from "@/lib/constants"
import { cn } from "@/lib/utils"

// A nav item is active for its exact path or any nested subroute (e.g. "/work" is active
// for "/work/foo"), so both the sliding indicator and each link's aria-current agree.
const isPathActive = (pathname: string, path: string) =>
  pathname === path || pathname.startsWith(path + "/")

/**
 * NavigationMenu component that displays a horizontal navigation menu.
 * This component is to be used in the header of the application on desktop devices.
 */
export default function NavigationMenu() {
  const pathname = usePathname()

  const getActiveIndex = (p: string) =>
    desktopNavItems.findIndex(({ path }) => isPathActive(p, path))

  const [activeIndex, setActiveIndex] = useState(() => getActiveIndex(pathname))
  // Sliding the indicator only makes sense between two visible pill positions. Jumping to
  // or from "no active item" (e.g. the home page) should just pop in/out instead of
  // animating in from the edge, so track that transition to disable it for a single update.
  const [instant, setInstant] = useState(false)
  const prevIndexRef = useRef(activeIndex)

  useEffect(() => {
    const newIndex = getActiveIndex(pathname)
    const prevIndex = prevIndexRef.current
    setInstant(newIndex === -1 || prevIndex === -1)
    setActiveIndex(newIndex)
    prevIndexRef.current = newIndex
  }, [pathname])

  return (
    <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <ul
        className={cn(
          "flex items-center justify-center gap-0.5",
          "border border-gray-300 dark:border-gray-700",
          "bg-white/80 dark:bg-black/80",
          "rounded-full px-1.5 py-1.5 relative",
          "shadow-lg backdrop-blur-sm",
          "hover:shadow-xl transition-shadow duration-300 min-h-0"
        )}
      >
        {/* Animated active indicator as the border only */}
        <div
          className={cn(
            "absolute top-0 left-0 h-full pointer-events-none z-0 flex",
            instant ? "transition-none" : "transition-all duration-300 ease-in-out",
            "bg-accent-500/10 dark:bg-accent-500/10"
          )}
          style={{
            width: `calc((100% - ${desktopNavItems.length - 1} * 0.120rem) / ${desktopNavItems.length})`,
            transform: `translateX(calc(${activeIndex} * (100% + 0.125rem)))`,
            border: "2px solid var(--accent-500)",
            borderRadius: "9999px",
            boxShadow: "0 2 12px color-mix(in srgb, var(--accent-500) 30%, transparent)",
            opacity: activeIndex === -1 ? 0 : 1,
          }}
        ></div>
        {desktopNavItems.map(({ name, path }, idx) => {
          const isActive = isPathActive(pathname, path)
          return (
            <li key={name} className="relative z-10 flex justify-center items-center">
              <Link
                href={path}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center justify-center px-3 py-1.5 rounded-full text-[15px]",
                  "font-medium text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black min-w-18",
                  "text-ellipsis whitespace-nowrap overflow-hidden select-none active:scale-95",
                  isActive
                    ? "text-accent-600 dark:text-accent-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800/50"
                )}
                tabIndex={0}
              >
                {name}
              </Link>
              {/* Invisible divider except last item */}
              {idx < desktopNavItems.length - 1 && (
                <span className="mx-0.5 h-5 w-px" aria-hidden="true"></span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
