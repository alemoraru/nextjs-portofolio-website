import { NextResponse } from "next/server"
import { siteMetadata } from "@/data/metadata"
import { getAllBlogPosts, getAllProjects, getAllWorkItems } from "@/lib/mdx"

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
    .map(p => `- [${p.title}](${base}/blog/${p.slug}): ${p.summary}`)
    .join("\n")

  const projectsSection = projects
    .map(p => {
      const period =
        p.endDate === "Present" ? `${p.startDate} – Present` : `${p.startDate} – ${p.endDate}`
      const tech = p.techStack.join(", ")
      return `- [${p.title}](${base}/projects/${p.slug}) (${period}, ${tech}): ${p.description}`
    })
    .join("\n")

  const workSection = work
    .map(w => {
      const period = `${w.start} – ${w.end}`
      return `- [${w.company}](${base}/work/${w.slug}): ${w.title}, ${period}. ${w.description}`
    })
    .join("\n")

  const content = `# ${siteMetadata.title}

> ${siteMetadata.description}

## Blog Posts

${blogSection}

## Projects

${projectsSection}

## Work Experience

${workSection}

## Site

- [Home](${base}): Introduction and previews of recent activity.
- [Blog](${base}/blog): All blog posts.
- [Projects](${base}/projects): All projects.
- [Work](${base}/work): Full work history.
- [RSS Feed](${base}/rss.xml): Subscribe to new blog posts.
`

  return new NextResponse(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
