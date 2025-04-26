'use client'

import Link from 'next/link'
import {motion} from 'framer-motion'

interface BlogPostProps {
    slug: string
    title: string
    summary: string
    date?: string
}

export default function BlogPost({slug, title, summary, date}: BlogPostProps) {
    return (
        <Link href={`/blog/${slug}`}>
            <motion.div
                initial={{opacity: 0, y: 0}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1.0}}
                className="group border rounded-xl p-4 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer bg-white dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-black dark:text-white group-hover:text-blue-500 transition-colors">
                    {title}
                </h3>
                {date && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {new Date(date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                )}
                <p className="text-gray-700 dark:text-gray-300 mt-1 line-clamp-3">
                    {summary}
                </p>
            </motion.div>
        </Link>
    )
}
