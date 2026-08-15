"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { FiDownload, FiMaximize2, FiX } from "react-icons/fi"
import { useClickOutside } from "@/hooks/useClickOutside"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

type MDXImageProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & { src?: string }

const overlayControlButtonClasses = cn(
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
  "bg-white/90 text-gray-900 shadow-lg transition-colors hover:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
  "focus-visible:ring-offset-2"
)

/**
 * Renders images embedded in MDX body content with a card/shadow treatment, a hover-revealed
 * expand icon, and a full-screen lightbox (with download) on click. Registered under both the
 * `img` and `Image` MDX component keys so Markdown `![]()` syntax and hand-authored JSX
 * `<Image>` usage both route through here.
 *
 * To opt an image into the `next/image` code path (optimized, no layout shift), pass `width`
 * and `height` as quoted string literals, e.g. `<Image src="..." width="1200" height="800" />`.
 * `next-mdx-remote`'s `blockJS` sandboxing strips curly-brace JS expression attributes
 * (`width={1200}`) from MDX by default, so numeric expressions never reach this component.
 */
export function MDXImage({ src, alt = "", title, width, height, className }: MDXImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const lightboxImgRef = useRef<HTMLImageElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  useClickOutside([lightboxImgRef, closeButtonRef, downloadLinkRef], () => setIsOpen(false), {
    enabled: isOpen,
  })

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!src) return null

  const numericWidth = typeof width === "string" ? parseInt(width, 10) : width
  const numericHeight = typeof height === "string" ? parseInt(height, 10) : height
  const hasIntrinsicSize = Boolean(numericWidth && numericHeight)

  const expandLabel = alt ? `Expand image: ${alt}` : "Expand image"

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="not-prose group relative my-6 w-fit max-w-full cursor-zoom-in p-4"
      >
        {hasIntrinsicSize ? (
          <Image
            src={src}
            alt={alt}
            title={title}
            width={numericWidth}
            height={numericHeight}
            sizes="(max-width: 768px) 100vw, 720px"
            className={cn(
              "block h-auto w-auto max-w-full rounded-lg",
              "shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] dark:shadow-[0_0_18px_2px_rgba(0,0,0,0.5)]",
              className
            )}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- no compile-time dimensions
          <img
            src={src}
            alt={alt}
            title={title}
            loading="lazy"
            decoding="async"
            className={cn(
              "block h-auto w-full max-w-full rounded-lg",
              "shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] dark:shadow-[0_0_18px_2px_rgba(0,0,0,0.5)]",
              className
            )}
          />
        )}

        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          aria-label={expandLabel}
          className={cn(
            "absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md",
            "border border-transparent bg-black/60 text-white backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            "hover:border-accent-500 dark:hover:border-accent-400 hover:text-accent-400",
            "transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          )}
        >
          <FiMaximize2 className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ zIndex: 60 }}
            className="mdx-lightbox-overlay fixed inset-0 flex items-center justify-center bg-black/90 p-4 md:p-10"
          >
            <motion.img
              ref={lightboxImgRef}
              src={src}
              alt={alt}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="max-h-[90vh] max-w-[90vw] select-none rounded-md object-contain shadow-2xl"
            />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close image preview"
              className={cn(
                overlayControlButtonClasses,
                "absolute left-2 top-2 md:left-6 md:top-6"
              )}
            >
              <FiX className="h-5 w-5" />
            </button>

            <a
              ref={downloadLinkRef}
              href={src}
              download
              aria-label="Download image"
              className={cn(
                overlayControlButtonClasses,
                "absolute right-4 top-4 md:right-6 md:top-6"
              )}
            >
              <FiDownload className="h-5 w-5" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
