'use client'

import {motion} from 'framer-motion'

interface WorkItemProps {
    company: string
    title: string
    start: string
    end: string
    description: string
}

export default function WorkItem({company, title, start, end, description}: WorkItemProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 0}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1.0}}
            className="border rounded-xl p-4 shadow-sm hover:border-blue-500 transition cursor-pointer hover:text-blue-500 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-semibold">{title} @ {company}</h3>
            <p className="text-sm text-gray-500">{start} – {end}</p>
            <p className="mt-2 text-gray-700">{description}</p>
        </motion.div>
    )
}
