"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FaCalendarAlt } from "react-icons/fa"
import TechBadge from "@/components/TechBadge"
import { calculateDuration, cn } from "@/lib/utils"

interface ProjectTileProps {
  slug: string
  title: string
  image: string
  description?: string
  techStack?: string[]
  startDate?: string
  endDate?: string
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
}: ProjectTileProps) {
  return (
    <Link href={`/projects/${slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 0.8 } }}
        whileHover={{
          scale: 1.05,
          filter: "brightness(1.15)",
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: 0.4,
          },
        }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative overflow-hidden rounded-lg h-full flex flex-col",
          "border border-gray-300 dark:border-gray-700",
          "bg-white dark:bg-gray-900",
          "shadow-sm hover:shadow-2xl hover:shadow-blue-500/20",
          "hover:border-blue-500 dark:hover:border-blue-500",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-black"
        )}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Image
            src={image}
            alt={title}
            fill
            loading="lazy"
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
              "absolute inset-0 bg-linear-to-t from-blue-600/70 via-blue-500/70 to-transparent",
              "flex flex-col items-center justify-center gap-2 p-4"
            )}
          >
            <span className="text-white text-lg font-bold tracking-tight">Explore Project</span>
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="text-white text-2xl font-bold"
            >
              →
            </motion.span>
          </motion.div>
        </div>

        {/* Title, Description, and Metadata */}
        <div
          className={cn(
            "flex-1 p-4",
            "bg-linear-to-b from-white to-gray-50",
            "dark:from-gray-900 dark:to-gray-900/80",
            "flex flex-col gap-3"
          )}
        >
          <div className="flex flex-col gap-2">
            <h3
              className={cn(
                "text-lg font-bold text-gray-900 dark:text-white",
                "group-hover:text-blue-600 dark:group-hover:text-blue-400",
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
              <span>
                {startDate} – {endDate}
              </span>
              <span>·</span>
              <span>{calculateDuration(startDate, endDate)}</span>
            </div>
          )}

          {/* Tech Stack */}
          {techStack &&
            techStack.length > 0 &&
            (() => {
              const maxBadges = 5 // Show at most 5 badges (approximately 2 rows)
              const visibleTechStack = techStack.slice(0, maxBadges)
              const remainingCount = techStack.length - maxBadges

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
      </motion.div>
    </Link>
  )
}
