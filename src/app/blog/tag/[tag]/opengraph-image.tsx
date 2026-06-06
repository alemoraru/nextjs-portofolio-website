import { ImageResponse } from "next/og"
import { homeIntroConfig } from "@/data/content"
import { getAllBlogPosts } from "@/lib/mdx"
import { getOgThemeColors } from "@/lib/og-theme"

// DO NOT REMOVE BELOW VARIABLES
export const alt = "Blog tag"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Generates an Open Graph image for a blog tag page based on the tag name.
 * The image includes the tag name, the number of posts with that tag, and the site name,
 * styled in a visually appealing way for sharing on social media platforms.
 */
export default async function Image({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const { accent, accentBg, accentText } = getOgThemeColors()
  const decodedTag = decodeURIComponent(tag)

  const posts = await getAllBlogPosts()
  const taggedPosts = posts.filter(p =>
    p.tags?.some(t => t.toLowerCase() === decodedTag.toLowerCase())
  )
  const count = taggedPosts.length
  const previewPosts = taggedPosts.slice(0, 3)
  const postLabel = `${count} post${count !== 1 ? "s" : ""}`

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
        {/* Top: label + post count */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            Blog Tag
          </div>
          <div style={{ color: "#9ca3af", fontSize: "18px" }}>{postLabel}</div>
        </div>

        {/* Middle: tag name + post preview list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: decodedTag.length > 20 ? "56px" : "72px",
              fontWeight: 800,
              color: accent,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {`#${decodedTag}`}
          </div>
          {previewPosts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#9ca3af",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {`Latest ${previewPosts.length} post${previewPosts.length !== 1 ? "s" : ""}`}
              </div>
              {previewPosts.map(post => (
                <div key={post.slug} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "9999px",
                      background: accent,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      fontSize: "20px",
                      color: "#374151",
                      fontWeight: 500,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.title.length > 60 ? `${post.title.slice(0, 60)}…` : post.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: site name */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ color: "#9ca3af", fontSize: "20px", fontWeight: 600 }}>
            {homeIntroConfig.name}
          </div>
        </div>
      </div>
    </div>,
    size
  )
}
