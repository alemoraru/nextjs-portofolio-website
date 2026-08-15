import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import NavigationMenu from "@/components/NavigationMenu"
import { desktopNavItems } from "@/lib/constants"

const mockUsePathname = vi.fn(() => "/")

// Mock usePathname to return different values for different tests
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation")
  return {
    ...actual,
    usePathname: () => mockUsePathname(),
  }
})

describe("NavigationMenu", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/")
  })

  it("renders the navigation menu", () => {
    render(<NavigationMenu />)

    const nav = screen.getByRole("navigation")
    expect(nav).toBeDefined()
  })

  it("renders all navigation items from desktopNavItems constant", () => {
    render(<NavigationMenu />)

    desktopNavItems.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeDefined()
    })
  })

  it("renders navigation links with correct hrefs", () => {
    render(<NavigationMenu />)

    desktopNavItems.forEach(({ name, path }) => {
      const link = screen.getByText(name).closest("a")
      expect(link?.getAttribute("href")).toBe(path)
    })
  })

  it("renders the correct number of navigation items", () => {
    render(<NavigationMenu />)

    const links = screen.getAllByRole("link")
    expect(links.length).toBe(desktopNavItems.length)
  })

  it("does not mark any item as active on the home page", () => {
    render(<NavigationMenu />)

    // "Home" isn't part of the desktop nav (the header's name link covers it), so no pill
    // item should be active while on "/"
    const links = screen.getAllByRole("link")
    const currentPageLinks = links.filter(link => link.getAttribute("aria-current") === "page")

    expect(currentPageLinks.length).toBe(0)
  })

  it("marks the current page with aria-current='page'", () => {
    mockUsePathname.mockReturnValue("/work")
    render(<NavigationMenu />)

    const workLink = screen.getByText("Work").closest("a")
    expect(workLink?.getAttribute("aria-current")).toBe("page")
  })

  it("only marks one item as current page", () => {
    mockUsePathname.mockReturnValue("/work")
    render(<NavigationMenu />)

    const links = screen.getAllByRole("link")
    const currentPageLinks = links.filter(link => link.getAttribute("aria-current") === "page")

    expect(currentPageLinks.length).toBe(1)
  })

  it("marks the parent item as active for a nested subroute", () => {
    mockUsePathname.mockReturnValue("/work/foo")
    render(<NavigationMenu />)

    const workLink = screen.getByText("Work").closest("a")
    expect(workLink?.getAttribute("aria-current")).toBe("page")

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
