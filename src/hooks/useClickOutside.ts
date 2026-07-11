"use client"

import { useEffect, useRef } from "react"
import type { RefObject } from "react"

interface UseClickOutsideOptions {
  /** Whether the listeners are active. Defaults to `true`. */
  enabled?: boolean
  /** Whether an Escape keypress also triggers `onOutside`. Defaults to `true`. */
  closeOnEscape?: boolean
}

/**
 * Calls `onOutside` when a mousedown lands outside all given refs, and (by default) when
 * Escape is pressed. Used to close dropdowns/menus/panels on outside interaction.
 * @param refs - One or more refs whose contents should NOT count as "outside".
 * @param onOutside - Called on outside mousedown or Escape keydown.
 * @param options - Optional configuration for enabling/disabling the listeners and Escape behavior.
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  onOutside: () => void,
  { enabled = true, closeOnEscape = true }: UseClickOutsideOptions = {}
) {
  // Read via a ref so callers can pass a fresh closure each render without forcing us to
  // tear down and re-add the listeners (refs themselves are stable across renders).
  const onOutsideRef = useRef(onOutside)
  useEffect(() => {
    onOutsideRef.current = onOutside
  })

  useEffect(() => {
    if (!enabled) return

    const refList = Array.isArray(refs) ? refs : [refs]

    const handleClickOutside = (e: MouseEvent) => {
      const isInside = refList.some(ref => ref.current?.contains(e.target as Node))
      if (!isInside) onOutsideRef.current()
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOutsideRef.current()
    }

    document.addEventListener("mousedown", handleClickOutside)
    if (closeOnEscape) document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (closeOnEscape) document.removeEventListener("keydown", handleEscape)
    }
  }, [enabled, closeOnEscape])
}
