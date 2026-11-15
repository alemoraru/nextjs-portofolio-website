"use client"

import Link from "next/link"
import HoverArrow from "@/components/HoverArrow"
import { cn } from "@/lib/utils"

interface BackToPageButtonProps {
  pageUrl: string
  /** Extra classes, merged after the defaults (e.g. `mb-0` to drop the bottom margin). */
  className?: string
}

/**
 * A functional component that renders a "Back to Page" button with a link to a specified page.
 * @param pageUrl - The URL to which the button should link (e.g., "/projects").
 * @param className - Optional extra classes merged after the defaults.
 */
export default function BackToPageButton({ pageUrl, className }: BackToPageButtonProps) {
  const pageName = pageUrl.split("/").filter(Boolean).pop() || "page"
  const capitalizedName = pageName.charAt(0).toUpperCase() + pageName.slice(1)

  return (
    <Link
      href={pageUrl}
      className={cn(
        "group inline-flex items-center gap-2 mb-8",
        "text-sm font-semibold text-accent-600 dark:text-accent-400",
        "hover:gap-3 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-black rounded-sm",
        className
      )}
    >
      <HoverArrow direction="left" className="text-base" />
      <span>Back to {capitalizedName}</span>
    </Link>
  )
}
