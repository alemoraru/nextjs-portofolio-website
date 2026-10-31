import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import SortToggle from "@/components/SortToggle"

describe("SortToggle", () => {
  const mockOptions = [
    { label: "Newest first", value: "newest" as const },
    { label: "Oldest first", value: "oldest" as const },
  ]

  const defaultProps = {
    sortOrder: "newest" as const,
    onChange: vi.fn(),
    options: mockOptions,
  }

  it("displays the currently selected option label", () => {
    const { rerender } = render(<SortToggle {...defaultProps} />)
    expect(screen.getByText("Newest first")).toBeDefined()

    rerender(<SortToggle {...defaultProps} sortOrder="oldest" />)
    expect(screen.getByText("Oldest first")).toBeDefined()
  })

  it("shows 'Sort' as fallback when no matching option is found", () => {
    const invalidSortOrder = "invalid" as unknown as "newest"
    const { container } = render(<SortToggle {...defaultProps} sortOrder={invalidSortOrder} />)

    expect(container.textContent).toContain("Sort")
  })

  it("names the current order and the action for assistive technology", () => {
    render(<SortToggle {...defaultProps} />)

    expect(screen.getByRole("button", { name: "Newest first, change sort order" })).toBeDefined()
  })

  it("switches to the other option when clicked", () => {
    const mockOnChange = vi.fn()
    render(<SortToggle {...defaultProps} onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole("button"))

    expect(mockOnChange).toHaveBeenCalledWith("oldest")
    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it("wraps around to the first option from the last", () => {
    const mockOnChange = vi.fn()
    render(<SortToggle {...defaultProps} sortOrder="oldest" onChange={mockOnChange} />)

    fireEvent.click(screen.getByRole("button"))

    expect(mockOnChange).toHaveBeenCalledWith("newest")
  })

  it("flips the chevron for the second option only", () => {
    const { container, rerender } = render(<SortToggle {...defaultProps} />)
    expect(container.querySelector("svg")?.getAttribute("class")).not.toContain("rotate-180")

    rerender(<SortToggle {...defaultProps} sortOrder="oldest" />)
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("rotate-180")
  })
})
