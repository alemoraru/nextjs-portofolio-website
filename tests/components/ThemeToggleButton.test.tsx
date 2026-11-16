import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { afterEach, describe, it, expect, vi } from "vitest"
import { AccentThemeProvider } from "@/components/AccentThemeProvider"
import ThemeToggleButton from "@/components/ThemeToggleButton"

// Mock next-themes to provide different theme states
vi.mock("next-themes", async () => {
  const actual = await vi.importActual("next-themes")
  return {
    ...actual,
    useTheme: vi.fn(() => ({
      resolvedTheme: "light",
      setTheme: vi.fn(),
    })),
  }
})

/**
 * ThemeToggleButton reads accent theme state via `useAccentTheme()`, so it must be
 * rendered within an `AccentThemeProvider`.
 */
function renderThemeToggleButton() {
  return render(
    <AccentThemeProvider>
      <ThemeToggleButton />
    </AccentThemeProvider>
  )
}

const getToggleButton = () => screen.getByRole("button", { name: /switch to (dark|light) mode/i })

describe("ThemeToggleButton", () => {
  it("renders the component", () => {
    const { container } = renderThemeToggleButton()

    // Component should render
    expect(container.firstChild).not.toBeNull()
  })

  it("renders the toggle button after mounting", async () => {
    renderThemeToggleButton()

    await waitFor(() => {
      expect(getToggleButton()).toBeDefined()
    })
  })

  it("displays correct aria-label for light theme", async () => {
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme: vi.fn(),
      theme: "light",
      themes: ["light", "dark"],
      systemTheme: "light",
      forcedTheme: undefined,
    })

    renderThemeToggleButton()

    await waitFor(() => {
      expect(screen.getByLabelText(/switch to dark mode/i)).toBeDefined()
    })
  })

  it("displays correct aria-label for dark theme", async () => {
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "dark",
      setTheme: vi.fn(),
      theme: "dark",
      themes: ["light", "dark"],
      systemTheme: "dark",
      forcedTheme: undefined,
    })

    renderThemeToggleButton()

    await waitFor(() => {
      expect(screen.getByLabelText(/switch to light mode/i)).toBeDefined()
    })
  })

  it("calls setTheme with 'dark' when in light mode", async () => {
    const mockSetTheme = vi.fn()
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme: mockSetTheme,
      theme: "light",
      themes: ["light", "dark"],
      systemTheme: "light",
      forcedTheme: undefined,
    })

    renderThemeToggleButton()

    await waitFor(() => {
      fireEvent.click(getToggleButton())
    })

    expect(mockSetTheme).toHaveBeenCalledWith("dark")
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it("calls setTheme with 'light' when in dark mode", async () => {
    const mockSetTheme = vi.fn()
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
      theme: "dark",
      themes: ["light", "dark"],
      systemTheme: "dark",
      forcedTheme: undefined,
    })

    renderThemeToggleButton()

    await waitFor(() => {
      fireEvent.click(getToggleButton())
    })

    expect(mockSetTheme).toHaveBeenCalledWith("light")
    expect(mockSetTheme).toHaveBeenCalledTimes(1)
  })

  it("renders sun icon when in dark mode", async () => {
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "dark",
      setTheme: vi.fn(),
      theme: "dark",
      themes: ["light", "dark"],
      systemTheme: "dark",
      forcedTheme: undefined,
    })

    const { container } = renderThemeToggleButton()

    await waitFor(() => {
      // Check for SVG icon (sun icon should be present)
      const icon = container.querySelector("svg")
      expect(icon).not.toBeNull()
    })
  })

  it("renders moon icon when in light mode", async () => {
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme: vi.fn(),
      theme: "light",
      themes: ["light", "dark"],
      systemTheme: "light",
      forcedTheme: undefined,
    })

    const { container } = renderThemeToggleButton()

    await waitFor(() => {
      // Check for SVG icon (moon icon should be present)
      const icon = container.querySelector("svg")
      expect(icon).not.toBeNull()
    })
  })

  it("button is clickable multiple times", async () => {
    const mockSetTheme = vi.fn()
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme: mockSetTheme,
      theme: "light",
      themes: ["light", "dark"],
      systemTheme: "light",
      forcedTheme: undefined,
    })

    renderThemeToggleButton()

    await waitFor(() => {
      const button = getToggleButton()
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
    })

    expect(mockSetTheme).toHaveBeenCalledTimes(3)
  })
})

describe("ThemeToggleButton circular reveal", () => {
  /** The shape of next-themes' `setTheme` (a React state setter). */
  type SetTheme = (value: string | ((prev: string) => string)) => void

  /** Stubs `matchMedia` so only the reduced-motion query matches when `reduce` is true. */
  const stubReducedMotion = (reduce: boolean) =>
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: reduce && query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList
    )

  /** Installs a fake View Transitions API that runs the update callback straight away. */
  const stubViewTransition = () => {
    const startViewTransition = vi.fn((update: () => void) => {
      update()
      return { ready: Promise.resolve(), finished: Promise.resolve() } as ViewTransition
    })
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    })
    document.documentElement.animate = vi.fn() as unknown as typeof document.documentElement.animate
    return startViewTransition
  }

  const clickToggleWith = async (setTheme: SetTheme) => {
    const { useTheme } = await import("next-themes")
    vi.mocked(useTheme).mockReturnValue({
      resolvedTheme: "light",
      setTheme,
      theme: "light",
      themes: ["light", "dark"],
      systemTheme: "light",
      forcedTheme: undefined,
    })
    renderThemeToggleButton()
    await waitFor(() => fireEvent.click(getToggleButton()))
  }

  afterEach(() => {
    vi.restoreAllMocks()
    delete (document as { startViewTransition?: unknown }).startViewTransition
  })

  it("plays the reveal when motion is allowed", async () => {
    stubReducedMotion(false)
    const startViewTransition = stubViewTransition()
    const setTheme = vi.fn<SetTheme>()

    await clickToggleWith(setTheme)

    expect(startViewTransition).toHaveBeenCalledOnce()
    expect(setTheme).toHaveBeenCalledWith("dark")
  })

  it("switches the theme instantly, without the reveal, when reduced motion is on", async () => {
    stubReducedMotion(true)
    const startViewTransition = stubViewTransition()
    const setTheme = vi.fn<SetTheme>()

    await clickToggleWith(setTheme)

    expect(startViewTransition).not.toHaveBeenCalled()
    expect(setTheme).toHaveBeenCalledWith("dark")
  })
})
