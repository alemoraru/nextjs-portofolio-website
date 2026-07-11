"use client"

import { motion } from "framer-motion"
import React from "react"

interface AnimatedCardProps {
  className?: string
  children: React.ReactNode
}

/**
 * Shared entrance/hover/tap animation wrapper used by the blog/work/project card components.
 * @param className - Additional CSS classes to apply to the card element.
 * @param children - The content to be rendered inside the animated card.
 */
export default function AnimatedCard({ className, children }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ opacity: { duration: 0.8 } }}
      whileHover={{
        scale: 1.05,
        transition: {
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
          duration: 0.6,
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "tween", ease: "easeOut", duration: 0.15 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
