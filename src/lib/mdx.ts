import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import {
  BlogPostFrontmatter,
  BlogPostProps,
  ProjectFrontmatter,
  ProjectProps,
  WorkItemFrontmatter,
  WorkItemProps,
} from "@/lib/types"

/**
 * Reads every .mdx file in a directory, parses frontmatter, validates it,
 * maps it to the desired props shape, and optionally sorts the results.
 * @param dirPath   - Absolute path to the directory containing .mdx files.
 * @param validate  - Assertion function that throws if frontmatter is invalid.
 * @param map       - Transforms (slug, frontmatter) into the final props object.
 * @param sort      - Optional comparator for the final array.
 */
async function loadMDXDirectory<TFrontmatter, TProps>(
  dirPath: string,
  validate: (frontmatter: unknown, filename: string) => asserts frontmatter is TFrontmatter,
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
        const { frontmatter } = await compileMDX<TFrontmatter>({
          source: fileContent,
          options: { parseFrontmatter: true },
        })

        validate(frontmatter, file)
        return map(slug, frontmatter, fileContent)
      } catch (error) {
        throw new Error(
          `Failed to parse ${file}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    })
  )

  return sort ? items.sort(sort) : items
}

/**
 * Blog post frontmatter validation and loading. Ensures required fields are present and correctly typed
 * @param frontmatter - The frontmatter object extracted from an MDX file
 * @param filename - The name of the MDX file (used for error messages)
 * @throws Will throw an error if validation fails, indicating the specific issue and file
 * @asserts frontmatter is BlogPostFrontmatter - Narrows the type of frontmatter for downstream usage
 */
function validateBlogFrontmatter(
  frontmatter: unknown,
  filename: string
): asserts frontmatter is BlogPostFrontmatter {
  if (!frontmatter || typeof frontmatter !== "object") {
    throw new Error(`Invalid frontmatter in ${filename}: frontmatter is missing or not an object`)
  }

  const fm = frontmatter as Record<string, unknown>

  if (!fm.title || typeof fm.title !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: title is missing or not a string`)
  }
  if (!fm.summary || typeof fm.summary !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: summary is missing or not a string`)
  }
  if (!fm.date || typeof fm.date !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: date is missing or not a string`)
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(fm.date)) {
    throw new Error(
      `Invalid frontmatter in ${filename}: date must be in YYYY-MM-DD format, got "${fm.date}"`
    )
  }

  if (fm.tags !== undefined) {
    if (!Array.isArray(fm.tags)) {
      throw new Error(`Invalid frontmatter in ${filename}: tags must be an array`)
    }
    if (!fm.tags.every(tag => typeof tag === "string")) {
      throw new Error(`Invalid frontmatter in ${filename}: all tags must be strings`)
    }
  }
}

let cachedPosts: BlogPostProps[] | null = null

/**
 * Scans the blog directory, parses all MDX files, and returns blog posts
 * sorted by date descending. Results are cached for the process lifetime.
 */
export async function getAllBlogPosts(): Promise<BlogPostProps[]> {
  if (cachedPosts) return cachedPosts

  const blogDir = path.join(process.cwd(), "src", "data", "blog")

  cachedPosts = await loadMDXDirectory<BlogPostFrontmatter, BlogPostProps>(
    blogDir,
    validateBlogFrontmatter,
    (slug, fm, fileContent) => ({
      slug,
      title: fm.title,
      summary: fm.summary,
      date: fm.date,
      tags: fm.tags?.map(tag => tag.toLowerCase()),
      readingTime: Math.ceil(fileContent.trim().split(/\s+/).length / 100),
    }),
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return cachedPosts
}

/**
 * Work item frontmatter validation and loading. Ensures required fields are present and correctly typed
 * @param frontmatter - The frontmatter object extracted from an MDX file
 * @param filename - The name of the MDX file (used for error messages)
 * @throws Error - throw an error if validation fails, indicating the specific issue and file
 * @asserts frontmatter is WorkItemFrontmatter - Narrows the type of frontmatter for downstream usage
 */
function validateWorkItemFrontmatter(
  frontmatter: unknown,
  filename: string
): asserts frontmatter is WorkItemFrontmatter {
  if (!frontmatter || typeof frontmatter !== "object") {
    throw new Error(`Invalid frontmatter in ${filename}: frontmatter is missing or not an object`)
  }

  const fm = frontmatter as Record<string, unknown>

  if (!fm.company || typeof fm.company !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: company is missing or not a string`)
  }
  if (!fm.title || typeof fm.title !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: title is missing or not a string`)
  }
  if (!fm.start || typeof fm.start !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: start is missing or not a string`)
  }
  if (!fm.end || typeof fm.end !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: end is missing or not a string`)
  }
  if (!fm.description || typeof fm.description !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: description is missing or not a string`)
  }
  if (!fm.locations || !Array.isArray(fm.locations)) {
    throw new Error(`Invalid frontmatter in ${filename}: locations must be an array`)
  }
  if (!fm.locations.every(loc => typeof loc === "string")) {
    throw new Error(`Invalid frontmatter in ${filename}: all locations must be strings`)
  }
  if (fm.logoUrl !== undefined && typeof fm.logoUrl !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: logoUrl must be a string`)
  }
}

