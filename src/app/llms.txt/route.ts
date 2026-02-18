import { NextResponse } from "next/server"
import { paginationConfig } from "@/data/content"
import { siteMetadata } from "@/data/metadata"

/**
 * API route handler for GET requests to "/llms.txt".
 * This route generates a plain text file containing site metadata and route information.
 * It is intended for use by language models (LLMs) to understand the structure and content of the site.
 */
export function GET() {
  const { blogPostsPerPage, workItemsPerPage, projectsPerPage } = paginationConfig

  const content = `# ${siteMetadata.title}

${siteMetadata.description}

## Keywords

${siteMetadata.keywords.join(", ")}

## URL

${siteMetadata.siteUrl}

## Routes

${siteMetadata.siteUrl}
  The home page. Provides an introduction to the author and previews of recent blog posts, projects, and work experience.

${siteMetadata.siteUrl}/blog
  A list of blog posts written by the author. Shows ${blogPostsPerPage} posts per page. Supports pagination via ?page=n.

${siteMetadata.siteUrl}/projects
  A showcase of personal and professional projects. Shows ${projectsPerPage} projects per page. Supports pagination via ?page=n.

${siteMetadata.siteUrl}/work
  A timeline of work experience and employment history. Shows ${workItemsPerPage} items per page. Supports pagination via ?page=n.
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
