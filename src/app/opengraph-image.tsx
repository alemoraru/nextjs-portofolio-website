import fs from "fs"
import path from "path"
import { ImageResponse } from "next/og"
import { homeIntroConfig } from "@/data/content"
import { siteMetadata } from "@/data/metadata"
import { getOgThemeColors } from "@/lib/og-theme"

// DO NOT REMOVE BELOW VARIABLES
export const alt = "Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  // If a custom OG image is configured and the file exists in public/, serve it directly
  if (siteMetadata.ogImage) {
    const imagePath = path.join(process.cwd(), "public", siteMetadata.ogImage)
    if (fs.existsSync(imagePath)) {
      const buffer = fs.readFileSync(imagePath)
      const ext = path.extname(siteMetadata.ogImage).toLowerCase()
      const mimeTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
      }
      return new Response(buffer, {
        headers: { "Content-Type": mimeTypes[ext] ?? "image/png" },
      })
    }
  }

  // Generate a dynamic OG image when no custom image is provided
  const { accent, accentBg, accentText } = getOgThemeColors()
  const { name, facts } = homeIntroConfig

  const subtitle = [facts.role, facts.company, facts.location].filter(Boolean).join(" · ")
  const siteHost = siteMetadata.siteUrl.replace(/^https?:\/\//, "")

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
        <div style={{ display: "flex" }}>
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
            Portfolio
          </div>
        </div>

        {/* Middle: name + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: name.length > 20 ? "72px" : "88px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </div>
          {subtitle && (
            <div style={{ fontSize: "28px", color: "#6b7280", lineHeight: 1.4 }}>{subtitle}</div>
          )}
        </div>

        {/* Bottom: site URL */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ color: "#9ca3af", fontSize: "20px", fontWeight: 600 }}>{siteHost}</div>
        </div>
      </div>
    </div>,
    size
  )
}
