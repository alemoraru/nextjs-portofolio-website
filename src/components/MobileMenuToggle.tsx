'use client'

import {FaXmark, FaBars} from "react-icons/fa6";

/**
 * A functional component that renders a mobile menu toggle button with an icon.
 */
export default function MobileMenuToggle({isOpen, onToggleAction}: {
    isOpen: boolean,
    onToggleAction: () => void
}) {
    return (
        <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200
            dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors mt-1"
            onClick={onToggleAction}
            aria-label="Toggle Navigation Menu"
        >
        <span className={`inline-block transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-90' : 'rotate-0'}`}
        >
            {isOpen ? <FaXmark className="w-5 h-5"/> : <FaBars className="w-5 h-5"/>}
        </span>
        </button>
    )
}
