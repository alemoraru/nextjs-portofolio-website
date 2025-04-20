'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Work', path: '/work'},
    {name: 'Projects', path: '/projects'},
    // Future: Blog, Books
]

export default function Header() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 border-b shadow-sm">
            <nav className="container mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">MyPortfolio</h1>
                <ul className="flex gap-6">
                    {navItems.map(({name, path}) => (
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
