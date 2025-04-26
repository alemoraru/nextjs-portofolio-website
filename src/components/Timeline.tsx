'use client';

import {motion} from 'framer-motion';
import {FaMapMarkerAlt, FaCalendarAlt} from 'react-icons/fa';
import React from 'react';

const container = {
    hidden: {opacity: 1},
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        },
    },
};

/**
 * Timeline component that wraps around timeline items.
 * @param children - The timeline items to be displayed, i.e., job positions, promotions, roles within a company.
 * @constructor
 */
export function Timeline({children}: { children: React.ReactNode }) {
    return (
        <motion.div
            className="relative border-l-2 border-gray-300 dark:border-gray-700 ml-4 mx-w-4xl w-full"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{once: true, amount: 0.2}}
        >
            {children}
        </motion.div>
    );
}

interface TimelineItemProps {
    title: string;
    duration: string;
    location: string;
    children: React.ReactNode;
}

/**
 * TimelineItem component that represents a single item in the timeline, i.e., a single role within a company.
 * @param title the title of the role
 * @param duration the duration of the role, e.g., "Jan 2020 - Present"
 * @param location the location of the role, e.g., "New York, NY"
 * @param children the content of the role, e.g., bulleted list of responsibilities
 * @constructor
 */
export function TimelineItem({title, duration, location, children}: TimelineItemProps) {
    return (
        <motion.div
            variants={{
                hidden: {opacity: 0, y: 50},
                show: {opacity: 1, y: 0},
            }}
            transition={{duration: 0.5, ease: 'easeOut'}}
            className="relative mb-12 pl-8"
        >
            {/* Animated Dot */}
            <motion.div
                className="absolute left-[-10px] top-2 w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full border-2 border-white dark:border-gray-900"
                initial={{scale: 0}}
                animate={{scale: 1}}
                transition={{type: 'spring', stiffness: 300, damping: 20}}
            />

            {/* Content */}
            <div>
                <h3 className="text-2xl font-semibold mb-1">{title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                    <FaCalendarAlt className="w-4 h-4"/>
                        {duration}
                    </span>
                    <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-4 h-4"/>
                        {location}
                    </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
