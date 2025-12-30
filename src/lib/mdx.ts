import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import { BlogPostFrontmatter, BlogPostProps } from "./types"

// Cache to store parsed blog posts for performance
let cachedPosts: BlogPostProps[] | null = null

/**
 * Validates that the frontmatter has all required fields and correct format.
 * @param frontmatter - The frontmatter object to validate
 * @param filename - The filename for error reporting
 * @throws Error if validation fails
 */
function validateFrontmatter(
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

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(fm.date)) {
    throw new Error(
      `Invalid frontmatter in ${filename}: date must be in YYYY-MM-DD format, got "${fm.date}"`
    )
  }

  // Validate tags if present
  if (fm.tags !== undefined) {
    if (!Array.isArray(fm.tags)) {
      throw new Error(`Invalid frontmatter in ${filename}: tags must be an array`)
    }
    if (!fm.tags.every(tag => typeof tag === "string")) {
      throw new Error(`Invalid frontmatter in ${filename}: all tags must be strings`)
    }
  }
}

/**
 * Scans the blog directory, parses all MDX files, and returns an array of blog posts.
 * Results are cached for performance.
 * @returns Promise resolving to an array of BlogPostProps sorted by date (descending)
 */
export async function getAllBlogPosts(): Promise<BlogPostProps[]> {
  // Return cached posts if available
  if (cachedPosts) {
    return cachedPosts
  }

  const blogDir = path.join(process.cwd(), "src", "data", "blog")

  // Read all files in the blog directory
  const files = fs.readdirSync(blogDir)

  // Filter for .mdx files only
  const mdxFiles = files.filter(file => file.endsWith(".mdx"))

  // Parse each MDX file and extract frontmatter
  const posts = await Promise.all(
    mdxFiles.map(async file => {
      const filePath = path.join(blogDir, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")

      // Extract slug from filename (remove .mdx extension)
      const slug = path.basename(file, ".mdx")

      try {
        // Parse frontmatter using compileMDX
        const { frontmatter } = await compileMDX<BlogPostFrontmatter>({
          source: fileContent,
          options: {
            parseFrontmatter: true,
          },
        })

        // Validate frontmatter
        validateFrontmatter(frontmatter, file)

        // Normalize tags to lowercase for consistency
        const normalizedTags = frontmatter.tags?.map(tag => tag.toLowerCase())

        // Return BlogPostProps object
        return {
          slug,
          title: frontmatter.title,
          summary: frontmatter.summary,
          date: frontmatter.date,
          tags: normalizedTags,
        } as BlogPostProps
      } catch (error) {
        throw new Error(
          `Failed to parse ${file}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    })
  )

  // Sort posts by date (descending - newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })

  // Cache the results
  cachedPosts = sortedPosts

  return sortedPosts
}

/**
 * Gets a single blog post by slug.
 * @param slug - The slug of the blog post to retrieve
 * @returns Promise resolving to the blog post or undefined if not found
 */
export async function getBlogPost(slug: string): Promise<BlogPostProps | undefined> {
  const posts = await getAllBlogPosts()
  return posts.find(post => post.slug === slug)
}
