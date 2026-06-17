import { ImageResponse } from "next/og"
import { homeIntroConfig } from "@/data/content"
import { getAllWorkItems } from "@/lib/mdx"
import { getOgThemeColors } from "@/lib/og-theme"

// DO NOT REMOVE BELOW VARIABLES
export const alt = "Work Experience"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const { accent, accentBg, accentText } = getOgThemeColors()
  const items = await getAllWorkItems()
  const count = items.length
  const previewItems = items.slice(0, 4)
  const companyLabel = `${count} compan${count !== 1 ? "ies" : "y"}`

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
        {/* Top: label + count */}
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
          <div style={{ color: "#9ca3af", fontSize: "18px" }}>{companyLabel}</div>
        </div>

        {/* Middle: section title + company list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Work Experience
          </div>
          {previewItems.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {previewItems.map(item => (
                <div key={item.slug} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                    style={{ display: "flex", fontSize: "20px", color: "#374151", fontWeight: 500 }}
                  >
                    <span>{item.company}</span>
                    {item.title && (
                      <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {item.title}</span>
                    )}
                  </div>
                </div>
              ))}
              {count > previewItems.length && (
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
                    {`+ ${count - previewItems.length} more`}
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
