import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import TableOfContents from "@/components/TableOfContents"

describe("TableOfContents", () => {
  /**
   * Helper function to create a mock article with various heading levels for testing.
   * This allows us to test the component's ability to find and render headings in the ToC.
   */
  const createMockArticle = () => {
    const article = document.createElement("article")

    const h1 = document.createElement("h1")
    h1.id = "heading-1"
    h1.textContent = "Introduction"
    article.appendChild(h1)

    const h2 = document.createElement("h2")
    h2.id = "heading-2"
    h2.textContent = "Getting Started"
    article.appendChild(h2)

    const h3 = document.createElement("h3")
    h3.id = "heading-3"
    h3.textContent = "Installation"
    article.appendChild(h3)

    const h2_2 = document.createElement("h2")
    h2_2.id = "heading-4"
    h2_2.textContent = "Configuration"
    article.appendChild(h2_2)

    document.body.appendChild(article)
    return article
  }

  beforeEach(() => {
    // Mock IntersectionObserver
    window.IntersectionObserver = class IntersectionObserver {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
      constructor() {}
    } as any

    // Mock window.scrollTo
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    document.body.innerHTML = ""
    vi.clearAllMocks()
  })

  it("renders nothing when no headings are found", () => {
    const { container } = render(<TableOfContents />)
    expect(container.firstChild).toBeNull()
  })

  it("renders table of contents when article with headings exists", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      expect(button).toBeDefined()
    })
  })

  it("displays horizontal lines for each heading", async () => {
    createMockArticle()
    const { container } = render(<TableOfContents />)

    await waitFor(() => {
      const lines = container.querySelectorAll(".h-0\\.5")
      expect(lines.length).toBe(4) // 4 headings
    })
  })

  it("toggle button is initially collapsed", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      expect(screen.queryByText("CONTENTS")).toBeNull()
    })
  })

  it("expands panel when toggle button is clicked", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(screen.getByText("CONTENTS")).toBeDefined()
    })
  })

  it("displays all headings in expanded panel", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      // Use getAllByText since headings appear both in article and ToC
      expect(screen.getAllByText("Introduction").length).toBeGreaterThan(1)
      expect(screen.getAllByText("Getting Started").length).toBeGreaterThan(1)
      expect(screen.getAllByText("Installation").length).toBeGreaterThan(1)
      expect(screen.getAllByText("Configuration").length).toBeGreaterThan(1)
    })
  })

  it("closes panel when toggle button is clicked again", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(screen.getByText("CONTENTS")).toBeDefined()
    })

    const button = screen.getByLabelText("Toggle table of contents")
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.queryByText("CONTENTS")).toBeNull()
    })
  })

  it("closes panel when clicking outside", async () => {
    createMockArticle()
    render(
      <div data-testid="outside">
        <TableOfContents />
      </div>
    )

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(screen.getByText("CONTENTS")).toBeDefined()
    })

    const outside = screen.getByTestId("outside")
    fireEvent.mouseDown(outside)

    await waitFor(() => {
      expect(screen.queryByText("CONTENTS")).toBeNull()
    })
  })

  it("does not close panel when clicking inside the panel", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      const panel = screen.getByText("CONTENTS").closest("div")
      if (panel) {
        fireEvent.mouseDown(panel)
      }
      expect(screen.queryByText("CONTENTS")).toBeDefined()
    })
  })

  it("scrolls to heading when heading is clicked", async () => {
    createMockArticle()
    const mockScrollTo = vi.fn()
    window.scrollTo = mockScrollTo

    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      // Get all "Getting Started" buttons and click the one in the ToC panel
      const headings = screen.getAllByText("Getting Started")
      const tocHeading = headings.find(el => el.tagName === "BUTTON")
      if (tocHeading) {
        fireEvent.click(tocHeading)
      }
    })

    expect(mockScrollTo).toHaveBeenCalled()
    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: "smooth",
      })
    )
  })

  it("closes panel after clicking a heading", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      // Get all "Getting Started" buttons and click the one in the ToC panel
      const headings = screen.getAllByText("Getting Started")
      const tocHeading = headings.find(el => el.tagName === "BUTTON")
      if (tocHeading) {
        fireEvent.click(tocHeading)
      }
    })

    await waitFor(() => {
      expect(screen.queryByText("CONTENTS")).toBeNull()
    })
  })

  it("excludes headings inside section elements", async () => {
    const article = document.createElement("article")

    const h2 = document.createElement("h2")
    h2.id = "main-heading"
    h2.textContent = "Main Heading"
    article.appendChild(h2)

    // Create a section with a heading that should be excluded
    const section = document.createElement("section")
    const sectionH2 = document.createElement("h2")
    sectionH2.id = "section-heading"
    sectionH2.textContent = "Section Heading"
    section.appendChild(sectionH2)
    article.appendChild(section)

    document.body.appendChild(article)

    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      // "Main Heading" should appear both in article and ToC
      expect(screen.getAllByText("Main Heading").length).toBeGreaterThan(1)
      // "Section Heading" should only appear once (in the section, not in ToC)
      const sectionHeadings = screen.queryAllByText("Section Heading")
      expect(sectionHeadings.length).toBe(1)
    })
  })

  it("assigns IDs to headings without IDs", async () => {
    const article = document.createElement("article")

    const h2 = document.createElement("h2")
    h2.textContent = "Heading Without ID"
    article.appendChild(h2)

    document.body.appendChild(article)

    render(<TableOfContents />)

    await waitFor(() => {
      expect(h2.id).toBeTruthy()
      expect(h2.id).toMatch(/heading-\d+/)
    })
  })

  it("renders heading text buttons in the expanded panel", async () => {
    createMockArticle()
    render(<TableOfContents />)

    await waitFor(() => {
      const button = screen.getByLabelText("Toggle table of contents")
      fireEvent.click(button)
    })

    await waitFor(() => {
      const allButtons = screen.getAllByRole("button")
      // Should have 5 buttons total: 1 toggle button + 4 heading buttons
      expect(allButtons.length).toBe(5)
    })
  })

  it("hides on mobile and tablet (lg breakpoint)", async () => {
    createMockArticle()
    const { container } = render(<TableOfContents />)

    await waitFor(() => {
      const button = container.querySelector("button")
      expect(button?.className).toContain("hidden")
      expect(button?.className).toContain("lg:block")
    })
  })
})
