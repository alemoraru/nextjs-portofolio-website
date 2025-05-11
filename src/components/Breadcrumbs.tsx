'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

/**
 * Breadcrumbs component that displays the current path as a series of links.
 */
export default function Breadcrumbs() {
    const pathname = usePathname()

    const segments = pathname
        .split('/')
        .filter(Boolean)

    return (
        <div className="flex items-center gap-1 text-lg text-black dark:text-white">
            <Link href="/" className="hover:text-blue-400 font-semibold">
                {/* Initials on mobile */}
                <span className="block md:hidden">JD</span>
                {/* Full name on desktop */}
                <span className="hidden md:inline">John Doe</span>
            </Link>

            {/* Crumbs part */}
            {segments.map((segment, i) => {
                const href = '/' + segments.slice(0, i + 1).join('/')
                const label = segment
                    .replace(/[-_]/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())

                // Display only the first subpath on desktop and all on mobile
                // This is to avoid showing the full path on desktop which can be too long
                const showOnDesktop = i === 0
                return (
                    <span
                        key={href}
                        className={`
                            flex items-center gap-1
                            ${showOnDesktop ? 'md:flex' : 'md:hidden'}
                        `}
                    >
                        <span className="text-gray-500">/</span>
                        <Link
                            href={href}
                            className="text-black dark:text-white hover:text-blue-400 transition-colors"
                        >
                            {label}
                        </Link>
                    </span>
                )
            })}
        </div>
    )
}
