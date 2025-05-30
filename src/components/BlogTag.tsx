import {FaTag} from "react-icons/fa";

/**
 * A functional component that renders a blog tag with an icon and the tag name.
 * @param tag the name of the tag to display
 */
export default function BlogTag({tag}: { tag: string }) {
    return (
        <span
            key={tag}
            className={`
            flex items-center text-xs bg-blue-100 text-blue-700 dark:bg-blue-900
            dark:text-blue-300 px-2 py-1 rounded-full group-hover:bg-blue-200 dark:hover:bg-blue-900
            dark:group-hover:bg-blue-900
            transition duration-300`}
        >
            <FaTag className="w-3 h-3 mr-1"/>
            {tag}
        </span>
    )
}
