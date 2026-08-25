"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { FiChevronLeft, FiChevronRight, FiDownload, FiMaximize2, FiX } from "react-icons/fi"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useClickOutside } from "@/hooks/useClickOutside"
import { cn } from "@/lib/utils"

interface ProjectImageCarouselProps {
  images: { src: string; alt: string }[]
}

const overlayControlButtonClasses = cn(
  "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full",
  "bg-white/90 text-gray-900 shadow-lg transition-colors hover:bg-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
  "focus-visible:ring-offset-2"
)

/**
 * ProjectImageCarousel component that displays a carousel of images with navigation controls and indicators.
 * @param images - An array of image objects containing `src` and `alt` properties.
 */
export default function ProjectImageCarousel({ images }: ProjectImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const lightboxImgRef = useRef<HTMLImageElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)
  const prevButtonRef = useRef<HTMLButtonElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  const onSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setIsOpen(true)
  }, [])

  const showPrev = useCallback(() => {
    setLightboxIndex(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  const showNext = useCallback(() => {
    setLightboxIndex(i => (i + 1) % images.length)
  }, [images.length])

  const closeLightbox = useCallback(() => {
    setIsOpen(false)
    if (api && api.selectedScrollSnap() !== lightboxIndex) {
      api.scrollTo(lightboxIndex)
    }
  }, [api, lightboxIndex])

  useClickOutside(
    [lightboxImgRef, closeButtonRef, downloadLinkRef, prevButtonRef, nextButtonRef],
    closeLightbox,
    { enabled: isOpen }
  )

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev()
      else if (e.key === "ArrowRight") showNext()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, showPrev, showNext])

  if (images.length === 0) return null

  const lightboxImage = images[lightboxIndex]

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="group relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain select-none"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <button
          type="button"
          onClick={() => openLightbox(current)}
          aria-label={
            images[current]?.alt ? `Expand image: ${images[current].alt}` : "Expand image"
          }
          className={cn(
            "absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md",
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

      {/* Controls: prev button, pill indicators, next button */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => api?.scrollPrev()}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full cursor-pointer border",
              "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600",
              "dark:text-gray-300 hover:border-accent-500 hover:text-accent-500 transition-all"
            )}
            aria-label="Previous slide"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>

          {/* When fewer than 8 imgs, show pill indicators; otherwise show "current / total" */}
          {images.length <= 8 ? (
            <div className="flex items-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === current
                      ? "w-8 bg-accent-500"
                      : "size-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer hover:scale-120"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          ) : (
            <span className="text-sm tabular-nums text-gray-500 dark:text-gray-400 min-w-12 text-center">
              {current + 1} / {images.length}
            </span>
          )}

          <button
            onClick={() => api?.scrollNext()}
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full cursor-pointer border",
              "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600",
              "dark:text-gray-300 hover:border-accent-500 hover:text-accent-500 transition-all"
            )}
            aria-label="Next slide"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ zIndex: 60 }}
            className="fixed inset-0 flex items-center justify-center bg-black p-4 md:p-10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={lightboxIndex}
                ref={lightboxImgRef}
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="max-h-[90vh] max-w-[90vw] select-none rounded-md object-contain shadow-2xl"
              />
            </AnimatePresence>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
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
              href={lightboxImage.src}
              download
              aria-label="Download image"
              className={cn(
                overlayControlButtonClasses,
                "absolute right-4 top-4 md:right-6 md:top-6"
              )}
            >
              <FiDownload className="h-5 w-5" />
            </a>

            {images.length > 1 && (
              <>
                <button
                  ref={prevButtonRef}
                  type="button"
                  onClick={showPrev}
                  aria-label="Previous image"
                  className={cn(
                    overlayControlButtonClasses,
                    "absolute left-2 top-1/2 -translate-y-1/2 md:left-6"
                  )}
                >
                  <FiChevronLeft className="h-5 w-5" />
                </button>

                <button
                  ref={nextButtonRef}
                  type="button"
                  onClick={showNext}
                  aria-label="Next image"
                  className={cn(
                    overlayControlButtonClasses,
                    "absolute right-2 top-1/2 -translate-y-1/2 md:right-6"
                  )}
                >
                  <FiChevronRight className="h-5 w-5" />
                </button>

                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm tabular-nums text-white/80 md:bottom-6">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
