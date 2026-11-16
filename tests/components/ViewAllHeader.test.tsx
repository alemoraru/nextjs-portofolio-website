import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ViewAllHeader from "@/components/ViewAllHeader"

describe("ViewAllHeader", () => {
  it("renders the section title as a heading", () => {
    render(
      <ViewAllHeader
        title="Recent Blog Posts"
        pageUrl="/blog"
        itemCount={12}
        itemLabel="blog posts"
      />
    )
    expect(screen.getByRole("heading", { level: 2, name: "Recent Blog Posts" })).toBeDefined()
  })

  it("names the link after what it lists, not just the count", () => {
    render(
      <ViewAllHeader
        title="Recent Blog Posts"
        pageUrl="/blog"
        itemCount={12}
        itemLabel="blog posts"
      />
    )
    const link = screen.getByRole("link", { name: "View all 12 blog posts" })
    expect(link.getAttribute("href")).toBe("/blog")
  })
})
