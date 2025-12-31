"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
 * A functional component that renders a project tile with a link, image, and title.
 *
 * @param {Object} props - The prop object for the component, containing slug, title, and image.
 */
export default function ProjectTile({ slug, title, image, description }: ProjectTileProps) {
  return (
    <Link href={`/projects/${slug}`} className="block">
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
          "group relative overflow-hidden rounded-lg",
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
        <div className="relative w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={image}
            alt={title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
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

        {/* Title and Description */}
        <div
          className={cn(
            "p-3 border-t border-gray-200 dark:border-gray-800",
            "bg-linear-to-b from-white to-gray-50",
            "dark:from-gray-900 dark:to-gray-900/80"
          )}
        >
          <h3
            className="text-lg font-bold text-gray-900 dark:text-white
                         group-hover:text-blue-600 dark:group-hover:text-blue-400
                         transition-colors duration-200 text-center"
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-sm text-gray-600 dark:text-gray-400
                          text-center line-clamp-2 leading-relaxed"
            >
              {description}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
