'use client'

import {motion} from 'framer-motion'
import Link from "next/link";
import {FaCalendarAlt, FaMapMarkerAlt} from "react-icons/fa";
import React from "react";

interface WorkItemProps {
    slug: string
    company: string
    title: string
    start: string
    end: string
    description: string
    locations?: string[]
}

/**
 * A functional component that renders a work item with a link, title, company, start and end dates, description, and locations.
 */
export default function WorkItem({slug, company, title, start, end, description, locations}: WorkItemProps) {
    return (
        <Link href={`/work/${slug}`} className="block group">
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
                className="border rounded-xl p-4 shadow-sm hover:border-blue-500 transition bg-gray-100
                dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
            >
                <h3 className="text-xl font-semibold group-hover:text-blue-500 transition">{title} @ {company}</h3>

                {/* Duration and Locations */}
                <div className="mt-2 text-gray-500 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center">
                        <FaCalendarAlt className="w-4 h-4 mr-1"/>
                        <span>{start} – {end}</span>
                    </div>
                    {locations && locations.length > 0 && (
                        <div className="flex items-center mt-1 sm:mt-0 sm:ml-2">
                            <span className="hidden sm:inline mx-2">|</span>
                            <FaMapMarkerAlt className="w-4 h-4 mr-1"/>
                            <span>{locations.join(', ')}</span>
                        </div>
                    )}
                </div>

                <p className="mt-2 text-gray-700">{description}</p>
            </motion.div>
        </Link>
    )
}
