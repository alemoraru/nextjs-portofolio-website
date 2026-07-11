"use client"

import { motion } from "framer-motion"

interface HoverArrowProps {
  direction?: "left" | "right"
  offset?: number
  className?: string
}

/**
 * Shared arrow glyph that nudges in the given direction on hover, used by link/button
 * affordances like "View all", "Back to...", and card hover overlays.
 * @param direction - The direction in which the arrow should point and move on hover. Defaults to "right".
 * @param offset - The distance (in pixels) the arrow should move on hover. Defaults to 4.
 * @param className - Additional CSS classes to apply to the arrow element.
 */
export default function HoverArrow({
  direction = "right",
  offset = 4,
  className,
}: HoverArrowProps) {
  return (
    <motion.span
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      whileHover={{ x: direction === "right" ? offset : -offset }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={className}
    >
      {direction === "right" ? "→" : "←"}
    </motion.span>
  )
}
