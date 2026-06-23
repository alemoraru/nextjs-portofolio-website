"use client"

import { motion } from "framer-motion"
import React from "react"
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa"

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

/**
 * Timeline component that wraps around timeline items.
 * @param children - The timeline items to be displayed, i.e., job positions, promotions, roles within a company.
 * @constructor
 */
export function Timeline({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      role="list"
      aria-label="Work history timeline"
      className="relative border-l-2 border-gray-300 dark:border-gray-700 ml-2 sm:ml-4 max-w-4xl w-full"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

interface TimelineItemProps {
  title: string
  duration: string
  location: string
  children: React.ReactNode
}

/**
 * TimelineItem component that represents a single item in the timeline, i.e., a single role within a company.
 * @param title the title of the role
 * @param duration the duration of the role, e.g., "Jan 2020 - Present"
 * @param location the location of the role, e.g., "New York, NY"
 * @param children the content of the role, e.g., bulleted list of responsibilities
 * @constructor
 */
export function TimelineItem({ title, duration, location, children }: TimelineItemProps) {
  return (
    <motion.div
      role="listitem"
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mb-6 pl-6 sm:pl-10"
    >
      <motion.div
        className="absolute -left-2.25 top-5 w-4.5 h-4.5 bg-accent-500 dark:bg-accent-400 rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/40 p-4 sm:p-5">
        <h3 className="mt-0 text-lg sm:text-xl font-semibold mb-2 leading-snug">{title}</h3>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1.5">
            <FaCalendarAlt className="w-3.5 h-3.5 shrink-0" />
            <span>{duration}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FaMapMarkerAlt className="w-3.5 h-3.5 shrink-0" />
            <span>{location}</span>
          </span>
        </div>
        <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{children}</div>
      </div>
    </motion.div>
  )
}
