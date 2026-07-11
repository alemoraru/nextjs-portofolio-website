import Link from "next/link"
import { FaTag } from "react-icons/fa"
import { cn } from "@/lib/utils"

/**
 * A functional component that renders a blog tag with an icon and the tag name.
 * @param tag - The name of the tag to display
 * @param href - Optional link to make the tag clickable
 */
export default function BlogTag({ tag, href }: { tag: string; href?: string }) {
  const content = (
    <span
      className={cn(
        "flex items-center text-xs px-3 py-1 rounded-full transition duration-300 cursor-pointer",
        "bg-accent-500/15 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400",
        "group-hover:bg-accent-500/25 dark:group-hover:bg-accent-500/25",
        href && "hover:scale-105 hover:bg-accent-500/25 hover:shadow-md dark:hover:bg-accent-500/25"
      )}
    >
      <FaTag className="w-3 h-3 mr-1" />
      {tag}
    </span>
  )

  return href ? <Link href={href}>{content}</Link> : content
}
