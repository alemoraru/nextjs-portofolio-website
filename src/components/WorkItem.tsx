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

export default function WorkItem({slug, company, title, start, end, description, locations}: WorkItemProps) {
    return (
        <Link href={`/work/${slug}`}>
            <motion.div
                initial={{opacity: 0, y: 0}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1.0}}
                className="border rounded-xl p-4 shadow-sm hover:border-blue-500 transition cursor-pointer hover:text-blue-500 bg-white dark:bg-gray-900">
                <h3 className="text-xl font-semibold">{title} @ {company}</h3>

                {/* Duration and Locations */}
                <div className="mt-2 text-gray-500 flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-1"/>
                    <span>{start} – {end}</span>
                    {locations && locations.length > 0 && (
                        <>
                            <span className="mx-2">|</span>
                            <FaMapMarkerAlt className="w-4 h-4 mr-1"/>
                            <span>{locations.join(', ')}</span>
                        </>
                    )}
                </div>

                <p className="mt-2 text-gray-700">{description}</p>
            </motion.div>
        </Link>
    )
}
