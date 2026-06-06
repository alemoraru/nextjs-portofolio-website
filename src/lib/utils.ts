import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BlogPostProps, ProjectProps, WorkItemProps } from "@/lib/types"

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
 * @param maxPosts - Maximum number of similar posts to return (default: 3).
 * @returns An array of objects containing the post, its best matching tag, and the similarity score.
 */
export function getClosestTagPosts(
  posts: BlogPostProps[],
  targetTag: string,
  maxPosts = 3
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
 * Filters blog posts based on selected tags. If no tags are selected, returns all posts.
 * A post matches if it has at least one tag that is in the selectedTags array.
 *
 * @param posts - Array of blog posts to filter.
 * @param selectedTags - Array of tags to filter by. If empty, no filtering is applied.
 * @returns An array of blog posts that match the selected tags.
 */
export function filterBlogPosts(posts: BlogPostProps[], selectedTags: string[]): BlogPostProps[] {
  if (selectedTags.length === 0) return posts
  return posts.filter(post => post.tags && selectedTags.some(tag => post.tags!.includes(tag)))
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
  if (selectedCompanies.length === 0) return work
  return work.filter(item => selectedCompanies.some(c => item.company === c))
}

/**
 * Sorts work items by end date (newest first) or start date (oldest first). Work items with "Present" as end date are treated as the newest.
 * @param work - Array of work items to sort.
 * @param sortOrder - "newest" to sort by end date descending, "oldest" to sort by start date ascending.
 * @returns A new array of work items sorted according to the specified order.
 */
export function sortWorkItems(
  work: WorkItemProps[],
  sortOrder: "newest" | "oldest"
): WorkItemProps[] {
  return [...work].sort((a, b) => {
    if (sortOrder === "newest") {
      const aIsPresent = a.end === "Present"
      const bIsPresent = b.end === "Present"
      if (aIsPresent && !bIsPresent) return -1
      if (!aIsPresent && bIsPresent) return 1
      if (aIsPresent && bIsPresent) return a.company.localeCompare(b.company)
      const endDiff = new Date(b.end || "").getTime() - new Date(a.end || "").getTime()
      if (endDiff !== 0) return endDiff
      return a.company.localeCompare(b.company)
    }
    return new Date(a.start || "").getTime() - new Date(b.start || "").getTime()
  })
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
  if (selectedTechStack.length === 0) return projects
  return projects.filter(
    project => project.techStack && selectedTechStack.some(tech => project.techStack.includes(tech))
  )
}

/**
 * Sorts projects by end date (newest first) or start date (oldest first). Projects with "Present" as end date are treated as the newest.
 * @param projects - Array of projects to sort.
 * @param sortOrder - "newest" to sort by end date descending, "oldest" to sort by start date ascending.
 * @returns A new array of projects sorted according to the specified order.
 */
export function sortProjects(
  projects: ProjectProps[],
  sortOrder: "newest" | "oldest"
): ProjectProps[] {
  return [...projects].sort((a, b) => {
    if (sortOrder === "newest") {
      const aIsPresent = a.endDate === "Present"
      const bIsPresent = b.endDate === "Present"
      if (aIsPresent && !bIsPresent) return -1
      if (!aIsPresent && bIsPresent) return 1
      if (aIsPresent && bIsPresent) return a.title.localeCompare(b.title)
      const endDiff = new Date(b.endDate || "").getTime() - new Date(a.endDate || "").getTime()
      if (endDiff !== 0) return endDiff
      return a.title.localeCompare(b.title)
    }
    return new Date(a.startDate || "").getTime() - new Date(b.startDate || "").getTime()
  })
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
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), totalPages }
}
