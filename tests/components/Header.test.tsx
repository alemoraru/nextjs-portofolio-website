import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Header from "@/components/Header"
import { homeIntroConfig } from "@/data/content"

// Generate initials from a name (same logic as Breadcrumbs component)
function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
}

describe("Header", () => {
  it("renders the header element with the correct id", () => {
    render(<Header />)
    const header = document.getElementById("headerPortfolio")
    expect(header).not.toBeNull()
    expect(header?.tagName).toBe("HEADER")
  })

  it("renders the site name from breadcrumbs", () => {
    render(<Header />)
    expect(screen.getByText(homeIntroConfig.name)).toBeDefined()
  })

  it("renders the initials for mobile breadcrumbs", () => {
    render(<Header />)
    const initials = getInitials(homeIntroConfig.name)
    expect(screen.getByText(initials)).toBeDefined()
  })

  it("renders navigation items", () => {
    render(<Header />)
    expect(screen.getByText("Home")).toBeDefined()
    expect(screen.getByText("Work")).toBeDefined()
    expect(screen.getByText("Projects")).toBeDefined()
    expect(screen.getByText("Blog")).toBeDefined()
  })

  it("renders navigation links with correct hrefs", () => {
    render(<Header />)
    const homeLink = screen.getByText("Home").closest("a")
    const workLink = screen.getByText("Work").closest("a")
    const projectsLink = screen.getByText("Projects").closest("a")
    const blogLink = screen.getByText("Blog").closest("a")

    expect(homeLink?.getAttribute("href")).toBe("/")
    expect(workLink?.getAttribute("href")).toBe("/work")
    expect(projectsLink?.getAttribute("href")).toBe("/projects")
    expect(blogLink?.getAttribute("href")).toBe("/blog")
  })

  it("renders the theme toggle button", () => {
    render(<Header />)
    const themeButton = screen.getByLabelText("Switch to dark mode")
    expect(themeButton).toBeDefined()
  })

  it("renders the mobile menu toggle button", () => {
    render(<Header />)
    const menuButton = screen.getByLabelText("Open menu")
    expect(menuButton).toBeDefined()
  })

  it("toggles the mobile menu toggle aria-label on click", () => {
    render(<Header />)
    const menuButton = screen.getByLabelText("Open menu")

    // The button uses onMouseDown, so fire that event
    fireEvent.mouseDown(menuButton)

    // After toggle, the aria-label should change
    expect(screen.getByLabelText("Close menu")).toBeDefined()
  })

  it("marks the current page as active in the navigation", () => {
    render(<Header />)
    // With pathname mocked to "/", Home should have aria-current="page"
    const homeLink = screen.getByText("Home").closest("a")
    expect(homeLink?.getAttribute("aria-current")).toBe("page")
  })
})
