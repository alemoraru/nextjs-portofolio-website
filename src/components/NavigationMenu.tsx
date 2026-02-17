"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { navItems } from "@/lib/constants"

/**
 * NavigationMenu component that displays a horizontal navigation menu.
 * This component is to be used in the header of the application on desktop devices.
 */
export default function NavigationMenu() {
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const index = navItems.findIndex(({ path }) =>
      path === "/" ? pathname === "/" : pathname.startsWith(path)
    )
    setActiveIndex(index !== -1 ? index : 0)
  }, [pathname])

  return (
    <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <ul
        className="flex items-center justify-center gap-0.5
                   border border-gray-300 dark:border-gray-700
                   bg-white/80 dark:bg-black/80
                   rounded-full px-1.5 py-1.5 relative
                   shadow-lg backdrop-blur-sm
                   hover:shadow-xl transition-shadow duration-300 min-h-0"
      >
        {/* Animated active indicator as the border only */}
        <div
          className="absolute top-0 left-0 h-full transition-all duration-300 ease-in-out pointer-events-none z-0 flex
                     bg-accent-500/10 dark:bg-accent-500/10"
          style={{
            width: `calc((100% - ${navItems.length - 1} * 0.120rem) / ${navItems.length})`,
            transform: `translateX(calc(${activeIndex} * (100% + 0.125rem)))`,
            border: "2px solid var(--accent-500)",
            borderRadius: "9999px",
            boxShadow: "0 2 12px color-mix(in srgb, var(--accent-500) 30%, transparent)",
          }}
        ></div>
        {navItems.map(({ name, path }, idx) => {
          const isActive = pathname === path
          return (
            <li key={name} className="relative z-10 flex justify-center items-center">
              <Link
                href={path}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex items-center justify-center px-3 py-1.5 rounded-full text-[15px] font-medium text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black min-w-[72px] text-ellipsis whitespace-nowrap overflow-hidden select-none active:scale-95
                                    ${isActive ? "text-accent-600 dark:text-accent-400 font-semibold" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800/50"}
                                `}
                tabIndex={0}
              >
                {name}
              </Link>
              {/* Invisible divider except last item */}
              {idx < navItems.length - 1 && (
                <span className="mx-0.5 h-5 w-px" aria-hidden="true"></span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
