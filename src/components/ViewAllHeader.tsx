import Link from "next/link";

interface ViewAllButtonProps {
    title: string,
    pageUrl: string
}

/**
 * A functional component that renders a "View All" button with a link to a specified page.
 * @param title - The title to be displayed in the header (e.g., "Recent Work").
 * @param pageUrl - The URL to which the button should link (e.g., "/projects").
 */
export default function ViewAllHeader({title, pageUrl}: ViewAllButtonProps) {
    return (
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <Link
                href={pageUrl}
                className="relative inline-block text-blue-500 text-sm transition-all duration-300 group hover:text-blue-600"
            >
                        <span className="group-hover:underline group-hover:decoration-transparent">
                          View all
                        </span>
                <span
                    className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"
                ></span>
            </Link>
        </div>
    )
}
