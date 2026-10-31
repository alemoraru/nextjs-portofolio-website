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
    appliedCount: 0,
    onToggle: vi.fn(),
    onApply: vi.fn(),
    onClear: vi.fn(),
    label: "Filter by tags",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the dropdown button", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    expect(button).toBeDefined()
  })

  it("displays its label", () => {
    render(<FilterDropdown {...defaultProps} />)

    expect(screen.getByText("Filter by tags")).toBeDefined()
  })

  it("displays the applied count, not unapplied ticks", () => {
    render(<FilterDropdown {...defaultProps} selectedItems={["React", "TypeScript"]} />)
    expect(screen.queryByText("2")).toBeNull()

    render(<FilterDropdown {...defaultProps} appliedCount={2} />)
    expect(screen.getByTitle("2 applied").textContent).toBe("2")
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
    expect(screen.getByText("5")).toBeDefined()
    expect(screen.getByText(/TypeScript/)).toBeDefined()
    expect(screen.getByText("3")).toBeDefined()
    expect(screen.getByText(/Next.js/)).toBeDefined()
    expect(screen.getByText("2")).toBeDefined()
    expect(screen.getByText(/Tailwind/)).toBeDefined()
    expect(screen.getByText("4")).toBeDefined()
  })

  it("narrows the list to items matching the search", () => {
    render(<FilterDropdown {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: /Filter by tags/i }))
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "type" } })

    expect(screen.getAllByRole("checkbox").length).toBe(1)
    expect(screen.getByText("TypeScript")).toBeDefined()
  })

  it("shows a message when the search matches nothing", () => {
    render(<FilterDropdown {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: /Filter by tags/i }))
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "zzz" } })

    expect(screen.getByText("No matches")).toBeDefined()
  })

  it("resets the search when reopened", () => {
    render(<FilterDropdown {...defaultProps} />)

    const button = screen.getByRole("button", { name: /Filter by tags/i })
    fireEvent.click(button)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "type" } })
    fireEvent.click(button)
    fireEvent.click(button)

    expect(screen.getAllByRole("checkbox").length).toBe(mockItems.length)
  })

  it("calls onDismiss when closed without applying", () => {
    const mockOnDismiss = vi.fn()
    render(<FilterDropdown {...defaultProps} onDismiss={mockOnDismiss} />)

    fireEvent.click(screen.getByRole("button", { name: /Filter by tags/i }))
    fireEvent.keyDown(document, { key: "Escape" })

    expect(mockOnDismiss).toHaveBeenCalledTimes(1)
  })

  it("does not call onDismiss when applying", () => {
    const mockOnDismiss = vi.fn()
    render(<FilterDropdown {...defaultProps} onDismiss={mockOnDismiss} />)

    fireEvent.click(screen.getByRole("button", { name: /Filter by tags/i }))
    fireEvent.click(screen.getByText("Apply"))

    expect(mockOnDismiss).not.toHaveBeenCalled()
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
})
