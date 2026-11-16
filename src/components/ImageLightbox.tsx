"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import React, { ReactNode } from "react"
import { FiChevronLeft, FiChevronRight, FiDownload, FiX } from "react-icons/fi"
import { cn } from "@/lib/utils"

export interface LightboxImage {
  src: string
  alt: string
}

interface ImageLightboxProps {
  /** Every image the lightbox can show. */
  images: LightboxImage[]
  /** Index of the image currently shown. */
  index: number
  /** Called with the new index when the viewer steps to another image. Omit for a single image. */
  onIndexChange?: (index: number) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * The button that opens the lightbox. Radix returns focus to it when the lightbox closes,
   * so keyboard and screen-reader users land back where they started.
   */
  trigger: ReactNode
}

const controlButtonClasses = cn(
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
  "bg-white/90 text-gray-900 shadow-lg transition-colors hover:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
  "focus-visible:ring-offset-2"
)

const fadeClasses = cn(
  "data-[state=open]:animate-[lightbox-in_150ms_ease-out]",
  "data-[state=closed]:animate-[lightbox-out_150ms_ease-in]",
  "motion-reduce:animate-none"
)

/**
 * Full-screen image viewer built on Radix Dialog, shared by MDX body images and the project
 * gallery. Radix supplies the dialog semantics (`role="dialog"`, `aria-modal`, a title), moves
 * focus inside on open, keeps Tab inside while open, hides the rest of the page from assistive
 * tech, locks page scroll, closes on Escape, and returns focus to the trigger on close.
 */
export default function ImageLightbox({
  images,
  index,
  onIndexChange,
  open,
  onOpenChange,
  trigger,
}: ImageLightboxProps) {
  const image = images[index]
  const canBrowse = images.length > 1 && Boolean(onIndexChange)

  const showPrev = () => onIndexChange?.((index - 1 + images.length) % images.length)
  const showNext = () => onIndexChange?.((index + 1) % images.length)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canBrowse) return
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      showPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      showNext()
    }
  }

  // The content fills the screen so the controls can sit at its edges; a click that is on
  // the content itself (not the image or a control) is a click on the backdrop.
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      {image && (
        <Dialog.Portal>
          {/* Dark in both themes on purpose: screenshots and photos stand out against it. */}
          <Dialog.Overlay className={cn("fixed inset-0 z-60 bg-black/90", fadeClasses)} />
          <Dialog.Content
            onKeyDown={handleKeyDown}
            onClick={handleBackdropClick}
            // Without browsing there is no position to describe; tell Radix not to expect one.
            {...(!canBrowse && { "aria-describedby": undefined })}
            className={cn(
              "mdx-lightbox-overlay fixed inset-0 z-60 flex items-center justify-center",
              "p-4 md:p-10 outline-none",
              fadeClasses
            )}
          >
            <Dialog.Title className="sr-only">
              {image.alt ? `Image preview: ${image.alt}` : "Image preview"}
            </Dialog.Title>
            {canBrowse && (
              <Dialog.Description className="sr-only" aria-live="polite">
                Image {index + 1} of {images.length}
              </Dialog.Description>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={index}
                src={image.src}
                alt={image.alt}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="max-h-[90vh] max-w-[90vw] select-none rounded-md object-contain shadow-2xl"
              />
            </AnimatePresence>

            <Dialog.Close
              aria-label="Close image preview"
              className={cn(controlButtonClasses, "absolute left-2 top-2 md:left-6 md:top-6")}
            >
              <FiX className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>

            <a
              href={image.src}
              download
              aria-label="Download image"
              className={cn(controlButtonClasses, "absolute right-4 top-4 md:right-6 md:top-6")}
            >
              <FiDownload className="h-5 w-5" aria-hidden="true" />
            </a>

            {canBrowse && (
              <>
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Previous image"
                  className={cn(
                    controlButtonClasses,
                    "absolute left-2 top-1/2 -translate-y-1/2 md:left-6"
                  )}
                >
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next image"
                  className={cn(
                    controlButtonClasses,
                    "absolute right-2 top-1/2 -translate-y-1/2 md:right-6"
                  )}
                >
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>

                <span
                  aria-hidden="true"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm tabular-nums text-white/80 md:bottom-6"
                >
                  {index + 1} / {images.length}
                </span>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  )
}
