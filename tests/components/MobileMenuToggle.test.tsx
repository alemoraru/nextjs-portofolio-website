import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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

    fireEvent.click(screen.getByRole("button"))

    expect(mockOnToggle).toHaveBeenCalledTimes(1)
  })

  it("calls onToggleAction on each click", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    const button = screen.getByRole("button")
    fireEvent.click(button)
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockOnToggle).toHaveBeenCalledTimes(3)
  })

  it("toggles from the keyboard with Enter and Space", async () => {
    const user = userEvent.setup()
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    await user.tab()
    expect(document.activeElement).toBe(screen.getByRole("button"))

    await user.keyboard("{Enter}")
    expect(mockOnToggle).toHaveBeenCalledTimes(1)

    await user.keyboard(" ")
    expect(mockOnToggle).toHaveBeenCalledTimes(2)
  })

  it("does not toggle on mouse down alone (it waits for the click)", () => {
    const mockOnToggle = vi.fn()
    render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    fireEvent.mouseDown(screen.getByRole("button"))

    expect(mockOnToggle).not.toHaveBeenCalled()
  })

  it("is a plain button that won't submit a surrounding form", () => {
    render(<MobileMenuToggle isOpen={false} onToggleAction={vi.fn()} />)
    expect(screen.getByRole("button").getAttribute("type")).toBe("button")
  })

  it("renders three hamburger bars (spans)", () => {
    const mockOnToggle = vi.fn()
    const { container } = render(<MobileMenuToggle isOpen={false} onToggleAction={mockOnToggle} />)

    // Should have 3 motion.span elements for the hamburger icon
    const spans = container.querySelectorAll("span")
    expect(spans.length).toBe(3)
  })
})
