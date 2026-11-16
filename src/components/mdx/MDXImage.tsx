"use client"

import Image from "next/image"
import { useState } from "react"
import { FiMaximize2 } from "react-icons/fi"
import ImageLightbox from "@/components/ImageLightbox"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"

type MDXImageProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & { src?: string }

/**
 * Renders images embedded in MDX body content with a card/shadow treatment, a hover-revealed
 * expand button, and a full-screen lightbox (with download) on click. Registered under both the
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

  if (!src) return null

  const numericWidth = typeof width === "string" ? parseInt(width, 10) : width
  const numericHeight = typeof height === "string" ? parseInt(height, 10) : height
  const hasIntrinsicSize = Boolean(numericWidth && numericHeight)

  const expandLabel = alt ? `Expand image: ${alt}` : "Expand image"

  return (
    // Clicking anywhere on the image opens it for mouse users; the expand button is the
    // keyboard/screen-reader entry point and the element focus returns to on close.
    // React events bubble out of the lightbox's portal into this div, so only clicks that
    // really land on the image (inside this div in the DOM) open it.
    <div
      onClick={e => {
        if (e.currentTarget.contains(e.target as Node)) setIsOpen(true)
      }}
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
            "block h-auto w-auto max-w-full rounded-xl",
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
            "block h-auto w-full max-w-full rounded-xl",
            "shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] dark:shadow-[0_0_18px_2px_rgba(0,0,0,0.5)]",
            className
          )}
        />
      )}

      <ImageLightbox
        images={[{ src, alt }]}
        index={0}
        open={isOpen}
        onOpenChange={setIsOpen}
        trigger={
          <button
            type="button"
            onClick={e => e.stopPropagation()}
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
            <FiMaximize2 className="h-4 w-4" aria-hidden="true" />
          </button>
        }
      />
    </div>
  )
}
