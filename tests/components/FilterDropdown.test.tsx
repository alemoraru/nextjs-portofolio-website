import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FilterDropdown from "@/components/FilterDropdown"

describe("FilterDropdown", () => {
  const mockItems = [
    { name: "React", count: 5 },
    { name: "TypeScript", count: 3 },
    { name: "Next.js", count: 2 },
    { name: "Tailwind", count: 4 },
  ]

  const defaultProps = {
    items: mockItems,
    selectedItems: [],
    onToggle: vi.fn(),
    onApply: vi.fn(),
    onClear: vi.fn(),
    placeholder: "Filter by tags",
    resultCount: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the dropdown button", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    expect(button).toBeDefined()
  })

  it("displays placeholder when no items are selected", () => {
    render(<FilterDropdown {...defaultProps} />)

    expect(screen.getByText("Filter by tags")).toBeDefined()
  })

  it("displays selected count when items are selected", () => {
    render(<FilterDropdown {...defaultProps} selectedItems={["React", "TypeScript"]} />)

    expect(screen.getByText("2 Selected")).toBeDefined()
  })

  it("displays result count badge when resultCount > 0", () => {
    render(<FilterDropdown {...defaultProps} resultCount={5} />)

    expect(screen.getByText("5")).toBeDefined()
  })

  it("dropdown is initially closed", () => {
    render(<FilterDropdown {...defaultProps} />)

    expect(screen.queryByText("Apply")).toBeNull()
    expect(screen.queryByText("Clear")).toBeNull()
  })

  it("opens dropdown when button is clicked", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    expect(screen.getByText("Apply")).toBeDefined()
    expect(screen.getByText("Clear")).toBeDefined()
  })

  it("closes dropdown when button is clicked again", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })

    fireEvent.click(button)
    expect(screen.queryByText("Apply")).toBeDefined()

    fireEvent.click(button)
    expect(screen.queryByText("Apply")).toBeNull()
  })

  it("renders all filter items with their counts", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    expect(screen.getByText(/React/)).toBeDefined()
    expect(screen.getByText("(5)")).toBeDefined()
    expect(screen.getByText(/TypeScript/)).toBeDefined()
    expect(screen.getByText("(3)")).toBeDefined()
    expect(screen.getByText(/Next.js/)).toBeDefined()
    expect(screen.getByText("(2)")).toBeDefined()
    expect(screen.getByText(/Tailwind/)).toBeDefined()
    expect(screen.getByText("(4)")).toBeDefined()
  })

  it("renders checkboxes for all items", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes.length).toBe(mockItems.length)
  })

  it("calls onToggle when a checkbox is clicked", () => {
    const mockOnToggle = vi.fn()
    render(<FilterDropdown {...defaultProps} onToggle={mockOnToggle} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const reactCheckbox = screen.getAllByRole("checkbox")[0]
    fireEvent.click(reactCheckbox)

    expect(mockOnToggle).toHaveBeenCalledWith("React")
    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it("calls onToggle for each checkbox click", () => {
    const mockOnToggle = vi.fn()
    render(<FilterDropdown {...defaultProps} onToggle={mockOnToggle} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])

    expect(mockOnToggle).toHaveBeenCalledTimes(2)
  })

  it("calls onApply when Apply button is clicked", () => {
    const mockOnApply = vi.fn()
    render(<FilterDropdown {...defaultProps} onApply={mockOnApply} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const applyButton = screen.getByText("Apply")
    fireEvent.click(applyButton)

    expect(mockOnApply).toHaveBeenCalledTimes(1)
  })

  it("closes dropdown after Apply is clicked", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const applyButton = screen.getByText("Apply")
    fireEvent.click(applyButton)

    expect(screen.queryByText("Apply")).toBeNull()
  })

  it("calls onClear when Clear button is clicked", () => {
    const mockOnClear = vi.fn()
    render(<FilterDropdown {...defaultProps} onClear={mockOnClear} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const clearButton = screen.getByText("Clear")
    fireEvent.click(clearButton)

    expect(mockOnClear).toHaveBeenCalledTimes(1)
  })

  it("does not close dropdown after Clear is clicked", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const clearButton = screen.getByText("Clear")
    fireEvent.click(clearButton)

    // Dropdown should still be open
    expect(screen.queryByText("Apply")).toBeDefined()
  })

  it("closes dropdown when clicking outside", () => {
    render(
      <div data-testid="outside">
        <FilterDropdown {...defaultProps} />
      </div>
    )

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    expect(screen.queryByText("Apply")).toBeDefined()

    const outside = screen.getByTestId("outside")
    fireEvent.mouseDown(outside)

    expect(screen.queryByText("Apply")).toBeNull()
  })

  it("does not close dropdown when clicking inside", () => {
    const { container } = render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    const dropdown = container.querySelector(".relative")
    if (dropdown) {
      fireEvent.mouseDown(dropdown)
    }

    expect(screen.queryByText("Apply")).toBeDefined()
  })

  it("closes dropdown when Escape key is pressed", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)

    expect(screen.queryByText("Apply")).toBeDefined()

    fireEvent.keyDown(document, { key: "Escape" })

    expect(screen.queryByText("Apply")).toBeNull()
  })

  it("displays result count badge with correct title attribute", () => {
    render(<FilterDropdown {...defaultProps} resultCount={7} />)

    const badge = screen.getByText("7")
    expect(badge.getAttribute("title")).toBe("7 results")
  })
})
