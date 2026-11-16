import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, vi } from "vitest"
import ShareButton from "@/components/ShareButton"

const URL = "https://example.com/blog/my-post"
const TITLE = "My Post & More"

describe("ShareButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true })
  })

  it("keeps the popover closed until clicked", () => {
    render(<ShareButton url={URL} title={TITLE} />)
    expect(screen.queryByText("LinkedIn")).toBeNull()
  })

  it("opens a popover with LinkedIn, X, Email and copy options", () => {
    render(<ShareButton url={URL} title={TITLE} />)
    fireEvent.click(screen.getByRole("button", { name: /share/i }))

    const linkedin = screen.getByRole("link", { name: /linkedin/i })
    expect(linkedin.getAttribute("href")).toContain(encodeURIComponent(URL))
    expect(linkedin.getAttribute("target")).toBe("_blank")
    expect(screen.getByRole("link", { name: /x \(twitter\)/i }).getAttribute("href")).toContain(
      encodeURIComponent(TITLE)
    )
    expect(screen.getByRole("link", { name: /email/i }).getAttribute("href")).toMatch(/^mailto:/)
    expect(screen.getByRole("button", { name: /copy link/i })).toBeDefined()
  })

  it("tells screen readers which share links open in a new tab", () => {
    render(<ShareButton url={URL} title={TITLE} />)
    fireEvent.click(screen.getByRole("button", { name: /share/i }))

    expect(screen.getByRole("link", { name: "LinkedIn (opens in a new tab)" })).toBeDefined()
    expect(screen.getByRole("link", { name: "X (Twitter) (opens in a new tab)" })).toBeDefined()
    // Email opens the mail app in place, so it gets no hint
    expect(screen.getByRole("link", { name: "Email" })).toBeDefined()
  })

  it("closes on Escape", async () => {
    render(<ShareButton url={URL} title={TITLE} />)
    fireEvent.click(screen.getByRole("button", { name: /share/i }))
    fireEvent.keyDown(document, { key: "Escape" })
    await waitFor(() => expect(screen.queryByText("LinkedIn")).toBeNull())
  })

  it("copies the link and confirms", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })

    render(<ShareButton url={URL} title={TITLE} />)
    fireEvent.click(screen.getByRole("button", { name: /share/i }))
    fireEvent.click(screen.getByRole("button", { name: /copy link/i }))

    await waitFor(() => expect(screen.getByText("Link copied!")).toBeDefined())
    expect(writeText).toHaveBeenCalledWith(URL)
  })
})
