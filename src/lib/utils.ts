import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DEFAULT_SIMILAR_POSTS_COUNT, PRESENT } from "@/lib/constants"
import type { BlogPostProps, ProjectProps, WorkItemProps } from "@/lib/types"

/**
 * Combines class names using clsx and merges them with tailwind-merge.
 * @param inputs - Class names to combine.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates initials from a name (e.g., "John Doe" -> "JD").
 * @param name - the full name to abbreviate.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
}

/**
 * Parses a flexible date string into a Date. Accepts "Jan 2020"/"January 2020", "2020-01"/"2020/01",
 * "Present"/"current" (resolved to now), or anything the native Date constructor understands.
 * Returns an invalid Date (NaN time) if none of these apply.
 * @param dateStr - the date string to parse.
 */
function parseFlexibleDate(dateStr: string): Date {
  if (dateStr.toLowerCase().includes("present") || dateStr.toLowerCase().includes("current")) {
    return new Date()
  }

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

/**
 * Formats a start/end date pair as a range, collapsing to a single date when they match.
 * @param start - the start date string.
 * @param end - the end date string.
 * @returns "start – end", or just "start" if start and end are equal.
 * @throws {Error} if start or end is not a recognizable date (see {@link parseFlexibleDate}),
 * or if start is chronologically after end.
 */
export function formatDateRange(start: string, end: string): string {
  const startDate = parseFlexibleDate(start)
  const endDate = parseFlexibleDate(end)

  if (Number.isNaN(startDate.getTime())) {
    throw new Error(`formatDateRange: invalid start date "${start}"`)
  }
  if (Number.isNaN(endDate.getTime())) {
    throw new Error(`formatDateRange: invalid end date "${end}"`)
  }
  if (start !== end && startDate.getTime() > endDate.getTime()) {
    throw new Error(`formatDateRange: start date "${start}" is after end date "${end}"`)
  }

  return start === end ? start : `${start} – ${end}`
}

/**
 * Formats an ISO date string ("YYYY-MM-DD") as a human-readable date, e.g. "April 1, 2025".
 * @param date - the ISO date string to format.
 * @param style - "long" for full month name, "short" for abbreviated month name.
 */
export function formatBlogDate(date: string, style: "long" | "short" = "long"): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: style,
    day: "numeric",
  })
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
  const [endYear, endMonth] = end === PRESENT ? ["", ""] : end.split("-")

  const formatMonth = (month: string) => {
    const date = new Date(2000, parseInt(month) - 1)
    return date.toLocaleDateString("en-US", { month: "short" })
  }

  if (end === PRESENT) {
    return `${formatMonth(startMonth)} ${startYear} – ${PRESENT}`
  }

  if (start === end) {
    return `${formatMonth(startMonth)} ${startYear}`
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
  const startDate = parseFlexibleDate(start)
  const endDate = parseFlexibleDate(end)

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
 * Escapes special XML characters in a string.
 * @param str - The string to escape.
 * @returns The escaped string with special XML characters replaced by their corresponding entities.
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
 * Normalizes a technology name by converting it to lowercase, replacing spaces and special
 * characters with hyphens, and removing any non-alphanumeric characters except hyphens.
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

/**
 * Calculates estimated reading time for a block of text.
 * Assumes an average reading speed of 100 words per minute.
 * @param text - Raw text content (e.g., the full MDX file source).
 * @returns Estimated minutes to read, rounded up to the nearest whole minute.
 */
export function getReadingTime(text: string): number {
  return Math.ceil(text.trim().split(/\s+/).length / 100)
}

/**
 * Computes the Sørensen–Dice coefficient similarity between two strings.
 * Uses bigram overlap: returns 1 for identical strings, 0 for no shared bigrams.
 *
 * @param a - First string to compare.
 * @param b - Second string to compare.
 * @returns A number between 0 and 1 representing the similarity of the two strings.
 */
export function diceCoefficient(a: string, b: string): number {
  if (!a.length || !b.length) return 0
  if (a === b) return 1

  const bigrams = (str: string) => {
    const s = str.toLowerCase()
    const pairs: string[] = []
    for (let i = 0; i < s.length - 1; i++) {
      pairs.push(s.slice(i, i + 2))
    }
    return pairs
  }

  const pairsA = bigrams(a)
  const pairsB = bigrams(b)
  // Single-character strings produce no bigrams; without this guard the ratio below
  // would divide 0/0 and return NaN instead of "no similarity".
  if (pairsA.length === 0 || pairsB.length === 0) return 0

  const setB = new Set(pairsB)
  let matches = 0
  for (const pair of pairsA) {
    if (setB.has(pair)) matches++
  }
  return (2 * matches) / (pairsA.length + pairsB.length)
}

/**
 * Finds blog posts whose tags are most similar to a target tag using Dice coefficient.
 * Useful for suggesting posts when an exact tag match returns no results.
 *
 * @param posts - Array of blog posts to search through.
 * @param targetTag - The tag to compare against post tags.
 * @param maxPosts - Maximum number of similar posts to return (default: {@link DEFAULT_SIMILAR_POSTS_COUNT}).
 * @returns An array of objects containing the post, its best matching tag, and the similarity score.
 */
export function getClosestTagPosts(
  posts: BlogPostProps[],
  targetTag: string,
  maxPosts = DEFAULT_SIMILAR_POSTS_COUNT
): Array<{ post: BlogPostProps; bestScore: number; bestTag: string }> {
  return posts
    .map(post => {
      const tags = post.tags ?? []
      let bestScore = 0
      let bestTag = ""
      for (const tag of tags) {
        const score = diceCoefficient(tag, targetTag)
        if (score > bestScore) {
          bestScore = score
          bestTag = tag
        }
      }
      return { post, bestScore, bestTag }
    })
    .filter(({ bestScore }) => bestScore > 0)
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, maxPosts)
}

