'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Projects', path: '/projects' },
    // More later
]

export default function Header() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 border-b shadow-sm">
            <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-4 gap-4 sm:gap-0">
                <h1 className="text-2xl font-bold">MyPortfolio</h1>
                <ul className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                    {navItems.map(({ name, path }) => (
                        <li key={name}>
                            <Link
                                href={path}
                                className={`hover:text-blue-600 transition ${
                                    pathname === path ? 'text-blue-600 font-semibold' : ''
                                }`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}
