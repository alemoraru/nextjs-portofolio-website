import { render, screen, fireEvent, act, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import BackToTopButton from "@/components/BackToTopButton"

/**
 * Drives the window scroll position and dispatches the matching scroll event.
 * The component listens via `requestAnimationFrame`, which jsdom runs on a timer,
 * so callers await a microtask/timer flush afterwards.
 */
const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", { value, configurable: true, writable: true })
  fireEvent.scroll(window)
}

describe("BackToTopButton", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("is hidden when the page is at the top", () => {
    render(<BackToTopButton />)
    expect(screen.queryByRole("button", { name: /back to top/i })).toBeNull()
  })

  it("appears after scrolling past the threshold", async () => {
    render(<BackToTopButton />)

    act(() => setScrollY(800))

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back to top/i })).toBeDefined()
    })
  })

  it("smoothly scrolls to the top when clicked", async () => {
    render(<BackToTopButton />)

    act(() => setScrollY(800))
    const button = await screen.findByRole("button", { name: /back to top/i })
    fireEvent.click(button)

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" })
  })
})
