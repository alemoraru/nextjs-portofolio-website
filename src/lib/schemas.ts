import { z } from "zod"

export const BlogFrontmatterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  tags: z.array(z.string()).optional(),
})

export const WorkItemFrontmatterSchema = z.object({
  company: z.string(),
  title: z.string(),
  start: z.string(),
  end: z.string(),
  description: z.string(),
  locations: z.array(z.string()),
  logoUrl: z.string().optional(),
  companyUrl: z.string().optional(),
  techStack: z.array(z.string()).optional(),
})

export const ProjectFrontmatterSchema = z.object({
  title: z.string(),
  image: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  techStack: z.array(z.string()),
  teamSize: z.number().optional(),
  role: z.string().optional(),
  githubUrl: z.string().optional(),
  paperUrl: z.string().optional(),
})

export type BlogPostFrontmatter = z.infer<typeof BlogFrontmatterSchema>
export type WorkItemFrontmatter = z.infer<typeof WorkItemFrontmatterSchema>
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>
