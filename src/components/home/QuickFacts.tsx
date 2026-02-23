"use client"

import { motion } from "framer-motion"
import { factIconMap, homeIntroConfig } from "@/data/content"
import { cn } from "@/lib/utils"
import { fadeUpVariants } from "./animations"

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
      className="mt-12 text-center"
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

      <div className="flex flex-wrap justify-center gap-3 px-4 max-w-4xl mx-auto">
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
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "border border-gray-300 dark:border-gray-700",
                "bg-gray-50 dark:bg-gray-800",
                "text-sm font-medium text-gray-700 dark:text-gray-300",
                "shadow-sm hover:shadow-md",
                "hover:border-accent-400 dark:hover:border-accent-600",
                "transition-all duration-200 cursor-default"
              )}
            >
              <Icon className="text-accent-600 dark:text-accent-400 text-base shrink-0" />
              <span>{fact.label}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
