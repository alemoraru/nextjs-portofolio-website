import Link from "next/link";

/**
 * NotFound component that displays a 404 error message when a page is not found.
 */
export default function NotFound() {
    return (
        <div
            className="flex-grow flex flex-col items-center justify-center  min-h-[60vh] text-center px-4">
            <div className="max-w-lg w-full">
                <div className="text-7xl md:text-9xl font-extrabold text-blue-500 mb-4 select-none">404</div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Page Not Found</h1>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Oops! Looks like you hit a route that doesn&#39;t exist.<br/>
                    <span
                        className="inline-block mt-2 bg-zinc-200 dark:bg-zinc-800 rounded px-2 py-1 font-mono text-sm text-blue-600 dark:text-blue-400">$ cd /home</span>
                </p>
                <Link
                    href="/"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded transition-colors shadow"
                >
                    Go Home
                </Link>
                <div className="mt-6 text-xs text-gray-400 font-mono">
                    <span>&#123; tip: try the navigation menu above &#125;</span>
                </div>
            </div>
        </div>
    );
}
