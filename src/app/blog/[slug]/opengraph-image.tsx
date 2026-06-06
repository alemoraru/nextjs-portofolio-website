import { ImageResponse } from "next/og"
import { homeIntroConfig } from "@/data/content"
import { getAllBlogPosts } from "@/lib/mdx"
import { getOgThemeColors } from "@/lib/og-theme"

// DO NOT REMOVE BELOW VARIABLES
export const alt = "Blog post"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Generates an Open Graph image for a blog post based on its slug.
 * The image includes the post's title, summary, tags, and publication date,
 * styled in a visually appealing way for sharing on social media platforms.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { accent, accentBg, accentText } = getOgThemeColors()
  const posts = await getAllBlogPosts()
  const post = posts.find(p => p.slug === slug)

  const title = post?.title ?? "Blog Post"
  const summary = post?.summary ?? ""
  const tags = post?.tags?.slice(0, 4) ?? []
  const date = post?.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#ffffff",
        display: "flex",
        flexDirection: "row",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Left accent bar */}
      <div style={{ width: "12px", background: accent, flexShrink: 0 }} />

      {/* Content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
        }}
      >
        {/* Top: label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: accentBg,
              color: accentText,
              fontSize: "20px",
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: "9999px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Blog
          </div>
          {date && <span style={{ color: "#9ca3af", fontSize: "18px" }}>{date}</span>}
        </div>

        {/* Middle: title + summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: title.length > 50 ? "48px" : "60px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {summary && (
            <div
              style={{
                fontSize: "24px",
                color: "#6b7280",
                lineHeight: 1.5,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {summary}
            </div>
          )}
        </div>

        {/* Bottom: tags + site name */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {tags.map(tag => (
              <div
                key={tag}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  fontSize: "18px",
                  fontWeight: 500,
                  padding: "6px 16px",
                  borderRadius: "9999px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ color: "#9ca3af", fontSize: "20px", fontWeight: 600 }}>
            {homeIntroConfig.name}
          </div>
        </div>
      </div>
    </div>,
    size
  )
}
