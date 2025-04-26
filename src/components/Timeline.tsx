'use client';

import {motion} from 'framer-motion';
import {FaMapMarkerAlt, FaCalendarAlt} from 'react-icons/fa'; // Icons for location and duration
import React from 'react';

export function Timeline({children}: { children: React.ReactNode }) {
    return (
        <div className="relative border-l-2 border-gray-300 dark:border-gray-700 ml-4">
            {children}
        </div>
    );
}

interface TimelineItemProps {
    title: string;
    duration: string;
    location: string;
    children: React.ReactNode;
}

export function TimelineItem({title, duration, location, children}: TimelineItemProps) {
    return (
        <motion.div
            initial={{opacity: 0, translateY: 50}}
            whileInView={{opacity: 1, translateY: 0}}
            viewport={{once: true, amount: 0.2}}
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
