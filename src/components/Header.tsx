'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/theme-context'
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Projects', path: '/projects' },
    // More later
]

export default function Header() {
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()
    const [activeIndex, setActiveIndex] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const index = navItems.findIndex(({ path }) => path === pathname)
        setActiveIndex(index !== -1 ? index : 0)
    }, [pathname])

    return (
        <header
            id="headerPortfolio"
            className="sticky top-0 z-50 w-full bg-black text-white dark:bg-black transition-colors border-b border-gray-800"
        >
            <div className="max-w-6xl mx-auto w-full px-4 py-4 transition-all duration-300 flex items-center justify-between">

                {/* Left side: logo or name */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-bold text-xl"
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                >
                    MyPortfolio
                </Link>

                {/* Center: Segmented navigation - Hidden on mobile */}
                <nav className="hidden md:flex justify-center gap-8 text-white font-medium">
                    <div className="relative flex justify-center items-center flex-1">
                        <ul className="flex items-center justify-center gap-1 border border-gray-600 rounded-full px-1 py-1 relative">
                            <div
                                className="absolute top-0 left-0 h-full border-2 border-indigo-500 rounded-full transition-transform duration-300 pointer-events-none"
                                style={{
                                    width: `calc(100% / ${navItems.length})`,
                                    transform: `translateX(${activeIndex * 100}%)`,
                                }}
                            ></div>
                            {navItems.map(({ name, path }, index) => {
                                const isActive = pathname === path
                                return (
                                    <li key={name} className="relative z-10 flex justify-center items-center">
                                        <Link
                                            href={path}
                                            className={`px-4 py-2 rounded-full text-sm font-medium text-center transition-all ${
                                                isActive ? 'text-white' : 'text-white hover:bg-gray-800'
                                            }`}
                                        >
                                            {name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </nav>

                {/* Right side: Theme toggle + Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>

                    {/* Hamburger menu toggle */}
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-gray-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <nav className="md:hidden px-4 pb-4">
                    <ul className="flex flex-col gap-2 mt-2">
                        {navItems.map(({ name, path }) => (
                            <li key={name}>
                                <Link
                                    href={path}
                                    className={`block w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        pathname === path
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-white hover:bg-gray-800'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    )
}
