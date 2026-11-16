"use client"

import Image from "next/image"
import Link from "next/link"
import { FaCalendarAlt } from "react-icons/fa"
import AnimatedCard from "@/components/AnimatedCard"
import TechBadge from "@/components/TechBadge"
import { MAX_PROJECT_TILE_TECH_BADGES, PRESENT } from "@/lib/constants"
import { calculateDuration, cn, formatDateRange, formatDuration } from "@/lib/utils"

interface ProjectTileProps {
  /** The project's URL slug; the tile links to `/projects/{slug}`. */
  slug: string
  /** The project name, shown as the tile's heading. */
  title: string
  /** Path or URL of the cover image shown at the top of the tile. */
  image: string
  /** Short summary shown under the title, clamped to two lines. */
  description?: string
  /** Technologies shown as badges, capped at `MAX_PROJECT_TILE_TECH_BADGES` plus a "+ N more" badge. */
  techStack?: string[]
  /** Project start date; the date range and duration only show when both dates are set. */
  startDate?: string
  /** Project end date, or `PRESENT` for ongoing projects. */
  endDate?: string
  /** Loads the cover image eagerly with high priority; set it for the first, above-the-fold tile. */
  priority?: boolean
  /** The title's heading level: 2 directly under the page `<h1>`, 3 (default) under a section `<h2>`. */
  headingLevel?: 2 | 3
}

/**
 * Formats a project's dates in a friendly way, e.g., "Jan – Jun 2023". Only "YYYY-MM" dates can
 * be reformatted, so any other format is displayed as a plain range instead.
 * @param start - the start date string.
 * @param end - the end date string or "Present".
 */
function formatProjectDates(start: string, end: string) {
  const isYearMonth = (date: string) => /^\d{4}-\d{2}$/.test(date)

  return isYearMonth(start) && (isYearMonth(end) || end === PRESENT)
    ? formatDuration(start, end)
    : formatDateRange(start, end)
}

/**
 * A functional component that renders a project tile with a link, image, title, dates, duration, and tech stack.
 *
 * @param {Object} props - The props for the component.
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
  headingLevel = 3,
}: ProjectTileProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  // The card is one big link: name it after the title alone, not every piece of text inside it
  const titleId = `project-card-title-${slug}`
  return (
    <Link
      href={`/projects/${slug}`}
      aria-labelledby={titleId}
      className={cn(
        "block h-full rounded-xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
        "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
      )}
    >
      <AnimatedCard
        className={cn(
          "group relative overflow-hidden rounded-xl h-full flex flex-col",
          "border border-gray-300 dark:border-gray-700",
          "bg-white dark:bg-gray-900",
          "shadow-sm hover:shadow-2xl hover:shadow-accent-500/20",
          "hover:border-accent-500 dark:hover:border-accent-500",
          "transition-[border-color,box-shadow] duration-200"
        )}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <Image
            src={image}
            // Decorative: the title is right below, so naming the image would only repeat it
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover"
          />
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
            <Heading
              id={titleId}
              className={cn(
                "text-lg font-bold text-gray-900 dark:text-white",
                "group-hover:text-accent-600 dark:group-hover:text-accent-400",
                "transition-colors duration-200 text-center"
              )}
            >
              {title}
            </Heading>
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
              <span>{formatProjectDates(startDate, endDate)}</span>
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
