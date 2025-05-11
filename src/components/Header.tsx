'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {FaMoon, FaSun, FaBars, FaTimes} from 'react-icons/fa'
import {useState, useEffect, useRef} from 'react'
import Breadcrumbs from "@/components/Breadcrumbs";
import {useTheme} from "@/hooks/useTheme";
import NavigationMenu from "@/components/NavigationMenu";

const navItems = [
    {name: 'Home', path: '/'},
    {name: 'Work', path: '/work'},
    {name: 'Projects', path: '/projects'},
    {name: 'Blog', path: '/blog'}
]

export default function Header() {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const [theme, setTheme] = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false)
            }
        }
        if (mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [mobileMenuOpen])

    return (
        <header
            id="headerPortfolio"
            className="sticky top-0 z-50 w-full bg-white text-black dark:bg-black dark:text-white transition-colors
            border-b border-gray-800 dark:opacity-95"
        >
            <div
                className="max-w-4xl mx-auto w-full px-4 py-4 transition-all duration-300 flex items-center justify-between">

                {/* Left side: logo or current path */}
                <Breadcrumbs/>

                {/* Center: Segmented navigation - Hidden on mobile */}
                <NavigationMenu/>

                {/* Right side: Theme toggle + Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full transition-colors cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <FaSun/> : <FaMoon/>}
                    </button>

                    {/* Hamburger menu toggle */}
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                    >
                      <span
                          className={`inline-block transform transition-transform duration-300 ease-in-out ${
                              mobileMenuOpen ? 'rotate-90' : 'rotate-0'
                          }`}
                      >
                        {mobileMenuOpen ? <FaTimes/> : <FaBars/>}
                      </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`md:hidden px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <ul className="flex flex-col gap-2 mt-2">
                    {navItems.map(({name, path}) => (
                        <li key={name}>
                            <Link
                                href={path}
                                className={`block w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    pathname === path
                                        ? 'bg-indigo-600 text-black dark:text-white'
                                        : 'text-black dark:text-white hover:bg-gray-800'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    )
}

