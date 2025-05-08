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

    const crumbs = segments.map((segment, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        const label = segment
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())

        return (
            <span key={href} className="flex items-center gap-1">
                <span className="text-gray-500">/</span>
                <Link href={href} className="hover:text-blue-400 transition-colors">{label}</Link>
            </span>
        )
    })

    return (
        <div className="flex items-center gap-1 text-lg text-white">
            <Link href="/" className="hover:text-blue-400 font-semibold">MyCV</Link>
            {crumbs}
        </div>
    )
}
