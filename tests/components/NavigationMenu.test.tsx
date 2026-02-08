import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import NavigationMenu from "@/components/NavigationMenu"
import { navItems } from "@/lib/constants"

// Mock usePathname to return different values for different tests
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation")
  return {
    ...actual,
    usePathname: vi.fn(() => "/"),
  }
})

describe("NavigationMenu", () => {
  it("renders the navigation menu", () => {
    render(<NavigationMenu />)

    const nav = screen.getByRole("navigation")
    expect(nav).toBeDefined()
  })

  it("renders all navigation items from navItems constant", () => {
    render(<NavigationMenu />)

    navItems.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeDefined()
    })
  })

  it("renders navigation links with correct hrefs", () => {
    render(<NavigationMenu />)

    navItems.forEach(({ name, path }) => {
      const link = screen.getByText(name).closest("a")
      expect(link?.getAttribute("href")).toBe(path)
    })
  })

  it("renders the correct number of navigation items", () => {
    render(<NavigationMenu />)

    const links = screen.getAllByRole("link")
    expect(links.length).toBe(navItems.length)
  })

  it("marks the current page with aria-current='page'", () => {
    render(<NavigationMenu />)

    // With pathname mocked to "/", Home should be active
    const homeLink = screen.getByText("Home").closest("a")
    expect(homeLink?.getAttribute("aria-current")).toBe("page")
  })

  it("only marks one item as current page", () => {
    render(<NavigationMenu />)

    const links = screen.getAllByRole("link")
    const currentPageLinks = links.filter(link => link.getAttribute("aria-current") === "page")

    expect(currentPageLinks.length).toBe(1)
  })

  it("has tabIndex={0} on all navigation links", () => {
    render(<NavigationMenu />)

    const links = screen.getAllByRole("link")
    links.forEach(link => {
      expect(link.getAttribute("tabindex")).toBe("0")
    })
  })

  it("hides on mobile with md:hidden class", () => {
    render(<NavigationMenu />)

    const nav = screen.getByRole("navigation")
    expect(nav.className).toContain("hidden")
    expect(nav.className).toContain("md:block")
  })
})
