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
}

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
}

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
}

/**
 * @description This type is used to define the params for a dynamic tag route in Next.js.
 */
export type tagPageParams = Promise<{ tag: string }>
