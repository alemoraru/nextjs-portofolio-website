import { cn } from "@/lib/utils"

interface HoverArrowProps {
  direction?: "left" | "right"
  className?: string
}

/**
 * Shared arrow glyph that nudges in the given direction when its nearest `group`
 * ancestor is hovered, used by link/button affordances like "View all",
 * "Back to...", and card hover overlays.
 * @param direction - The direction the arrow points and moves toward on hover. Defaults to "right".
 * @param className - Additional CSS classes to apply to the arrow element.
 */
export default function HoverArrow({ direction = "right", className }: HoverArrowProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block transition-transform duration-200 ease-out motion-reduce:transition-none",
        direction === "right" ? "group-hover:translate-x-1" : "group-hover:-translate-x-1",
        className
      )}
    >
      {direction === "right" ? "→" : "←"}
    </span>
  )
}
