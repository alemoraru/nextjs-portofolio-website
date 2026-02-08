import React from "react"
import { vi } from "vitest"

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) =>
    React.createElement("a", { href, ...props }, children),
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
