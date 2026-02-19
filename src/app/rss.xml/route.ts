import { NextResponse } from "next/server"
import { siteMetadata } from "@/data/metadata"
import { getAllBlogPosts } from "@/lib/mdx"
import { escapeXml } from "@/lib/utils"

/**
 * API route handler for GET requests to "/rss.xml".
 * This route generates an RSS 2.0 XML feed from all blog posts,
 * allowing readers to subscribe via feed readers.
 */
export async function GET() {
  const posts = await getAllBlogPosts()

  const items = posts
    .map(post => {
      const link = `${siteMetadata.siteUrl}/blog/${post.slug}`
      const categories = post.tags
        ?.map(tag => `      <category>${escapeXml(tag)}</category>`)
        .join("\n")

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${link}</guid>
${categories || ""}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${siteMetadata.siteUrl}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
