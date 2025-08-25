import Link from 'next/link';
import {FaTag} from "react-icons/fa";

/**
 * A functional component that renders a blog tag with an icon and the tag name.
 * @param tag - The name of the tag to display
 * @param href - Optional link to make the tag clickable
 */
export default function BlogTag({tag, href}: { tag: string, href?: string }) {

    // Base styles for the tag
    const baseClasses = `
        flex items-center text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 group-hover:bg-blue-200
        dark:text-blue-300 px-3 py-1 rounded-full transition duration-300 cursor-pointer
    `;

    // Hover effects for the tag (if it's a link)
    const hoverClasses = `
        hover:scale-105 hover:bg-blue-200 hover:shadow-md dark:hover:bg-blue-800
    `;

    const content = (
        <span
            className={href ? `${baseClasses} ${hoverClasses}` : baseClasses}
        >
            <FaTag className="w-3 h-3 mr-1"/>
            {tag}
        </span>
    );

    return href ? (
        <Link href={href}>
            {content}
        </Link>
    ) : content;
}
