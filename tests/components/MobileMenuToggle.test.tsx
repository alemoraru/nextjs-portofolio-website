import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MobileMenuToggle from "@/components/MobileMenuToggle"

describe("MobileMenuToggle", () => {
  it("renders the toggle button", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    const button = screen.getByRole("button")
    expect(button).toBeDefined()
  })

  it("displays 'Open menu' aria-label when closed", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    expect(screen.getByLabelText("Open menu")).toBeDefined()
  })

  it("displays 'Close menu' aria-label when open", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={true} onToggleAction={mockOnToggle} />)

    expect(screen.getByLabelText("Close menu")).toBeDefined()
  })

  it("has aria-expanded set to false when closed", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    const button = screen.getByRole("button")
    expect(button.getAttribute("aria-expanded")).toBe("false")
  })

  it("has aria-expanded set to true when open", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={true} onToggleAction={mockOnToggle} />)

    const button = screen.getByRole("button")
    expect(button.getAttribute("aria-expanded")).toBe("true")
  })

  it("calls onToggleAction when clicked", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    const button = screen.getByRole("button")
    fireEvent.mouseDown(button)

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it("calls onToggleAction on each click", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    const button = screen.getByRole("button")
    fireEvent.mouseDown(button)
    fireEvent.mouseDown(button)
    fireEvent.mouseDown(button)

    expect(mockOnToggle).toHaveBeenCalledTimes(3)
  })

  it("renders three hamburger bars (spans)", () => {
    const mockOnToggle = vi.fn()
    const { container } = render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    // Should have 3 motion.span elements for the hamburger icon
    const spans = container.querySelectorAll("span")
    expect(spans.length).toBe(3)
  })

  it("stops propagation on mouseDown event", () => {
    const mockOnToggle = vi.fn()
    const mockParentClick = vi.fn()

    render(
      <div onClick={mockParentClick}>
        <MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />
      </div>
    )

    const button = screen.getByRole("button")
    fireEvent.mouseDown(button)

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
    // Parent click should not be triggered due to stopPropagation
    expect(mockParentClick).not.toHaveBeenCalled()
  })
})
