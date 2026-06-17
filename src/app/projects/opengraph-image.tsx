import { ImageResponse } from "next/og"
import { homeIntroConfig } from "@/data/content"
import { getAllProjects } from "@/lib/mdx"
import { getOgThemeColors } from "@/lib/og-theme"

// DO NOT REMOVE BELOW VARIABLES
export const alt = "Projects"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const { accent, accentBg, accentText } = getOgThemeColors()
  const projects = await getAllProjects()
  const count = projects.length
  const previewProjects = projects.slice(0, 6)
  const projectLabel = `${count} project${count !== 1 ? "s" : ""}`

  // Aggregate the most-used technologies across all projects
  const techFreq: Record<string, number> = {}
  for (const project of projects) {
    for (const tech of project.techStack ?? []) {
      techFreq[tech] = (techFreq[tech] ?? 0) + 1
    }
  }
  const topTech = Object.entries(techFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tech]) => tech)

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
            Projects
          </div>
          <div style={{ color: "#9ca3af", fontSize: "18px" }}>{projectLabel}</div>
        </div>

        {/* Middle: section title + project list */}
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
            All Projects
          </div>
          {previewProjects.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {previewProjects.map(project => (
                <div
                  key={project.slug}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "9999px",
                      background: accent,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ fontSize: "20px", color: "#374151", fontWeight: 500 }}>
                    {project.title.length > 65 ? `${project.title.slice(0, 65)}…` : project.title}
                  </div>
                </div>
              ))}
              {count > previewProjects.length && (
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
                    {`+ ${count - previewProjects.length} more`}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom: top tech chips + site name */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#9ca3af",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Common tech
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {topTech.map(tech => (
                <div
                  key={tech}
                  style={{
                    background: "#f3f4f6",
                    color: "#374151",
                    fontSize: "16px",
                    fontWeight: 500,
                    padding: "5px 14px",
                    borderRadius: "9999px",
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
          <div style={{ color: "#9ca3af", fontSize: "20px", fontWeight: 600, flexShrink: 0 }}>
            {homeIntroConfig.name}
          </div>
        </div>
      </div>
    </div>,
    size
  )
}