let cachedWorkItems: WorkItemProps[] | null = null

/**
 * Scans the work directory, parses all MDX files, and returns work items
 * sorted by start date descending. Results are cached for the process lifetime.
 */
export async function getAllWorkItems(): Promise<WorkItemProps[]> {
  if (cachedWorkItems) return cachedWorkItems

  const workDir = path.join(process.cwd(), "src", "data", "work")

  cachedWorkItems = await loadMDXDirectory<WorkItemFrontmatter, WorkItemProps>(
    workDir,
    validateWorkItemFrontmatter,
    (slug, fm) => ({
      slug,
      company: fm.company,
      title: fm.title,
      start: fm.start,
      end: fm.end,
      description: fm.description,
      locations: fm.locations,
      logoUrl: fm.logoUrl,
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

/**
 * Project frontmatter validation and loading. Ensures required fields are present and correctly typed
 * @param frontmatter - The frontmatter object extracted from an MDX file
 * @param filename - The name of the MDX file (used for error messages)
 * @throws Error - throw an error if validation fails, indicating the specific issue and file
 * @asserts frontmatter is ProjectFrontmatter - Narrows the type of frontmatter for downstream usage
 */
function validateProjectFrontmatter(
  frontmatter: unknown,
  filename: string
): asserts frontmatter is ProjectFrontmatter {
  if (!frontmatter || typeof frontmatter !== "object") {
    throw new Error(`Invalid frontmatter in ${filename}: frontmatter is missing or not an object`)
  }

  const fm = frontmatter as Record<string, unknown>

  if (!fm.title || typeof fm.title !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: title is missing or not a string`)
  }
  if (!fm.image || typeof fm.image !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: image is missing or not a string`)
  }
  if (!fm.description || typeof fm.description !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: description is missing or not a string`)
  }
  if (!fm.startDate || typeof fm.startDate !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: startDate is missing or not a string`)
  }
  if (!fm.endDate || typeof fm.endDate !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: endDate is missing or not a string`)
  }
  if (!fm.techStack || !Array.isArray(fm.techStack)) {
    throw new Error(`Invalid frontmatter in ${filename}: techStack must be an array`)
  }
  if (!fm.techStack.every(tech => typeof tech === "string")) {
    throw new Error(`Invalid frontmatter in ${filename}: all techStack items must be strings`)
  }
  if (fm.teamSize !== undefined && typeof fm.teamSize !== "number") {
    throw new Error(`Invalid frontmatter in ${filename}: teamSize must be a number`)
  }
  if (fm.role !== undefined && typeof fm.role !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: role must be a string`)
  }
  if (fm.githubUrl !== undefined && typeof fm.githubUrl !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: githubUrl must be a string`)
  }
  if (fm.paperUrl !== undefined && typeof fm.paperUrl !== "string") {
    throw new Error(`Invalid frontmatter in ${filename}: paperUrl must be a string`)
  }
}

let cachedProjects: ProjectProps[] | null = null

/**
 * Scans the projects directory, parses all MDX files, and returns projects.
 * Results are cached for the process lifetime.
 */
export async function getAllProjects(): Promise<ProjectProps[]> {
  if (cachedProjects) return cachedProjects

  const projectsDir = path.join(process.cwd(), "src", "data", "projects")

  cachedProjects = await loadMDXDirectory<ProjectFrontmatter, ProjectProps>(
    projectsDir,
    validateProjectFrontmatter,
    (slug, fm) => ({
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
    })
  )

  return cachedProjects
}
