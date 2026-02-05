import { techToIcon } from "@/lib/devIcons"
import { cn } from "@/lib/utils"

interface TechBadgeProps {
  techName: string
  variant?: "default" | "small"
}

/**
 * A reusable badge component for displaying technology stack items with icons.
 * Supports two variants: default and small.
 */
export default function TechBadge({ techName, variant = "default" }: TechBadgeProps) {
  const isSmall = variant === "small"

  return (
    <div
      className={cn(
        "flex items-center bg-gray-200 dark:bg-gray-800 rounded-full",
        isSmall ? "gap-1.5 px-2 py-0.5 text-xs" : "gap-2 px-3 py-1 text-sm"
      )}
    >
      {techToIcon(techName, isSmall ? "size-4" : undefined)}
      <span>{techName}</span>
    </div>
  )
}
