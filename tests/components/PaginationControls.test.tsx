import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import PaginationControls from "@/components/PaginationControls"

/**
 * Returns the page-number elements (links or the current-page span), in DOM order. Each reads
 * as "Page N": a visually hidden "Page " followed by the visible number.
 */
const getPageNumbers = () => {
  const nav = screen.getByRole("navigation", { name: /pagination/i })
  return Array.from(nav.querySelectorAll("a, span")).filter(el =>
    /^Page \d+$/.test(el.textContent ?? "")
  )
}

/** The visible numbers of the page items. */
const getPageLabels = () => getPageNumbers().map(el => el.textContent?.replace("Page ", ""))

describe("PaginationControls", () => {
  describe("visibility", () => {
    it("renders nothing when there is only one page", () => {
      render(<PaginationControls currentPage={1} totalPages={1} baseUrl="/blog" />)
      expect(screen.queryByRole("navigation")).toBeNull()
    })

    it("renders nothing when there are no pages", () => {
      render(<PaginationControls currentPage={1} totalPages={0} baseUrl="/blog" />)
      expect(screen.queryByRole("navigation")).toBeNull()
    })

    it("renders an accessible pagination nav when there are multiple pages", () => {
      render(<PaginationControls currentPage={1} totalPages={3} baseUrl="/blog" />)
      expect(screen.getByRole("navigation", { name: /pagination/i })).toBeDefined()
    })

    it("pins itself to the bottom of its flex parent and wraps on small screens", () => {
      render(<PaginationControls currentPage={1} totalPages={3} baseUrl="/blog" />)
      const nav = screen.getByRole("navigation", { name: /pagination/i })
      expect(nav.className).toContain("mt-auto")
      expect(nav.className).toContain("flex-wrap")
    })
  })

  describe("page numbers", () => {
    it("shows every page when there are only a few", () => {
      render(<PaginationControls currentPage={1} totalPages={3} baseUrl="/blog" />)
      expect(getPageLabels()).toEqual(["1", "2", "3"])
    })

    it("shows the first and last page plus neighbours of the current page", () => {
      render(<PaginationControls currentPage={5} totalPages={10} baseUrl="/blog" />)
      expect(getPageLabels()).toEqual(["1", "4", "5", "6", "10"])
    })

    it("shows ellipses on both sides when the current page is in the middle", () => {
      render(<PaginationControls currentPage={5} totalPages={10} baseUrl="/blog" />)
      expect(screen.getAllByText("···")).toHaveLength(2)
    })

    it("shows only a right ellipsis near the start", () => {
      render(<PaginationControls currentPage={1} totalPages={10} baseUrl="/blog" />)
      expect(getPageLabels()).toEqual(["1", "2", "10"])
      expect(screen.getAllByText("···")).toHaveLength(1)
    })

    it("shows only a left ellipsis near the end", () => {
      render(<PaginationControls currentPage={10} totalPages={10} baseUrl="/blog" />)
      expect(getPageLabels()).toEqual(["1", "9", "10"])
      expect(screen.getAllByText("···")).toHaveLength(1)
    })

    it("shows no ellipses when the pages are adjacent to the current page", () => {
      render(<PaginationControls currentPage={2} totalPages={4} baseUrl="/blog" />)
      expect(screen.queryByText("···")).toBeNull()
    })

    it("marks only the current page with aria-current", () => {
      render(<PaginationControls currentPage={5} totalPages={10} baseUrl="/blog" />)
      const current = getPageNumbers().filter(el => el.getAttribute("aria-current") === "page")
      expect(current).toHaveLength(1)
      expect(current[0].textContent).toBe("Page 5")
    })

    it('reads every page number as "Page N"', () => {
      render(<PaginationControls currentPage={1} totalPages={3} baseUrl="/blog" />)
      expect(screen.getByRole("link", { name: "Page 2" })).toBeDefined()
      expect(screen.getByRole("link", { name: "Page 3" })).toBeDefined()
    })

    it("marks the first page as current on page 1, as text rather than a link", () => {
      render(<PaginationControls currentPage={1} totalPages={5} baseUrl="/blog" />)
      expect(screen.queryByRole("link", { name: "Page 1" })).toBeNull()
      expect(getPageNumbers()[0].getAttribute("aria-current")).toBe("page")
    })

    it("marks the last page as current on the last page, as text rather than a link", () => {
      render(<PaginationControls currentPage={5} totalPages={5} baseUrl="/blog" />)
      expect(screen.queryByRole("link", { name: "Page 5" })).toBeNull()
      expect(getPageNumbers().at(-1)?.getAttribute("aria-current")).toBe("page")
    })

    it("renders the current page in the middle as a non-link", () => {
      render(<PaginationControls currentPage={5} totalPages={10} baseUrl="/blog" />)
      expect(screen.queryByRole("link", { name: "Page 5" })).toBeNull()
    })
  })

  describe("previous and next buttons", () => {
    it("has no previous link on the first page (just a greyed-out arrow)", () => {
      const { container } = render(
        <PaginationControls currentPage={1} totalPages={3} baseUrl="/blog" />
      )
      expect(screen.queryByRole("link", { name: /previous page/i })).toBeNull()
      const placeholder = container.querySelector('nav > span[aria-hidden="true"]')
      expect(placeholder?.className).toContain("opacity-40")
    })

    it("links the previous arrow after the first page", () => {
      render(<PaginationControls currentPage={2} totalPages={3} baseUrl="/blog" />)
      expect(screen.getByRole("link", { name: /previous page/i })).toBeDefined()
    })

    it("has no next link on the last page (just a greyed-out arrow)", () => {
      render(<PaginationControls currentPage={3} totalPages={3} baseUrl="/blog" />)
      expect(screen.queryByRole("link", { name: /next page/i })).toBeNull()
    })

    it("links the next arrow before the last page", () => {
      render(<PaginationControls currentPage={2} totalPages={3} baseUrl="/blog" />)
      expect(screen.getByRole("link", { name: /next page/i })).toBeDefined()
    })

    it("keeps keyboard focus off items that go nowhere", () => {
      const { container } = render(
        <PaginationControls currentPage={1} totalPages={3} baseUrl="/blog" />
      )
      // Only links are focusable: page 2, page 3 and Next (not the current page or Previous)
      expect(container.querySelectorAll("a")).toHaveLength(3)
    })

    it("links previous and next to the adjacent pages", () => {
      render(<PaginationControls currentPage={3} totalPages={5} baseUrl="/blog" />)
      expect(screen.getByRole("link", { name: /previous page/i }).getAttribute("href")).toBe(
        "/blog?page=2"
      )
      expect(screen.getByRole("link", { name: /next page/i }).getAttribute("href")).toBe(
        "/blog?page=4"
      )
    })

    it("does not link past the first or last page", () => {
      const { container, unmount } = render(
        <PaginationControls currentPage={1} totalPages={3} baseUrl="/blog" />
      )
      const hrefs = () =>
        Array.from(container.querySelectorAll("a")).map(a => a.getAttribute("href"))
      expect(hrefs()).not.toContain("/blog?page=0")
      unmount()

      render(<PaginationControls currentPage={3} totalPages={3} baseUrl="/blog" />)
      expect(screen.queryByRole("link", { name: /next page/i })).toBeNull()
    })
  })

  describe("URLs", () => {
    it("omits the page param for page 1", () => {
      render(<PaginationControls currentPage={2} totalPages={3} baseUrl="/work" />)
      expect(screen.getByRole("link", { name: "Page 1" }).getAttribute("href")).toBe("/work")
    })

    it("sets the page param for pages after the first", () => {
      render(<PaginationControls currentPage={1} totalPages={3} baseUrl="/work" />)
      expect(screen.getByRole("link", { name: "Page 2" }).getAttribute("href")).toBe("/work?page=2")
      expect(screen.getByRole("link", { name: "Page 3" }).getAttribute("href")).toBe("/work?page=3")
    })

    it("preserves other query params on every link", () => {
      render(
        <PaginationControls
          currentPage={2}
          totalPages={3}
          baseUrl="/projects"
          searchParams={{ sort: "newest" }}
        />
      )
      expect(screen.getByRole("link", { name: "Page 1" }).getAttribute("href")).toBe(
        "/projects?sort=newest"
      )
      expect(screen.getByRole("link", { name: "Page 3" }).getAttribute("href")).toBe(
        "/projects?sort=newest&page=3"
      )
      expect(screen.getByRole("link", { name: /next page/i }).getAttribute("href")).toBe(
        "/projects?sort=newest&page=3"
      )
    })

    it("preserves repeated query params", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={2}
          baseUrl="/blog"
          searchParams={{ tags: ["react", "css"] }}
        />
      )
      expect(screen.getByRole("link", { name: "Page 2" }).getAttribute("href")).toBe(
        "/blog?tags=react&tags=css&page=2"
      )
    })

    it("replaces an existing page param instead of duplicating it", () => {
      render(
        <PaginationControls
          currentPage={2}
          totalPages={3}
          baseUrl="/blog"
          searchParams={{ page: "2", sort: "asc" }}
        />
      )
      expect(screen.getByRole("link", { name: "Page 3" }).getAttribute("href")).toBe(
        "/blog?sort=asc&page=3"
      )
      expect(screen.getByRole("link", { name: "Page 1" }).getAttribute("href")).toBe(
        "/blog?sort=asc"
      )
    })

    it("ignores undefined query params", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={2}
          baseUrl="/blog"
          searchParams={{ sort: undefined }}
        />
      )
      expect(screen.getByRole("link", { name: "Page 2" }).getAttribute("href")).toBe("/blog?page=2")
    })
  })
})
