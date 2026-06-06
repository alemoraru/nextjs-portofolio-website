import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import { z } from "zod"
import {
  BlogFrontmatterSchema,
  ProjectFrontmatterSchema,
  WorkItemFrontmatterSchema,
} from "@/lib/schemas"
import { BlogPostProps, ProjectProps, WorkItemProps } from "@/lib/types"
import { getReadingTime } from "@/lib/utils"

/**
 * Reads every .mdx file in a directory, parses frontmatter with a Zod schema,
 * maps it to the desired props shape, and optionally sorts the results.
 * @param dirPath  - Absolute path to the directory containing .mdx files.
 * @param schema   - Zod schema used to parse and validate frontmatter.
 * @param map      - Transforms (slug, frontmatter) into the final props object.
 * @param sort     - Optional comparator for the final array.
 */
async function loadMDXDirectory<TFrontmatter, TProps>(
  dirPath: string,
  schema: z.ZodSchema<TFrontmatter>,
  map: (slug: string, frontmatter: TFrontmatter, fileContent: string) => TProps,
  sort?: (a: TProps, b: TProps) => number
): Promise<TProps[]> {
  const files = fs.readdirSync(dirPath)
  const mdxFiles = files.filter(file => file.endsWith(".mdx"))

  const items = await Promise.all(
    mdxFiles.map(async file => {
      const filePath = path.join(dirPath, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const slug = path.basename(file, ".mdx")

      try {
        const { frontmatter: raw } = await compileMDX<TFrontmatter>({
          source: fileContent,
          options: { parseFrontmatter: true },
        })

        const frontmatter = schema.parse(raw)
        return map(slug, frontmatter, fileContent)
      } catch (error) {
        if (error instanceof z.ZodError) {
          const issues = error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ")
          throw new Error(`Invalid frontmatter in ${file}: ${issues}`)
        }
        throw new Error(
          `Failed to parse ${file}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    })
  )

  return sort ? items.sort(sort) : items
}

let cachedPosts: BlogPostProps[] | null = null

/**
 * Scans the blog directory, parses all MDX files, and returns blog posts
 * sorted by date descending. Results are cached for the process lifetime.
 */
export async function getAllBlogPosts(): Promise<BlogPostProps[]> {
  if (cachedPosts) return cachedPosts

  const blogDir = path.join(process.cwd(), "src", "data", "blog")

  cachedPosts = await loadMDXDirectory(
    blogDir,
    BlogFrontmatterSchema,
    (slug, fm, fileContent) => ({
      slug,
      title: fm.title,
      summary: fm.summary,
      date: fm.date,
      tags: fm.tags?.map((tag: string) => tag.toLowerCase()),
      readingTime: getReadingTime(fileContent),
    }),
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return cachedPosts
}

let cachedWorkItems: WorkItemProps[] | null = null

/**
 * Scans the work directory, parses all MDX files, and returns work items
 * sorted by end date descending. Results are cached for the process lifetime.
 */
export async function getAllWorkItems(): Promise<WorkItemProps[]> {
  if (cachedWorkItems) return cachedWorkItems

  const workDir = path.join(process.cwd(), "src", "data", "work")

  cachedWorkItems = await loadMDXDirectory(
    workDir,
    WorkItemFrontmatterSchema,
    (slug, fm) => ({
      slug,
      company: fm.company,
      title: fm.title,
      start: fm.start,
      end: fm.end,
      description: fm.description,
      locations: fm.locations,
      logoUrl: fm.logoUrl,
      companyUrl: fm.companyUrl,
      techStack: fm.techStack,
    }),
    // Sort by start date descending so the most recent role is first
    (a, b) => {
      const endA = a.end === "Present" ? new Date() : new Date(a.end)
      const endB = b.end === "Present" ? new Date() : new Date(b.end)
      return endB.getTime() - endA.getTime()
    }
  )

  return cachedWorkItems
}

let cachedProjects: ProjectProps[] | null = null

/**
 * Scans the projects directory, parses all MDX files, and returns projects.
 * Results are cached for the process lifetime.
 */
export async function getAllProjects(): Promise<ProjectProps[]> {
  if (cachedProjects) return cachedProjects

  const projectsDir = path.join(process.cwd(), "src", "data", "projects")

  cachedProjects = await loadMDXDirectory(projectsDir, ProjectFrontmatterSchema, (slug, fm) => ({
    slug,
    title: fm.title,
    image: fm.image,
    description: fm.description,
    startDate: fm.startDate,
    endDate: fm.endDate,
    techStack: fm.techStack,
    teamSize: fm.teamSize,
    role: fm.role,
    githubUrl: fm.githubUrl,
    paperUrl: fm.paperUrl,
  }))

  return cachedProjects
}