/**
 * Filters items to those whose associated value(s) overlap with a selected list.
 * Used to back the per-domain `filter*` helpers below (e.g. blog tags, work companies,
 * project tech stacks) with a single implementation of the same "OR" matching logic.
 * @param items - Array of items to filter.
 * @param selected - Values to filter by. If empty, no filtering is applied.
 * @param getValues - Extracts the value(s) to match against `selected` from an item.
 */
export function filterByValues<T>(
  items: T[],
  selected: string[],
  getValues: (item: T) => string[] | undefined
): T[] {
  if (selected.length === 0) return items
  return items.filter(item => {
    const values = getValues(item)
    return values ? selected.some(s => values.includes(s)) : false
  })
}

/**
 * Filters blog posts based on selected tags. If no tags are selected, returns all posts.
 * A post matches if it has at least one tag that is in the selectedTags array.
 *
 * @param posts - Array of blog posts to filter.
 * @param selectedTags - Array of tags to filter by. If empty, no filtering is applied.
 * @returns An array of blog posts that match the selected tags.
 */
export function filterBlogPosts(posts: BlogPostProps[], selectedTags: string[]): BlogPostProps[] {
  return filterByValues(posts, selectedTags, post => post.tags)
}

/**
 * Sorts blog posts by date in either ascending or descending order. Posts without a date are treated as the oldest.
 * @param posts - Array of blog posts to sort.
 * @param sortOrder - "asc" for oldest to newest, "desc" for newest to oldest.
 * @returns A new array of blog posts sorted by date according to the specified order.
 */
export function sortBlogPosts(posts: BlogPostProps[], sortOrder: "asc" | "desc"): BlogPostProps[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date || "").getTime()
    const dateB = new Date(b.date || "").getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })
}

/**
 * Filters work items based on selected companies. If no companies are selected, returns all work items.
 * A work item matches if its company is in the selectedCompanies array.
 * @param work - Array of work items to filter.
 * @param selectedCompanies - Array of company names to filter by. If empty, no filtering is applied.
 * @returns An array of work items that match the selected companies.
 */
export function filterWorkItems(
  work: WorkItemProps[],
  selectedCompanies: string[]
): WorkItemProps[] {
  return filterByValues(work, selectedCompanies, item => [item.company])
}

