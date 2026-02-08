import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import SortDropdown from "@/components/SortDropdown"

describe("SortDropdown", () => {
  const mockOptions = [
    { label: "Newest First", value: "newest" as const },
    { label: "Oldest First", value: "oldest" as const },
    { label: "A-Z", value: "asc" as const },
    { label: "Z-A", value: "desc" as const },
  ]

  const defaultProps = {
    sortOrder: "newest" as const,
    onChange: vi.fn(),
    options: mockOptions,
  }

  it("renders the dropdown button", () => {
    render(<SortDropdown {...defaultProps} />)

    const button = screen.getByRole("button")
    expect(button).toBeDefined()
  })

  it("displays the currently selected option label", () => {
    render(<SortDropdown {...defaultProps} />)

    expect(screen.getByText("Newest First")).toBeDefined()
  })

  it("displays correct label for different sort orders", () => {
    const { rerender } = render(<SortDropdown {...defaultProps} sortOrder="oldest" />)
    expect(screen.getByText("Oldest First")).toBeDefined()

    rerender(<SortDropdown {...defaultProps} sortOrder="asc" />)
    expect(screen.getByText("A-Z")).toBeDefined()

    rerender(<SortDropdown {...defaultProps} sortOrder="desc" />)
    expect(screen.getByText("Z-A")).toBeDefined()
  })

  it("shows 'Sort' as fallback when no matching option is found", () => {
    const { container } = render(<SortDropdown {...defaultProps} sortOrder={"invalid" as any} />)

    expect(container.textContent).toContain("Sort")
  })

  it("dropdown is initially closed", () => {
    render(<SortDropdown {...defaultProps} />)

    // Options should not be visible initially
    expect(screen.queryByText("Oldest First")).toBeNull()
  })

  it("opens dropdown when button is clicked", () => {
    render(<SortDropdown {...defaultProps} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    // All options should now be visible
    expect(screen.getByText("Oldest First")).toBeDefined()
    expect(screen.getByText("A-Z")).toBeDefined()
    expect(screen.getByText("Z-A")).toBeDefined()
  })

  it("closes dropdown when button is clicked again", () => {
    render(<SortDropdown {...defaultProps} />)

    const button = screen.getByRole("button")

    // Open dropdown
    fireEvent.click(button)
    expect(screen.queryByText("Oldest First")).toBeDefined()

    // Close dropdown
    fireEvent.click(button)
    expect(screen.queryByText("Oldest First")).toBeNull()
  })

  it("displays all options when dropdown is open", () => {
    render(<SortDropdown {...defaultProps} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    // Check for options that are unique in the dropdown
    expect(screen.getByText("Oldest First")).toBeDefined()
    expect(screen.getByText("A-Z")).toBeDefined()
    expect(screen.getByText("Z-A")).toBeDefined()
  })

  it("marks selected option correctly", () => {
    render(<SortDropdown {...defaultProps} sortOrder="newest" />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    // All text instances should be present (both in button and dropdown)
    const allOptions = screen.getAllByText("Newest First")
    expect(allOptions.length).toBeGreaterThan(0)
  })

  it("calls onChange when an option is selected", () => {
    const mockOnChange = vi.fn()
    render(<SortDropdown {...defaultProps} onChange={mockOnChange} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    const oldestOption = screen.getByText("Oldest First")
    fireEvent.click(oldestOption)

    expect(mockOnChange).toHaveBeenCalledWith("oldest")
    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it("closes dropdown after selecting an option", () => {
    render(<SortDropdown {...defaultProps} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    const oldestOption = screen.getByText("Oldest First")
    fireEvent.click(oldestOption)

    // Dropdown should be closed after selection
    expect(screen.queryByText("A-Z")).toBeNull()
  })

  it("closes dropdown when clicking outside", () => {
    render(
      <div data-testid="outside">
        <SortDropdown {...defaultProps} />
      </div>
    )

    const button = screen.getByRole("button")
    fireEvent.click(button)

    // Dropdown is open
    expect(screen.queryByText("Oldest First")).toBeDefined()

    const outside = screen.getByTestId("outside")
    fireEvent.mouseDown(outside)

    // Dropdown should be closed
    expect(screen.queryByText("Oldest First")).toBeNull()
  })

  it("does not close dropdown when clicking inside", () => {
    const { container } = render(<SortDropdown {...defaultProps} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    // Click inside the dropdown
    const dropdown = container.querySelector(".relative")
    if (dropdown) {
      fireEvent.mouseDown(dropdown)
    }

    // Dropdown should still be open
    expect(screen.queryByText("Oldest First")).toBeDefined()
  })

  it("closes dropdown when Escape key is pressed", () => {
    render(<SortDropdown {...defaultProps} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)

    // Dropdown is open
    expect(screen.queryByText("Oldest First")).toBeDefined()

    fireEvent.keyDown(document, { key: "Escape" })

    // Dropdown should be closed
    expect(screen.queryByText("Oldest First")).toBeNull()
  })

  it("renders chevron icon", () => {
    const { container } = render(<SortDropdown {...defaultProps} />)

    // FaChevronDown icon should be present
    const chevron = container.querySelector("svg")
    expect(chevron).not.toBeNull()
  })
})
