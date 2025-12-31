import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges them with tailwind-merge.
 * @param inputs - Class names to combine.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
