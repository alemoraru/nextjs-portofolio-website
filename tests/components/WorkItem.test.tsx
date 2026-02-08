import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import WorkItem from "@/components/WorkItem"

describe("WorkItem", () => {
  const defaultProps = {
    slug: "test-work-item",
    company: "Test Company",
    title: "Senior Software Engineer",
    start: "Jan 2023",
    end: "Dec 2023",
    description: "This is a test work item description with details about the role.",
    locations: ["San Francisco, CA", "Remote"],
    logoUrl: "/company-logo.png",
  }

  it("renders the work item title and company", () => {
    render(<WorkItem {...defaultProps} />)
    expect(screen.getByText("Senior Software Engineer @ Test Company")).toBeDefined()
  })

  it("renders the work item link with correct href", () => {
    render(<WorkItem {...defaultProps} />)
    const link = screen.getByText("Senior Software Engineer @ Test Company").closest("a")
    expect(link?.getAttribute("href")).toBe("/work/test-work-item")
  })

  it("renders the company logo when provided", () => {
    render(<WorkItem {...defaultProps} />)
    const logo = screen.getByAltText("Test Company logo")
    expect(logo).toBeDefined()
    expect(logo.getAttribute("src")).toBe("/company-logo.png")
  })

  it("does not render company logo when not provided", () => {
    render(<WorkItem {...defaultProps} logoUrl={undefined} />)
    const logo = screen.queryByAltText("Test Company logo")
    expect(logo).toBeNull()
  })

  it("renders the start and end dates", () => {
    render(<WorkItem {...defaultProps} />)
    expect(screen.getByText(/Jan 2023 – Dec 2023/)).toBeDefined()
  })

  it("renders the work item description", () => {
    render(<WorkItem {...defaultProps} />)
    expect(
      screen.getByText("This is a test work item description with details about the role.")
    ).toBeDefined()
  })

  it("renders locations when provided", () => {
    render(<WorkItem {...defaultProps} />)
    expect(screen.getByText("San Francisco, CA, Remote")).toBeDefined()
  })

  it("does not render locations when not provided", () => {
    const { container } = render(<WorkItem {...defaultProps} locations={undefined} />)
    expect(container.textContent).not.toContain("San Francisco")
  })

  it("does not render locations when array is empty", () => {
    const { container } = render(<WorkItem {...defaultProps} locations={[]} />)
    // Should not render the location section
    expect(container.querySelector(".flex.items-center.mt-1")).toBeNull()
  })

  it("renders the calendar icon", () => {
    const { container } = render(<WorkItem {...defaultProps} />)
    // FaCalendarAlt should be rendered (checking for the presence of svg or icon class)
    const calendarIcon = container.querySelector("svg")
    expect(calendarIcon).not.toBeNull()
  })

  it("renders the map marker icon when locations are provided", () => {
    const { container } = render(<WorkItem {...defaultProps} />)
    // Should have at least 2 icons (calendar + map marker)
    const icons = container.querySelectorAll("svg")
    expect(icons.length).toBeGreaterThanOrEqual(2)
  })

  it("renders duration between start and end dates", () => {
    const { container } = render(<WorkItem {...defaultProps} />)
    // The calculateDuration function should return something like "1 yr" or "12 mos"
    // We're testing that the parent container has both dates and the separator
    const datesContainer = container.querySelector(".flex.items-center.gap-2")
    expect(datesContainer?.textContent).toMatch(/Jan 2023 – Dec 2023/)
    expect(datesContainer?.textContent).toMatch(/·/)
  })
})
