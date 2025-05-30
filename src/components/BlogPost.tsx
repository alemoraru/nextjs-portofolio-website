'use client'

import Link from 'next/link'
import {motion} from 'framer-motion'
import {FaRegCalendarAlt} from 'react-icons/fa';
import {BlogPostProps} from "@/lib/types";
import BlogTag from "@/components/BlogTag";

/**
 * A functional component that renders a blog post card with a link, title, summary, date, and tags.
 */
export default function BlogPost({slug, title, summary, date, tags}: BlogPostProps) {
    return (
        <Link href={`/blog/${slug}`}>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{opacity: {duration: 0.8}}}
                whileHover={{
                    scale: 1.05,
                    transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                        duration: 0.4
                    }
                }}
                className="group border rounded-xl p-4 shadow-sm hover:border-blue-500 hover:shadow-md transition-all
                duration-300 cursor-pointer bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
                {/* Title */}
                <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-blue-500 transition-colors">
                    {title}
                </h3>

                {/* Date */}
                {date && (
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <FaRegCalendarAlt className="w-3 h-3 mr-2"/>
                        {new Date(date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                )}

                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 mt-2">
                        {tags.map(tag => (
                            <BlogTag key={tag} tag={tag}/>
                        ))}
                    </div>
                )}

                {/* Summary */}
                <p className="text-gray-700 dark:text-gray-300 mt-1 line-clamp-3">
                    {summary}
                </p>

                {/* Read More Hint */}
                <p className="mt-2 text-sm font-medium text-gray-500">
                    Read more →
                </p>
            </motion.div>
        </Link>
    )
}
