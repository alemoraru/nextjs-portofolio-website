import Link from "next/link";
import {FaArrowLeft, FaExclamationCircle} from "react-icons/fa";

/**
 * ProjectsNotFound component that displays a 404 error message when the projects page is not found.
 */
export default function ProjectsNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <FaExclamationCircle className="text-5xl text-blue-500 mb-4"/>
            <h1 className="text-2xl font-bold mb-2">Projects page not found</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
                The page you requested does not exist. Please return to the first page of projects.
            </p>
            <Link
                href="/projects"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
                <FaArrowLeft className="inline-block mr-2"/> Back to /projects
            </Link>
        </div>
    );
}
