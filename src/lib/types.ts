/**
 * @description This type is used to define the params for a dynamic route in Next.js.
 */
export type pageParams = Promise<{ slug: string }>

/**
 * @description This interface defines the structure (i.e., contents) of a blog post card.
 */
export interface BlogPostProps {
  slug: string
  title: string
  summary: string
  date: string
  tags?: string[]
  readingTime?: number
}

export type { BlogPostFrontmatter } from "@/lib/schemas"

/**
 * @description This interface defines the structure (i.e., contents) of a project card.
 */
export interface ProjectProps {
  slug: string
  title: string
  image: string
  description: string
  startDate: string
  endDate: string
  techStack: string[]
  teamSize?: number
  role?: string
  githubUrl?: string
  paperUrl?: string
}

export type { ProjectFrontmatter } from "@/lib/schemas"

/**
 * @description This interface defines the structure (i.e., contents) of a work experience item.
 */
export interface WorkItemProps {
  slug: string
  company: string
  title: string
  start: string
  end: string
  description: string
  locations: string[]
  logoUrl?: string
  companyUrl?: string
  techStack?: string[]
}

export type { WorkItemFrontmatter } from "@/lib/schemas"

/**
 * @description This type is used to define the params for a dynamic tag route in Next.js.
 */
export type tagPageParams = Promise<{ tag: string }>

/**
 * @description Accent color themes available for the portfolio.
 * Set `siteMetadata.theme` in src/data/metadata.ts to one of these values.
 */
export type Theme =
  | "blue"
  | "purple"
  | "green"
  | "orange"
  | "rose"
  | "teal"
  | "indigo"
  | "amber"
  | "cyan"
  | "violet"

/**
 * @description Shape of the site-wide metadata configuration object in src/data/metadata.ts.
 */
export interface SiteMetadata {
  theme: Theme
  title: string
  description: string
  keywords: string[]
  author: {
    name: string
    url: string
  }
  siteUrl: string
  social: {
    twitter: string
  }
  /** Set to null to use the auto-generated dynamic OG image for the home page. */
  ogImage: string | null
}
