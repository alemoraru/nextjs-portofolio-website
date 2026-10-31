import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Timeline, TimelineItem } from "@/components/mdx/Timeline"

// jsdom has no IntersectionObserver, which framer-motion's `whileInView` relies on
vi.stubGlobal(
  "IntersectionObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

describe("TimelineItem", () => {
  const defaultProps = {
    title: "Software Engineer",
    duration: "05/2022 - 06/2023",
    location: "Remote",
  }

  it("renders the title, location and content", () => {
    render(<TimelineItem {...defaultProps}>Built things</TimelineItem>)

    expect(screen.getByRole("heading", { name: "Software Engineer" })).toBeDefined()
    expect(screen.getByText("Remote")).toBeDefined()
    expect(screen.getByText("Built things")).toBeDefined()
  })

  it("formats month/year durations", () => {
    render(<TimelineItem {...defaultProps}>Content</TimelineItem>)

    expect(screen.getByText("May 2022 – Jun 2023")).toBeDefined()
  })

  it("formats durations that are still ongoing", () => {
    render(
      <TimelineItem {...defaultProps} duration="02/2025 - Present">
        Content
      </TimelineItem>
    )

    expect(screen.getByText("Feb 2025 – Present")).toBeDefined()
  })

  it("displays durations in other formats as written", () => {
    render(
      <TimelineItem {...defaultProps} duration="Jan 2020 - Mar 2021">
        Content
      </TimelineItem>
    )

    expect(screen.getByText("Jan 2020 - Mar 2021")).toBeDefined()
  })

  it("tags a role that is still ongoing as current", () => {
    render(
      <TimelineItem {...defaultProps} duration="02/2025 - Present">
        Content
      </TimelineItem>
    )

    expect(screen.getByText("Current")).toBeDefined()
  })

  it("does not tag a past role as current", () => {
    render(<TimelineItem {...defaultProps}>Content</TimelineItem>)

    expect(screen.queryByText("Current")).toBeNull()
  })
})

describe("Timeline", () => {
  it("exposes the items as a labelled list", () => {
    render(
      <Timeline>
        <TimelineItem title="One" duration="05/2022 - 06/2023" location="Remote">
          Content
        </TimelineItem>
        <TimelineItem title="Two" duration="01/2021 - 04/2022" location="Remote">
          Content
        </TimelineItem>
      </Timeline>
    )

    expect(screen.getByRole("list", { name: "Work history timeline" })).toBeDefined()
    expect(screen.getAllByRole("listitem").length).toBe(2)
  })
})
