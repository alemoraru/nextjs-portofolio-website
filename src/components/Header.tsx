"use client"

import { useState } from "react"
import Breadcrumbs from "@/components/Breadcrumbs"
import MobileMenu from "@/components/MobileMenu"
import MobileMenuToggle from "@/components/MobileMenuToggle"
import NavigationMenu from "@/components/NavigationMenu"
import ThemeToggleButton from "@/components/ThemeToggleButton"
import { cn } from "@/lib/utils"

/**
 * Header component that serves as the top navigation bar for the portfolio.
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      id="headerPortfolio"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "text-black dark:text-white",
        "bg-zinc-50/90 dark:bg-black/90",
        "border-b border-gray-300 dark:border-gray-800",
        "backdrop-blur-md backdrop-saturate-150",
        "shadow-sm hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "max-w-4xl mx-auto w-full px-5 py-4 md:py-5",
          "flex items-center justify-between gap-4",
          "transition-all duration-300"
        )}
      >
        {/* Left side: logo or current path */}
        <Breadcrumbs />

        {/* Center: Segmented navigation - Hidden on mobile */}
        <NavigationMenu />

        {/* Right side: Theme toggle + Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Theme toggle button */}
          <ThemeToggleButton />

          {/* Hamburger Mobile Menu toggle */}
          <MobileMenuToggle
            isOpen={mobileMenuOpen}
            onToggleAction={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} setIsOpenAction={setMobileMenuOpen} />
    </header>
  )
}
