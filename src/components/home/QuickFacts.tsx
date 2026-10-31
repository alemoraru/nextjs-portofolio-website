"use client"

import { motion } from "framer-motion"
import { fadeUpVariants } from "@/components/home/animations"
import { factIconMap, homeIntroConfig } from "@/data/content"
import { cn } from "@/lib/utils"

/**
 * Simple component which renders quick facts about the user, based on the homeIntroConfig data.
 * Facts are pills on larger screens and a grid of equal tiles on phones, where the last tile
 * spans both columns if the number of facts is odd.
 */
export default function QuickFacts() {
  const allFacts = [
    ...Object.entries(homeIntroConfig.facts)
      .filter(([, value]) => value && value.trim() !== "")
      .map(([category, value]) => {
        const categoryKey = category as keyof typeof factIconMap
        return { icon: factIconMap[categoryKey], label: value }
      }),
    ...homeIntroConfig.additionalFacts,
  ]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeUpVariants}
      viewport={{ once: true, margin: "-50px" }}
      className="mt-12 text-left sm:text-center"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
      >
        Quick &amp; Fun Facts
      </motion.h2>

      <div
        className={cn(
          "grid grid-cols-2 auto-rows-fr gap-2 max-w-4xl mx-auto",
          "sm:flex sm:flex-wrap sm:justify-center sm:gap-3 sm:px-4"
        )}
      >
        {allFacts.map((fact, i) => {
          const Icon = fact.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } }}
              className={cn(
                "flex items-center gap-2.5 min-h-13 px-3 py-2 rounded-xl last:odd:col-span-2",
                "sm:gap-2 sm:min-h-0 sm:px-4 sm:py-2 sm:rounded-full",
                "border border-gray-300 dark:border-gray-700",
                "sm:bg-gray-50 sm:dark:bg-gray-800",
                "text-[13px] leading-tight sm:text-sm sm:leading-5",
                "font-medium text-gray-700 dark:text-gray-300",
                "sm:shadow-sm sm:hover:shadow-md",
                "hover:border-accent-400 dark:hover:border-accent-600",
                "transition-all duration-200 cursor-default"
              )}
            >
              <Icon className="text-accent-600 dark:text-accent-400 text-sm sm:text-base shrink-0" />
              <span>{fact.label}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
