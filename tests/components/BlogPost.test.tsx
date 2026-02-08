import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import BlogPost from "@/components/BlogPost"

describe("BlogPost", () => {
  const defaultProps = {
    slug: "test-blog-post",
    title: "Test Blog Post",
    summary: "This is a test blog post summary with some content.",
    date: "2024-01-15",
    tags: ["React", "TypeScript", "Testing"],
  }

  it("renders the blog post title", () => {
    render(<BlogPost {...defaultProps} />)
    expect(screen.getByText("Test Blog Post")).toBeDefined()
  })

  it("renders the blog post link with correct href", () => {
    render(<BlogPost {...defaultProps} />)
    const link = screen.getByText("Test Blog Post").closest("a")
    expect(link?.getAttribute("href")).toBe("/blog/test-blog-post")
  })

  it("renders the blog post summary", () => {
    render(<BlogPost {...defaultProps} />)
    expect(screen.getByText("This is a test blog post summary with some content.")).toBeDefined()
  })

  it("renders the formatted date", () => {
    render(<BlogPost {...defaultProps} />)
    // The date "2024-01-15" should be formatted as "January 15, 2024"
    expect(screen.getByText("January 15, 2024")).toBeDefined()
  })

  it("renders the date with correct datetime attribute", () => {
    render(<BlogPost {...defaultProps} />)
    const timeElement = screen.getByText("January 15, 2024")
    expect(timeElement.tagName).toBe("TIME")
    expect(timeElement.getAttribute("datetime")).toBe("2024-01-15")
  })

  it("renders all tags when provided", () => {
    render(<BlogPost {...defaultProps} />)
    expect(screen.getByText("React")).toBeDefined()
    expect(screen.getByText("TypeScript")).toBeDefined()
    expect(screen.getByText("Testing")).toBeDefined()
  })

  it("does not render tags section when tags array is empty", () => {
    const { container } = render(<BlogPost {...defaultProps} tags={[]} />)
    // No tags should be rendered
    expect(container.querySelector(".flex.flex-wrap.gap-2.mt-3")).toBeNull()
  })

  it("does not render tags section when tags is undefined", () => {
    const { container } = render(<BlogPost {...defaultProps} tags={undefined} />)
    // No tags should be rendered
    expect(container.querySelector(".flex.flex-wrap.gap-2.mt-3")).toBeNull()
  })

  it("renders the 'Read article' call-to-action", () => {
    render(<BlogPost {...defaultProps} />)
    expect(screen.getByText("Read article")).toBeDefined()
  })

  it("renders the arrow indicator", () => {
    render(<BlogPost {...defaultProps} />)
    expect(screen.getByText("→")).toBeDefined()
  })

  it("does not render date when not provided", () => {
    const { container } = render(<BlogPost {...defaultProps} date="" />)
    expect(container.querySelector("time")).toBeNull()
  })
})