/**
 * Filters projects based on selected technology stack. If no technologies are selected, returns all projects.
 * A project matches if it has at least one technology in its techStack that is in the selectedTechStack array.
 * @param projects - Array of projects to filter.
 * @param selectedTechStack - Array of technology names to filter by. If empty, no filtering is applied.
 * @returns An array of projects that match the selected technology stack.
 */
export function filterProjects(
  projects: ProjectProps[],
  selectedTechStack: string[]
): ProjectProps[] {
  return filterByValues(projects, selectedTechStack, project => project.techStack)
}

/**
 * Sorts items by end date (newest first, with `PRESENT` treated as newest) or start date
 * (oldest first). Ties among simultaneous `PRESENT` items, or among items sharing an end
 * date, are broken alphabetically via `getLabel`. Backs `sortWorkItems`/`sortProjects` with
 * a single implementation of the same "Present-aware" sort algorithm.
 * @param items - Array of items to sort.
 * @param sortOrder - "newest" to sort by end date descending, "oldest" to sort by start date ascending.
 * @param getStart - Extracts an item's start date string.
 * @param getEnd - Extracts an item's end date string (or `PRESENT`).
 * @param getLabel - Extracts the string used to break ties (e.g. company/title).
 */
export function sortByPresentAwareDate<T>(
  items: T[],
  sortOrder: "newest" | "oldest",
  getStart: (item: T) => string,
  getEnd: (item: T) => string,
  getLabel: (item: T) => string
): T[] {
  return [...items].sort((a, b) => {
    if (sortOrder === "newest") {
      const aIsPresent = getEnd(a) === PRESENT
      const bIsPresent = getEnd(b) === PRESENT
      if (aIsPresent && !bIsPresent) return -1
      if (!aIsPresent && bIsPresent) return 1
      if (aIsPresent && bIsPresent) return getLabel(a).localeCompare(getLabel(b))
      const endDiff = new Date(getEnd(b) || "").getTime() - new Date(getEnd(a) || "").getTime()
      if (endDiff !== 0) return endDiff
      return getLabel(a).localeCompare(getLabel(b))
    }
    return new Date(getStart(a) || "").getTime() - new Date(getStart(b) || "").getTime()
  })
}

/**
 * Sorts work items by end date (newest first) or start date (oldest first). Work items with `PRESENT` as end date are treated as the newest.
 * @param work - Array of work items to sort.
 * @param sortOrder - "newest" to sort by end date descending, "oldest" to sort by start date ascending.
 * @returns A new array of work items sorted according to the specified order.
 */
export function sortWorkItems(
  work: WorkItemProps[],
  sortOrder: "newest" | "oldest"
): WorkItemProps[] {
  return sortByPresentAwareDate(
    work,
    sortOrder,
    item => item.start,
    item => item.end,
    item => item.company
  )
}

/**
 * Sorts projects by end date (newest first) or start date (oldest first). Projects with `PRESENT` as end date are treated as the newest.
 * @param projects - Array of projects to sort.
 * @param sortOrder - "newest" to sort by end date descending, "oldest" to sort by start date ascending.
 * @returns A new array of projects sorted according to the specified order.
 */
export function sortProjects(
  projects: ProjectProps[],
  sortOrder: "newest" | "oldest"
): ProjectProps[] {
  return sortByPresentAwareDate(
    projects,
    sortOrder,
    item => item.startDate,
    item => item.endDate,
    item => item.title
  )
}

/**
 * Paginates an array of items based on the current page and page size.
 * Returns the items for the current page and the total number of pages.
 * @param items - The array of items to paginate.
 * @param page - The current page number (1-based index).
 * @param pageSize - The number of items to display per page.
 * @returns An object containing the paginated items and the total number of pages.
 */
export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number
): { items: T[]; totalPages: number } {
  const totalPages = Math.ceil(items.length / pageSize)
  // Symmetric with an out-of-range high page (which naturally slices to []): a page below
  // 1 has no items either, rather than silently wrapping into a negative slice from the end.
  if (page < 1) {
    return { items: [], totalPages }
  }
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), totalPages }
}
