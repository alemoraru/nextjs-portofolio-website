import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges them with tailwind-merge.
 * @param inputs - Class names to combine.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a duration given start and end dates.
 * Can be used for work experience or project durations.
 * @param start - the start date in "YYYY-MM" format
 * @param end - the end date in "YYYY-MM" format or "Present"
 * @returns formatted duration string
 */
export function formatDuration(start: string, end: string): string {
  const [startYear, startMonth] = start.split("-")
  const [endYear, endMonth] = end === "Present" ? ["", ""] : end.split("-")

  const formatMonth = (month: string) => {
    const date = new Date(2000, parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short" })
  }

  if (end === "Present") {
    return `${formatMonth(startMonth)} ${startYear} – Present`
  }

  if (startYear === endYear) {
    return `${formatMonth(startMonth)} – ${formatMonth(endMonth)} ${startYear}`
  }

  return `${formatMonth(startMonth)} ${startYear} – ${formatMonth(endMonth)} ${endYear}`
}
