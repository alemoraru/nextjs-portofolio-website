"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FaRegCalendarAlt } from "react-icons/fa"
import BlogTag from "@/components/BlogTag"
import { BlogPostProps } from "@/lib/types"

/**
 * A functional component that renders a blog post card with a link, title, summary, date, and tags.
 */
export default function BlogPost({ slug, title, summary, date, tags }: BlogPostProps) {
  return (
    <Link href={`/blog/${slug}`} className="block">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 0.8 } }}
        whileHover={{
          scale: 1.05,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: 0.4,
          },
        }}
        whileTap={{ scale: 0.98 }}
        className="group relative border border-gray-300 dark:border-gray-700
                   rounded-lg p-5 shadow-sm
                   hover:border-blue-500 dark:hover:border-blue-500
                   hover:shadow-xl hover:shadow-blue-500/10
                   transition-all duration-200 cursor-pointer
                   bg-gray-50 dark:bg-gray-900
                   hover:bg-white dark:hover:bg-gray-800
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-blue-500 focus-visible:ring-offset-2
                   dark:focus-visible:ring-offset-black"
      >
        {/* Title */}
        <h3
          className="text-lg font-bold text-gray-900 dark:text-white
                       group-hover:text-blue-600 dark:group-hover:text-blue-400
                       transition-colors duration-200"
        >
          {title}
        </h3>

        {/* Date */}
        {date && (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <FaRegCalendarAlt className="w-3.5 h-3.5" />
            <time dateTime={date}>
              {new Date(date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
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
        <p className="text-gray-700 dark:text-gray-300 mt-3 line-clamp-2 leading-relaxed">
          {summary}
        </p>

        {/* Read More Hint */}
        <div
          className="flex items-center gap-1 mt-4 text-sm font-semibold
                        text-blue-600 dark:text-blue-400
                        group-hover:gap-2 transition-all duration-200"
        >
          <span>Read article</span>
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            →
          </motion.span>
        </div>
      </motion.div>
    </Link>
  )
}
