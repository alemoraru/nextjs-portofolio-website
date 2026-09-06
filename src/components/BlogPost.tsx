import Link from "next/link"
import { FaBookOpen, FaRegCalendarAlt } from "react-icons/fa"
import AnimatedCard from "@/components/AnimatedCard"
import BlogTag from "@/components/BlogTag"
import HoverArrow from "@/components/HoverArrow"
import { BlogPostProps } from "@/lib/types"
import { cn, formatBlogDate } from "@/lib/utils"

/**
 * A functional component that renders a blog post card with a link, title, summary, date, and tags.
 */
export default function BlogPost({ slug, title, summary, date, tags, readingTime }: BlogPostProps) {
  return (
    <Link href={`/blog/${slug}`} className="block h-full">
      <AnimatedCard
        className={cn(
          "group relative h-full flex flex-col",
          "border border-gray-300 dark:border-gray-700 rounded-lg p-5 shadow-sm",
          "hover:border-accent-500 dark:hover:border-accent-500",
          "hover:shadow-xl hover:shadow-accent-500/10",
          "transition-[border-color,box-shadow,background-color] duration-200 cursor-pointer",
          "bg-gray-50 dark:bg-gray-900",
          "hover:bg-white dark:hover:bg-gray-800",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
          "dark:focus-visible:ring-offset-black"
        )}
      >
        {/* Title */}
        <h3
          className={cn(
            "text-lg font-bold text-gray-900 dark:text-white",
            "group-hover:text-accent-600 dark:group-hover:text-accent-400",
            "transition-colors duration-200"
          )}
        >
          {title}
        </h3>

        {/* Date and Reading Time */}
        {date && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <FaRegCalendarAlt className="w-3.5 h-3.5 shrink-0" />
              <time dateTime={date}>{formatBlogDate(date, "short")}</time>
            </span>
            {readingTime && (
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span aria-hidden="true">·</span>
                <FaBookOpen className="w-3.5 h-3.5 shrink-0" />
                {readingTime} min read
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(tag => (
              <BlogTag key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Summary */}
        <p className="text-gray-700 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed grow">
          {summary}
        </p>

        {/* Read More Hint */}
        <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all duration-200">
          <span>Read article</span>
          <HoverArrow />
        </div>
      </AnimatedCard>
    </Link>
  )
}
