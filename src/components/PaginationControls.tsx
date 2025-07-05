import React from 'react';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

/**
 * PaginationControls component provides navigation controls for paginated content.
 * @param currentPage - The current page number.
 * @param totalPages - The total number of pages available.
 * @param setCurrentPage - Function to update the current page number.
 */
const PaginationControls: React.FC<PaginationControlsProps> = ({currentPage, totalPages, setCurrentPage}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            {/* Prev Button */}
            <button
                className={`w-8 h-8 flex items-center justify-center px-0 py-0 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-transform duration-150 ${currentPage === 1 ? 'cursor-default opacity-60' : 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <FaChevronLeft className="w-4 h-4"/>
            </button>

            {/* First page */}
            <button
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 ${currentPage === 1 ? 'bg-blue-500 text-white cursor-default' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
            >
                1
            </button>

            {/* Left Ellipsis */}
            {currentPage > 3 && (
                <span className="px-2 select-none">...</span>
            )}

            {/* Previous page number (if not 1 and not already shown) */}
            {currentPage > 2 && (
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    {currentPage - 1}
                </button>
            )}

            {/* Current page (not 1 or last) */}
            {currentPage !== 1 && currentPage !== totalPages && (
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded bg-blue-500 text-white transition-colors duration-150 cursor-default`}
                    disabled
                >
                    {currentPage}
                </button>
            )}

            {/* Next page number (if not last and not already shown) */}
            {currentPage < totalPages - 1 && (
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    {currentPage + 1}
                </button>
            )}

            {/* Right Ellipsis */}
            {currentPage < totalPages - 2 && (
                <span className="px-2 select-none">...</span>
            )}

            {/* Last page */}
            {totalPages > 1 && (
                <button
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-150 ${currentPage === totalPages ? 'bg-blue-500 text-white cursor-default' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    {totalPages}
                </button>
            )}

            {/* Next Button */}
            <button
                className={`w-8 h-8 flex items-center justify-center px-0 py-0 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-transform duration-150 ${currentPage === totalPages ? 'cursor-default opacity-60' : 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <FaChevronRight className="w-4 h-4"/>
            </button>
        </div>
    );
};

export default PaginationControls;
