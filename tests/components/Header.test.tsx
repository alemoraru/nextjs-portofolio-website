import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { AccentThemeProvider } from "@/components/AccentThemeProvider"
import Header from "@/components/Header"
import { PageHeaderProvider } from "@/components/PageHeaderProvider"
import { homeIntroConfig } from "@/data/content"
import { getInitials } from "@/lib/utils"

// Header renders ThemeToggleButton, which reads accent theme state via `useAccentTheme()`,
// and reads the current detail page's title/subtitle via `usePageHeader()`, so it must be
// rendered within both an `AccentThemeProvider` and a `PageHeaderProvider`.
function renderHeader() {
  return render(
    <AccentThemeProvider>
      <PageHeaderProvider>
        <Header />
      </PageHeaderProvider>
    </AccentThemeProvider>
  )
}

describe("Header", () => {
  it("renders the header element with the correct id", () => {
    renderHeader()
    const header = document.getElementById("headerPortfolio")
    expect(header).not.toBeNull()
    expect(header?.tagName).toBe("HEADER")
  })

  it("renders the site name from breadcrumbs", () => {
    renderHeader()
    expect(screen.getByText(homeIntroConfig.name)).toBeDefined()
  })

  it("renders the initials for mobile breadcrumbs", () => {
    renderHeader()
    const initials = getInitials(homeIntroConfig.name)
    expect(screen.getByText(initials)).toBeDefined()
  })

  it("renders navigation items", () => {
    renderHeader()
    // "Home" isn't part of the desktop nav - the site name/initials link already covers it
    expect(screen.getByText("Work")).toBeDefined()
    expect(screen.getByText("Projects")).toBeDefined()
    expect(screen.getByText("Blog")).toBeDefined()
  })

  it("renders navigation links with correct hrefs", () => {
    renderHeader()
    const workLink = screen.getByText("Work").closest("a")
    const projectsLink = screen.getByText("Projects").closest("a")
    const blogLink = screen.getByText("Blog").closest("a")

    expect(workLink?.getAttribute("href")).toBe("/work")
    expect(projectsLink?.getAttribute("href")).toBe("/projects")
    expect(blogLink?.getAttribute("href")).toBe("/blog")
  })

  it("renders the theme toggle button", () => {
    renderHeader()
    const themeButton = screen.getByLabelText(/switch to dark mode/i)
    expect(themeButton).toBeDefined()
  })

  it("renders the mobile menu toggle button", () => {
    renderHeader()
    const menuButton = screen.getByLabelText("Open menu")
    expect(menuButton).toBeDefined()
  })

  it("toggles the mobile menu toggle aria-label on click", () => {
    renderHeader()
    const menuButton = screen.getByLabelText("Open menu")

    // The button uses onMouseDown, so fire that event
    fireEvent.mouseDown(menuButton)

    // After toggle, the aria-label should change
    expect(screen.getByLabelText("Close menu")).toBeDefined()
  })

  it("does not mark any navigation item as active on the home page", () => {
    renderHeader()
    // With pathname mocked to "/", no desktop nav item should be active since "Home" isn't
    // one of them
    const links = screen.getAllByRole("link")
    const currentPageLinks = links.filter(link => link.getAttribute("aria-current") === "page")
    expect(currentPageLinks.length).toBe(0)
  })
})
