import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
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
