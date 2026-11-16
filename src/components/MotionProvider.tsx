"use client"

import { MotionConfig } from "framer-motion"
import { ReactNode } from "react"

/**
 * Site-wide framer-motion settings. `reducedMotion="user"` follows the visitor's
 * "reduce motion" OS/browser setting: when it is on, every motion component drops its
 * transform and layout animations (slides, scales, rotations, the header flip) while
 * keeping opacity and color fades, which don't trigger motion sickness.
 *
 * This should be applied within the root layout, so it also reaches "portalled" UI such as the
 * table of contents, back-to-top button and image lightbox.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
