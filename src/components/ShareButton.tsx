"use client"

import { useEffect, useRef, useState } from "react"
import { FaCheck, FaEnvelope, FaLink, FaLinkedin, FaShareAlt } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { NEW_TAB_HINT } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  /** Absolute, canonical URL of the page being shared. */
  url: string
  /** Title of the page, used as the share text / email subject. */
  title: string
}

/** How long (ms) the "Copied" confirmation stays visible. */
const COPIED_RESET_MS = 2000

const itemClasses = cn(
  "flex w-full items-center gap-3 px-3 py-2 rounded-lg cursor-pointer",
  "text-sm font-medium text-gray-800 dark:text-gray-200",
  "hover:bg-gray-100 dark:hover:bg-gray-700",
  "hover:text-accent-600 dark:hover:text-accent-400",
  "transition-colors duration-200",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
)

/**
 * "Share" button for blog posts. On touch devices that support the Web Share API it opens the
 * native share sheet; elsewhere it opens a popover with LinkedIn, X, email and copy-link options.
 * Uses plain share-intent URLs so no third-party scripts or trackers are loaded.
 */
export default function ShareButton({ url, title }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(copyTimeout.current), [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      label: "LinkedIn",
      icon: FaLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      external: true,
    },
    {
      label: "X (Twitter)",
      icon: FaXTwitter,
      href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
      external: true,
    },
    {
      label: "Email",
      icon: FaEnvelope,
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A${encodedUrl}`,
      external: false,
    },
  ]

  const handleOpenChange = async (open: boolean) => {
    const prefersNativeSheet =
      open &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      window.matchMedia?.("(pointer: coarse)").matches

    if (prefersNativeSheet) {
      try {
        await navigator.share({ title, url })
      } catch {
        // The user dismissed the share sheet; nothing to do.
      }
      return
    }
    setIsOpen(open)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      clearTimeout(copyTimeout.current)
      copyTimeout.current = setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } catch {
      // Clipboard access can be denied; leave the button unchanged.
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border cursor-pointer",
            "text-sm font-medium text-gray-800 dark:text-gray-200",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "hover:border-gray-400 dark:hover:border-gray-600",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black",
            isOpen
              ? "bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600"
              : "border-gray-300 dark:border-gray-700"
          )}
        >
          <FaShareAlt className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0">
        <div className="p-1.5">
          {links.map(({ label, icon: Icon, href, external }) => (
            <a
              key={label}
              href={href}
              onClick={() => setIsOpen(false)}
              className={itemClasses}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {external && (
                <>
                  {" "}
                  <span className="sr-only">{NEW_TAB_HINT}</span>
                </>
              )}
            </a>
          ))}
        </div>
        <Separator />
        <div className="p-1.5">
          <button type="button" onClick={handleCopy} className={itemClasses}>
            {copied ? (
              <FaCheck className="w-4 h-4 shrink-0 text-accent-600 dark:text-accent-400" />
            ) : (
              <FaLink className="w-4 h-4 shrink-0" />
            )}
            <span aria-live="polite">{copied ? "Link copied!" : "Copy link"}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
