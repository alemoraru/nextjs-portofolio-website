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

/**
 * Calculate duration between two dates and format it LinkedIn-style
 * @param start - Start date string (e.g., "Jan 2020", "January 2020", "2020-01")
 * @param end - End date string or "Present"
 * @returns Formatted duration (e.g., "2 yrs 3 mos", "6 mos", "1 yr")
 */
export function calculateDuration(start: string, end: string): string {
  const parseDate = (dateStr: string): Date => {
    // Handle "Present" or similar
    if (dateStr.toLowerCase().includes("present") || dateStr.toLowerCase().includes("current")) {
      return new Date()
    }

    // Try parsing common formats
    // Format: "Jan 2020", "January 2020"
    const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/)
    if (monthYearMatch) {
      return new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`)
    }

    // Format: "2020-01", "2020/01"
    const dashMatch = dateStr.match(/^(\d{4})[-/](\d{2})$/)
    if (dashMatch) {
      return new Date(parseInt(dashMatch[1]), parseInt(dashMatch[2]) - 1, 1)
    }

    // Fallback to Date constructor
    return new Date(dateStr)
  }

  const startDate = parseDate(start)
  const endDate = parseDate(end)

  // Calculate difference in months
  const yearDiff = endDate.getFullYear() - startDate.getFullYear()
  const monthDiff = endDate.getMonth() - startDate.getMonth()
  const totalMonths = yearDiff * 12 + monthDiff

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0 && months === 0) {
    return "1 mo"
  } else if (years === 0) {
    return `${months} mo${months > 1 ? "s" : ""}`
  } else if (months === 0) {
    return `${years} yr${years > 1 ? "s" : ""}`
  } else {
    return `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`
  }
}

/**
 * Normalizes a technology name into a standardized format.
 * @param techName - The technology name to normalize.
 * @returns The normalized technology name.
 */
/**
 * Escapes special XML characters in a string.
 * @param str - The string to escape.
 * @return The escaped string with special XML characters replaced by their corresponding entities.
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Normalizes a technology name by converting it to lowercase, replacing spaces and special characters with hyphens,
 * and removing any non-alphanumeric characters except hyphens.
 * @param techName - The technology name to normalize.
 * @returns The normalized technology name.
 */
export function normalizeTechName(techName: string): string {
  return techName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[._]/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
