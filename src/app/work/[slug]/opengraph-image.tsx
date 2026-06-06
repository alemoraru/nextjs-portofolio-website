import { ImageResponse } from "next/og"
import { homeIntroConfig } from "@/data/content"
import { getAllWorkItems } from "@/lib/mdx"
import { getOgThemeColors } from "@/lib/og-theme"

// DO NOT REMOVE BELOW VARIABLES
export const alt = "Work experience"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Generates an Open Graph image for a work experience item based on its slug.
 * The image includes the company's name, role, description, and period of employment,
 * styled in a visually appealing way for sharing on social media platforms.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { accent, accentBg, accentText } = getOgThemeColors()
  const items = await getAllWorkItems()
  const item = items.find(w => w.slug === slug)

  const company = item?.company ?? "Work Experience"
  const role = item?.title ?? ""
  const description = item?.description ?? ""
  const period = item ? `${item.start} – ${item.end}` : ""
  const locations = item?.locations?.join(" · ") ?? ""

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
            Work Experience
          </div>
          {period && <span style={{ color: "#9ca3af", fontSize: "18px" }}>{period}</span>}
        </div>

        {/* Middle: company + role + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {company}
          </div>
          {role && (
            <div
              style={{
                fontSize: "30px",
                fontWeight: 600,
                color: accent,
                lineHeight: 1.2,
              }}
            >
              {role}
            </div>
          )}
          {description && (
            <div
              style={{
                fontSize: "22px",
                color: "#6b7280",
                lineHeight: 1.5,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom: location + site name */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {locations && (
            <div style={{ color: "#9ca3af", fontSize: "18px" }}>{`📍 ${locations}`}</div>
          )}
          <div style={{ color: "#9ca3af", fontSize: "20px", fontWeight: 600 }}>
            {homeIntroConfig.name}
          </div>
        </div>
      </div>
    </div>,
    size
  )
}
