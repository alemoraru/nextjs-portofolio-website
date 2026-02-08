import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import MobileMenu from "@/components/MobileMenu"
import { navItems } from "@/lib/constants"

describe("MobileMenu", () => {
  let mockSetIsOpen: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockSetIsOpen = vi.fn()
  })

  afterEach(() => {
    // Clean up body overflow style after each test
    document.body.style.overflow = ""
  })

  it("renders nothing when isOpen is false", () => {
    const { container } = render(<MobileMenu isOpen={false} setIsOpenAction={mockSetIsOpen} />)

    // AnimatePresence should not render the menu when closed
    expect(container.querySelector("ul")).toBeNull()
  })

  it("renders the menu when isOpen is true", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    const menu = screen.getByRole("list")
    expect(menu).toBeDefined()
  })

  it("renders all navigation items from navItems constant", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    navItems.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeDefined()
    })
  })

  it("renders navigation links with correct hrefs", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    navItems.forEach(({ name, path }) => {
      const link = screen.getByText(name).closest("a")
      expect(link?.getAttribute("href")).toBe(path)
    })
  })

  it("renders item numbers (01, 02, 03, 04) for each nav item", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    navItems.forEach((_, idx) => {
      const number = `0${idx + 1}`
      expect(screen.getByText(number)).toBeDefined()
    })
  })

  it("calls setIsOpenAction(false) when a link is clicked", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    const homeLink = screen.getByText("Home")
    fireEvent.click(homeLink)

    expect(mockSetIsOpen).toHaveBeenCalledWith(false)
  })

  it("calls setIsOpenAction(false) for each link click", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    const homeLink = screen.getByText("Home")
    const workLink = screen.getByText("Work")

    fireEvent.click(homeLink)
    fireEvent.click(workLink)

    expect(mockSetIsOpen).toHaveBeenCalledTimes(2)
    expect(mockSetIsOpen).toHaveBeenCalledWith(false)
  })

  it("sets body overflow to hidden when menu opens", () => {
    const { rerender } = render(<MobileMenu isOpen={false} setIsOpenAction={mockSetIsOpen} />)

    expect(document.body.style.overflow).toBe("")

    rerender(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    expect(document.body.style.overflow).toBe("hidden")
  })

  it("resets body overflow when menu closes", () => {
    const { rerender } = render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    expect(document.body.style.overflow).toBe("hidden")

    rerender(<MobileMenu isOpen={false} setIsOpenAction={mockSetIsOpen} />)

    expect(document.body.style.overflow).toBe("")
  })

  it("closes menu when clicking outside", () => {
    render(
      <div data-testid="outside">
        <MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />
      </div>
    )

    const outside = screen.getByTestId("outside")
    fireEvent.mouseDown(outside)

    expect(mockSetIsOpen).toHaveBeenCalledWith(false)
  })

  it("does not close menu when clicking inside the menu", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    const menu = screen.getByRole("list")
    fireEvent.mouseDown(menu)

    // Should not call setIsOpenAction when clicking inside
    expect(mockSetIsOpen).not.toHaveBeenCalled()
  })

  it("renders correct number of list items", () => {
    render(<MobileMenu isOpen={true} setIsOpenAction={mockSetIsOpen} />)

    const listItems = screen.getAllByRole("listitem")
    expect(listItems.length).toBe(navItems.length)
  })
})
