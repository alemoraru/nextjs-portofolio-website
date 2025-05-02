import Link from "next/link";

interface BackToPageButtonProps {
    pageUrl: string
}

/**
 * A functional component that renders a "Back to Page" button with a link to a specified page.
 * @param pageUrl - The URL to which the button should link (e.g., "/projects").
 */
export default function BackToPageButton({pageUrl}: BackToPageButtonProps) {
    return (
        <Link
            href={pageUrl}
            className="mb-8 text-blue-500 hover:text-blue-700 transition-all flex items-center gap-2 group"
        >
                <span className="inline-block transform transition-transform group-hover:-translate-x-1">
                    ←
                </span>
            Back to {pageUrl.split('/').pop() || 'page'}
        </Link>
    )
}
