"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FaCalendarAlt } from "react-icons/fa"
import AnimatedCard from "@/components/AnimatedCard"
import HoverArrow from "@/components/HoverArrow"
import TechBadge from "@/components/TechBadge"
import { MAX_PROJECT_TILE_TECH_BADGES } from "@/lib/constants"
import { calculateDuration, cn, formatDateRange } from "@/lib/utils"

interface ProjectTileProps {
  slug: string
  title: string
  image: string
  description?: string
  techStack?: string[]
  startDate?: string
  endDate?: string
  priority?: boolean
}

/**
 * A functional component that renders a project tile with a link, image, title, dates, duration, and tech stack.
 *
 * @param {Object} props - The prop object for the component.
 */
export default function ProjectTile({
  slug,
  title,
  image,
  description,
  techStack,
  startDate,
  endDate,
  priority = false,
}: ProjectTileProps) {
  return (
    <Link href={`/projects/${slug}`} className="block h-full">
      <AnimatedCard
        className={cn(
          "group relative overflow-hidden rounded-lg h-full flex flex-col",
          "border border-gray-300 dark:border-gray-700",
          "bg-white dark:bg-gray-900",
          "shadow-sm hover:shadow-2xl hover:shadow-accent-500/20",
          "hover:border-accent-500 dark:hover:border-accent-500",
          "transition-[border-color,box-shadow] duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-black"
        )}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-110",
              "rounded-b-lg border-b border-gray-300 dark:border-gray-700"
            )}
          />

          {/* Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute inset-0 bg-linear-to-t from-accent-800/65 via-accent-600/40 to-transparent",
              "flex flex-col items-center justify-center gap-2 p-4"
            )}
          >
            <span className="text-white text-lg font-bold tracking-tight">Explore Project</span>
            <HoverArrow className="text-white text-2xl font-bold" />
          </motion.div>
        </div>

        {/* Title, Description, and Metadata */}
        <div
          className={cn(
            "flex-1 p-4",
            "bg-linear-to-b from-white to-gray-50/70",
            "dark:from-gray-900 dark:to-gray-900/65",
            "flex flex-col gap-3"
          )}
        >
          <div className="flex flex-col gap-2">
            <h3
              className={cn(
                "text-lg font-bold text-gray-900 dark:text-white",
                "group-hover:text-accent-600 dark:group-hover:text-accent-400",
                "transition-colors duration-200 text-center"
              )}
            >
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed text-center">
                {description}
              </p>
            )}
          </div>

          {/* Date Range and Duration */}
          {startDate && endDate && (
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{formatDateRange(startDate, endDate)}</span>
              <span>·</span>
              <span>{calculateDuration(startDate, endDate)}</span>
            </div>
          )}

          {/* Tech Stack */}
          {techStack &&
            techStack.length > 0 &&
            (() => {
              const visibleTechStack = techStack.slice(0, MAX_PROJECT_TILE_TECH_BADGES)
              const remainingCount = techStack.length - MAX_PROJECT_TILE_TECH_BADGES

              return (
                <div className="flex flex-wrap justify-center gap-2">
                  {visibleTechStack.map(techName => (
                    <TechBadge key={techName} techName={techName} variant="small" />
                  ))}
                  {remainingCount > 0 && (
                    <div
                      className={cn(
                        "flex items-center bg-gray-200 dark:bg-gray-700 rounded-full",
                        "gap-1.5 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300"
                      )}
                    >
                      + {remainingCount} more
                    </div>
                  )}
                </div>
              )
            })()}
        </div>
      </AnimatedCard>
    </Link>
  )
}
