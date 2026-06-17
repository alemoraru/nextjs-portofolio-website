import { ImageResponse } from "next/og"
import { homeIntroConfig } from "@/data/content"
import { getAllBlogPosts } from "@/lib/mdx"
import { getOgThemeColors } from "@/lib/og-theme"

// DO NOT REMOVE BELOW VARIABLES
export const alt = "Blog"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const { accent, accentBg, accentText } = getOgThemeColors()
  const posts = await getAllBlogPosts()
  const count = posts.length
  const recentPosts = posts.slice(0, 6)
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
            Blog
          </div>
          <div style={{ color: "#9ca3af", fontSize: "18px" }}>{postLabel}</div>
        </div>

        {/* Middle: section title + recent posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            All Posts
          </div>
          {recentPosts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentPosts.map(post => (
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
                    }}
                  >
                    {post.title.length > 65 ? `${post.title.slice(0, 65)}…` : post.title}
                  </div>
                </div>
              ))}
              {count > recentPosts.length && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "9999px",
                      background: "#d1d5db",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ fontSize: "18px", color: "#9ca3af", fontWeight: 400 }}>
                    {`+ ${count - recentPosts.length} more`}
                  </div>
                </div>
              )}
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
