import Link from "next/link"
import { FaArrowLeft, FaExclamationCircle } from "react-icons/fa"

/**
 * WorkNotFound component that displays a 404 error message when the work page is not found.
 */
export default function WorkNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FaExclamationCircle className="text-5xl text-accent-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Work page not found</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        The page you requested does not exist. Please return to the first page of work experience.
      </p>
      <Link
        href="/work"
        className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-2 rounded transition-colors shadow focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2"
      >
        <FaArrowLeft className="inline-block mr-2" /> Back to /work
      </Link>
    </div>
  )
}
