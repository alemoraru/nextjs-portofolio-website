import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ProjectTile from "@/components/ProjectTile"

describe("ProjectTile", () => {
  const defaultProps = {
    slug: "test-project",
    title: "Test Project",
    image: "/test-image.png",
    description: "This is a test project description",
    techStack: ["React", "TypeScript", "Next.js"],
    startDate: "Jan 2024",
    endDate: "Mar 2024",
  }

  it("renders the project title", () => {
    render(<ProjectTile {...defaultProps} />)
    expect(screen.getByText("Test Project")).toBeDefined()
  })

  it("renders the project link with correct href", () => {
    render(<ProjectTile {...defaultProps} />)
    const link = screen.getByText("Test Project").closest("a")
    expect(link?.getAttribute("href")).toBe("/projects/test-project")
  })

  it("renders the project image with correct src and alt", () => {
    render(<ProjectTile {...defaultProps} />)
    const image = screen.getByAltText("Test Project")
    expect(image).toBeDefined()
    expect(image.getAttribute("src")).toBe("/test-image.png")
  })

  it("renders the project description when provided", () => {
    render(<ProjectTile {...defaultProps} />)
    expect(screen.getByText("This is a test project description")).toBeDefined()
  })

  it("does not render description when not provided", () => {
    const { container } = render(<ProjectTile {...defaultProps} description={undefined} />)
    expect(container.textContent).not.toContain("This is a test project description")
  })

  it("renders the date range when both dates are provided", () => {
    render(<ProjectTile {...defaultProps} />)
    expect(screen.getByText(/Jan 2024 – Mar 2024/)).toBeDefined()
  })

  it("renders the tech stack badges", () => {
    render(<ProjectTile {...defaultProps} />)
    expect(screen.getByText("React")).toBeDefined()
    expect(screen.getByText("TypeScript")).toBeDefined()
    expect(screen.getByText("Next.js")).toBeDefined()
  })

  it("limits tech badges to 5 and shows remaining count", () => {
    const manyTechStack = [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind",
      "Node.js",
      "PostgreSQL",
      "Docker",
    ]
    render(<ProjectTile {...defaultProps} techStack={manyTechStack} />)

    // Should show first 5
    expect(screen.getByText("React")).toBeDefined()
    expect(screen.getByText("TypeScript")).toBeDefined()
    expect(screen.getByText("Next.js")).toBeDefined()
    expect(screen.getByText("Tailwind")).toBeDefined()
    expect(screen.getByText("Node.js")).toBeDefined()

    // Should show "+ 2 more" for remaining
    expect(screen.getByText("+ 2 more")).toBeDefined()
  })

  it("renders the 'Explore Project' overlay text", () => {
    render(<ProjectTile {...defaultProps} />)
    expect(screen.getByText("Explore Project")).toBeDefined()
  })

  it("does not render dates when not provided", () => {
    const { container } = render(
      <ProjectTile {...defaultProps} startDate={undefined} endDate={undefined} />
    )
    expect(container.querySelector("time")).toBeNull()
  })

  it("does not render tech stack when empty", () => {
    const { container } = render(<ProjectTile {...defaultProps} techStack={[]} />)
    // TechBadge components should not be rendered
    expect(container.textContent).not.toContain("React")
  })
})
