import { NextResponse } from "next/server"
import { siteMetadata } from "@/data/metadata"
import { getAllBlogPosts, getAllProjects, getAllWorkItems } from "@/lib/mdx"
import { formatDateRange } from "@/lib/utils"

/**
 * API route handler for GET requests to "/llms.txt".
 * This route generates a plain text file containing site metadata and route information.
 * It is intended for use by language models (LLMs) to understand the structure and content of the site.
 */
export async function GET() {
  const base = siteMetadata.siteUrl
  const [posts, projects, work] = await Promise.all([
    getAllBlogPosts(),
    getAllProjects(),
    getAllWorkItems(),
  ])

  const blogSection = posts
    .map(p => {
      const meta = [
        p.readingTime ? `${p.readingTime} min read` : null,
        p.tags?.length ? `tags: ${p.tags.join(", ")}` : null,
      ]
        .filter(Boolean)
        .join("; ")
      return `- [${p.title}](${base}/blog/${p.slug})${meta ? ` (${meta})` : ""}: ${p.summary}`
    })
    .join("\n")

  const projectsSection = projects
    .map(p => {
      const period = formatDateRange(p.startDate, p.endDate)
      const tech = p.techStack.join(", ")
      return `- [${p.title}](${base}/projects/${p.slug}) (${period}, ${tech}): ${p.description}`
    })
    .join("\n")

  const workSection = work
    .map(w => {
      const period = formatDateRange(w.start, w.end)
      const tech = w.techStack?.length ? `, ${w.techStack.join(", ")}` : ""
      return `- [${w.company}](${base}/work/${w.slug}): ${w.title}, ${period}${tech}. ${w.description}`
    })
    .join("\n")

  // Every distinct tag across blog posts, each linking to its filtered "/blog/tag/[tag]" page,
  // so a crawler/agent can discover topic groupings without having to infer them from prose.
  const tags = Array.from(new Set(posts.flatMap(p => p.tags ?? []))).sort()
  const tagsSection = tags
    .map(tag => {
      const count = posts.filter(p => p.tags?.includes(tag)).length
      return `- [${tag}](${base}/blog/tag/${encodeURIComponent(tag)}): ${count} post${count === 1 ? "" : "s"}`
    })
    .join("\n")

  const sections = [
    `# ${siteMetadata.title}`,
    `> ${siteMetadata.description}`,
    `## Blog Posts\n\n${blogSection}`,
    `## Projects\n\n${projectsSection}`,
    `## Work Experience\n\n${workSection}`,
  ]

  if (tagsSection) {
    sections.push(`## Blog Tags\n\n${tagsSection}`)
  }

  sections.push(
    `## Site

- [Home](${base}): Introduction and previews of recent activity.
- [Blog](${base}/blog): All blog posts.
- [Projects](${base}/projects): All projects.
- [Work](${base}/work): Full work history.
- [RSS Feed](${base}/rss.xml): Subscribe to new blog posts.`
  )

  const content = sections.join("\n\n") + "\n"

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
