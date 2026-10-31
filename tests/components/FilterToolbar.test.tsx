import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import FilterToolbar from "@/components/FilterToolbar"

describe("FilterToolbar", () => {
  const defaultProps = {
    filter: <button>Filter</button>,
    sort: <button>Sort</button>,
    resultCount: 3,
    resultLabel: "post",
  }

  it("renders the filter and sort controls", () => {
    render(<FilterToolbar {...defaultProps} />)

    expect(screen.getByText("Filter")).toBeDefined()
    expect(screen.getByText("Sort")).toBeDefined()
  })

  it("pluralizes the result label", () => {
    const { container, rerender } = render(<FilterToolbar {...defaultProps} />)
    expect(container.textContent).toContain("3 posts")

    rerender(<FilterToolbar {...defaultProps} resultCount={0} />)
    expect(container.textContent).toContain("0 posts")
  })

  it("uses the singular label for a single result", () => {
    const { container } = render(<FilterToolbar {...defaultProps} resultCount={1} />)

    expect(container.textContent).toContain("1 post")
    expect(container.textContent).not.toContain("1 posts")
  })
})
