'use client'

import {FaMoon, FaSun} from 'react-icons/fa'
import {useTheme} from '@/hooks/useTheme'

/**
 * A functional component that renders a button to toggle between light and dark themes.
 */
export default function ThemeToggleButton() {
    const [theme, setTheme] = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <FaSun/> : <FaMoon/>}
        </button>
    )
}
