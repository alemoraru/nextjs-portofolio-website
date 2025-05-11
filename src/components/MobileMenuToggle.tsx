'use client'

import {FaBars, FaTimes} from 'react-icons/fa'

/**
 * A functional component that renders a mobile menu toggle button with an icon.
 */
export default function MobileMenuToggle({isOpen, onToggleAction}: {
    isOpen: boolean,
    onToggleAction: () => void
}) {
    return (
        <button
            className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors"
            onClick={onToggleAction}
            aria-label="Toggle Navigation Menu"
        >
      <span
          className={`inline-block transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-90' : 'rotate-0'
          }`}
      >
        {isOpen ? <FaTimes/> : <FaBars/>}
      </span>
        </button>
    )
}
