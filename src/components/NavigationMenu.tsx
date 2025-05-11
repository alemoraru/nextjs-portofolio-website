'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import {navItems} from '@/lib/constants'

/**
 * NavigationMenu component that displays a horizontal navigation menu.
 * This component is to be used in the header of the application on desktop devices.
 */
export default function NavigationMenu() {
    const pathname = usePathname()
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const index = navItems.findIndex(({path}) =>
            path === '/' ? pathname === '/' : pathname.startsWith(path)
        )
        setActiveIndex(index !== -1 ? index : 0)
    }, [pathname])

    return (
        <nav className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ul className="flex items-center justify-center gap-1 border border-gray-600 rounded-full px-1 py-1 relative">
                <div
                    className="absolute top-0 left-0 h-full border-2 border-blue-500 rounded-full transition-transform duration-300 pointer-events-none"
                    style={{
                        width: `calc(100% / ${navItems.length})`,
                        transform: `translateX(${activeIndex * 100}%)`,
                    }}
                ></div>
                {navItems.map(({name, path}) => {
                    const isActive = pathname === path
                    return (
                        <li key={name} className="relative z-10 flex justify-center items-center">
                            <Link
                                href={path}
                                className={`px-4 py-2 rounded-full text-sm font-medium text-center transition-all ${
                                    isActive
                                        ? 'text-black dark:text-white'
                                        : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                            >
                                {name}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
