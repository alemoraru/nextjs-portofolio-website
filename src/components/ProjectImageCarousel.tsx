"use client"

import Image from "next/image"
import React, { useCallback, useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface ProjectImageCarouselProps {
  images: { src: string; alt: string }[]
}

/**
 * ProjectImageCarousel component that displays a carousel of images with navigation controls and indicators.
 * @param images - An array of image objects containing `src` and `alt` properties.
 */
export default function ProjectImageCarousel({ images }: ProjectImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

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

  if (images.length === 0) return null

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
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
                  className="object-contain select-none"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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

          <div className="flex items-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? "w-8 bg-accent-500"
                    : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

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
    </div>
  )
}
