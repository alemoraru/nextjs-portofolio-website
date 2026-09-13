"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Breadcrumbs from "@/components/Breadcrumbs"
import MobileMenu from "@/components/MobileMenu"
import MobileMenuToggle from "@/components/MobileMenuToggle"
import NavigationMenu from "@/components/NavigationMenu"
import { usePageHeader } from "@/components/PageHeaderProvider"
import PageHeaderTitleBlock from "@/components/PageHeaderTitleBlock"
import { ScrollProgress } from "@/components/ScrollProgress"
import ThemeToggleButton from "@/components/ThemeToggleButton"
import { cn } from "@/lib/utils"

// Root path segments whose /<root>/<slug> pages get the mobile header title flip.
const DETAIL_PAGE_ROOTS = ["blog", "projects", "work"]
const DETAIL_PAGE_REGEX = new RegExp(`^/(${DETAIL_PAGE_ROOTS.join("|")})/[^/]+$`)

// Tailwind's `md` breakpoint - the flip is a mobile-only affordance.
const MOBILE_MEDIA_QUERY = "(max-width: 767px)"

// Below this scroll distance (px) the flip is always forced back to breadcrumbs.
const SCROLL_FLIP_HIDE_THRESHOLD_PX = 24

// The flip is only allowed to trigger past this larger scroll distance (px). Kept well
// above the hide threshold so the small rebound iOS produces when a pull-to-refresh
// bounce springs back near the top can't be misread as a genuine scroll-down gesture.
const SCROLL_FLIP_SHOW_THRESHOLD_PX = 80

const FLIP_TRANSITION = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }

/**
 * Header component that serves as the top navigation bar for the portfolio.
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const lastScrollYRef = useRef(0)
  const pathname = usePathname()
  const { headerInfo } = usePageHeader()

  // Whether the current page is a detail page (blog post, project, or work item). Drives both
  // the mobile header title flip and the reading-progress bar. `DETAIL_PAGE_REGEX` ends in
  // `[^/]+$`, so list/tag pages like `/blog/tag/<tag>` are correctly excluded.
  const isDetailPage = DETAIL_PAGE_REGEX.test(pathname)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
    setIsMobile(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // On mobile, detail pages (blog post/project/work item) flip the breadcrumbs over to
  // reveal the page title once the reader starts scrolling down, and flip back when
  // scrolling back up.
  useEffect(() => {
    if (!isDetailPage || !headerInfo) {
      setIsScrolled(false)
      return
    }

    lastScrollYRef.current = window.scrollY
    let frame = 0

    // Coalesce bursts of scroll events into one check per frame; `window.scrollY` is a
    // cheap read (no forced layout) and React skips the re-render when the flag is unchanged.
    const evaluate = () => {
      frame = 0
      const currentScrollY = window.scrollY
      const previousScrollY = lastScrollYRef.current

      if (currentScrollY <= SCROLL_FLIP_HIDE_THRESHOLD_PX) {
        setIsScrolled(false)
      } else if (
        currentScrollY > previousScrollY &&
        currentScrollY > SCROLL_FLIP_SHOW_THRESHOLD_PX
      ) {
        setIsScrolled(true)
      } else if (currentScrollY < previousScrollY) {
        setIsScrolled(false)
      }

      lastScrollYRef.current = currentScrollY
    }

    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(evaluate)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isDetailPage, headerInfo])

  const showTitleBlock = isDetailPage && isMobile && isScrolled && headerInfo !== null

  return (
    <header
      id="headerPortfolio"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "text-black dark:text-white",
        "bg-zinc-50/75 dark:bg-zinc-950/75",
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
        {/* Left side: logo or current path. On mobile, detail pages (blog post/project/
            work item) flip this over to reveal the page title once the reader scrolls down. */}
        <div className="min-w-0 flex-1 md:flex-initial" style={{ perspective: 1000 }}>
          <AnimatePresence mode="wait" initial={false}>
            {showTitleBlock && headerInfo ? (
              <motion.div
                key="title-block"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={FLIP_TRANSITION}
                style={{ transformOrigin: "top" }}
              >
                <PageHeaderTitleBlock title={headerInfo.title} subtitle={headerInfo.subtitle} />
              </motion.div>
            ) : (
              <motion.div
                key="breadcrumbs"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={FLIP_TRANSITION}
                style={{ transformOrigin: "top" }}
              >
                <Breadcrumbs />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

      {/* Reading-progress bar on blog post / project / work detail pages: always shown on
          desktop, but on mobile it only appears once the reader starts scrolling (alongside
          the title flip). */}
      {isDetailPage && (
        <div className={cn("md:block", isScrolled ? "block" : "hidden")}>
          <ScrollProgress />
        </div>
      )}
    </header>
  )
}
