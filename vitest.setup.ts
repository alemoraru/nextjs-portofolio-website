import React from "react"
import { vi } from "vitest"

// Minimal in-memory localStorage mock. Node gates the built-in global `localStorage`
// behind an experimental flag, so it's undefined by default in the jsdom test environment.
class LocalStorageMock implements Storage {
  private store = new Map<string, string>()

  get length() {
    return this.store.size
  }

  getItem(key: string) {
    return this.store.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.store.set(key, String(value))
  }

  removeItem(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new LocalStorageMock(),
  writable: true,
})

// jsdom doesn't implement `window.matchMedia`, but Header uses it to detect the mobile
// breakpoint for its scroll-flip behavior. Defaults to "no match" (desktop) unless a
// test overrides it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Prevent navigation warnings by intercepting clicks
    const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (props.onClick) {
        props.onClick(e)
      }
    }
    return React.createElement("a", { href, ...props, onClick }, children)
  },
}))

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    ...props
  }: {
    src: string
    alt: string
    fill?: boolean
    [key: string]: unknown
  }) => {
    // Filter out Next.js specific props that aren't valid HTML attributes
    const { priority: _priority, loading: _loading, quality: _quality, ...validProps } = props
    return React.createElement("img", { src, alt, ...validProps })
  },
}))

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
  }),
}))

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        const Component = React.forwardRef(
          (
            props: Record<string, unknown> & { children?: React.ReactNode },
            ref: React.Ref<HTMLElement>
          ) => {
            const {
              initial: _initial,
              animate: _animate,
              exit: _exit,
              transition: _transition,
              whileHover: _whileHover,
              whileTap: _whileTap,
              variants: _variants,
              layout: _layout,
              layoutId: _layoutId,
              ...rest
            } = props
            return React.createElement(prop, { ...rest, ref })
          }
        )
        Component.displayName = `motion.${prop}`
        return Component
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}))
