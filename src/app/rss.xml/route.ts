import { NextResponse } from "next/server"
import { siteMetadata } from "@/data/metadata"
import { getAllBlogPosts } from "@/lib/mdx"
import { escapeXml } from "@/lib/utils"

/**
 * Posts come from MDX files bundled at build time, not a live data source, so
 * there's no mid-deploy staleness to guard against with a timed revalidation:
 * force this to prerender once and cache until the next deploy.
 */
export const dynamic = "force-static"

/**
 * API route handler for GET requests to "/rss.xml".
 * This route generates an RSS 2.0 XML feed from all blog posts,
 * allowing readers to subscribe via feed readers.
 * RSS Specification can be found at https://www.rssboard.org/rss-specification.
 */
export async function GET() {
  const posts = await getAllBlogPosts()
  const feedUrl = `${siteMetadata.siteUrl}/rss.xml`

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
      <guid isPermaLink="true">${link}</guid>${categories ? `\n${categories}` : ""}
    </item>`
    })
    .join("\n")

  // Fields are entity-escaped via escapeXml() rather than wrapped in CDATA sections.
  // CDATA is preferred by feeds that embed raw/HTML-heavy content (so it doesn't need
  // per-character escaping); our fields are plain text, so entity-escaping is simpler
  // and equally spec-compliant.
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${siteMetadata.siteUrl}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  // Use "application/xml" rather than "application/rss+xml": browsers treat the
  // latter as a feed MIME type (legacy feed-preview handling) and render it as
  // plain text instead of the syntax-highlighted XML tree view.
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
