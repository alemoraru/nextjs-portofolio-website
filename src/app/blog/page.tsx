'use client';

import {useState, useMemo, useEffect} from 'react';
import {FaFrown} from 'react-icons/fa';
import {motion, AnimatePresence} from 'framer-motion';
import FilterDropdown from '@/components/FilterDropdown';
import SortDropdown from '@/components/SortDropdown';
import BlogPost from '@/components/BlogPost';
import posts from '@/data/blog';

/**
 * BlogPage component that serves as the main page for displaying blog posts.
 * This is accessed at the "/blog" URL of the application.
 */
export default function BlogPage() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagDrafts, setTagDrafts] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 5;

    // Determines the set of unique blog post tags and their count
    const uniqueTags = useMemo(() => {
        const tagCounts: Record<string, number> = {};
        posts.forEach(post => {
            (post.tags || []).forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        return Object.entries(tagCounts)
            .map(([tag, count]) => ({tag, count}))
            .sort((a, b) => a.tag.localeCompare(b.tag));
    }, []);

    // Function to toggle a tag in the draft state
    const toggleTagDraft = (tag: string) => {
        setTagDrafts(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Function to apply the selected tags as filters
    const applyFilters = () => {
        setSelectedTags([...tagDrafts]);
    };

    // Function to clear all selected filters
    const clearFilters = () => {
        setSelectedTags([]);
        setTagDrafts([]);
    };

    // Reset to the first page when filters or sort order change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTags, sortOrder]);

    // Filter and sort the posts based on selected tags and sort order
    const filteredPosts = useMemo(() => {
        return posts
            .filter(post =>
                selectedTags.length === 0 ||
                (post.tags && selectedTags.some(tag => post.tags && post.tags.includes(tag)))
            )
            .sort((a, b) => {
                const dateA = new Date(a.date || '').getTime();
                const dateB = new Date(b.date || '').getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
    }, [selectedTags, sortOrder]);

    // Calculate total pages and paginate the posts
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = useMemo(() => {
        const start = (currentPage - 1) * POSTS_PER_PAGE;
        return filteredPosts.slice(start, start + POSTS_PER_PAGE);
    }, [filteredPosts, currentPage]);

    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">

                {/* Tag Filter Dropdown - Left */}
                <div className="relative flex-grow md:flex-grow-0">
                    <FilterDropdown
                        items={uniqueTags.map(({tag, count}) => ({name: tag, count}))}
                        selectedItems={tagDrafts}
                        onToggle={toggleTagDraft}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        placeholder="Filter by Tag"
                        resultCount={filteredPosts.length}
                    />
                </div>

                {/* Sort Order Dropdown - Right */}
                <div className="relative flex-grow md:flex-grow-0">
                    <SortDropdown
                        sortOrder={sortOrder}
                        onChange={(order) => setSortOrder(order as 'asc' | 'desc')}
                        options={[
                            {label: 'Newest First', value: 'desc'},
                            {label: 'Oldest First', value: 'asc'},
                        ]}
                    />
                </div>
            </div>

            {/* Blog Posts */}
            <AnimatePresence mode="wait">
                {filteredPosts.length > 0 ? (
                    <motion.div
                        key="posts"
                        className="grid gap-6"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                    >
                        {paginatedPosts.map(post => (
                            <BlogPost key={post.slug} {...post} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="no-results"
                        className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300 mt-12 px-4"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 0.3, ease: 'easeOut'}}
                    >
                        <FaFrown className="text-4xl md:text-5xl mb-3 text-gray-400 dark:text-gray-500"/>
                        <p className="text-lg md:text-xl lg:text-2xl font-semibold">
                            No results found
                        </p>
                        <p className="text-sm md:text-base lg:text-lg mt-2 max-w-2xl">
                            The combination of selected tags didn&apos;t match any blog posts.
                            Try changing or clearing your filters.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    {/* Prev Button */}
                    <button
                        className={`px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-transform duration-150 ${currentPage === 1 ? 'cursor-default opacity-60' : 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {/* First page */}
                    <button
                        className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === 1 ? 'bg-blue-500 text-white cursor-default' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'}`}
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
                            className={`px-3 py-1 rounded transition-colors duration-150 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700`}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            {currentPage - 1}
                        </button>
                    )}

                    {/* Current page (not 1 or last) */}
                    {currentPage !== 1 && currentPage !== totalPages && (
                        <button
                            className={`px-3 py-1 rounded bg-blue-500 text-white transition-colors duration-150 cursor-default`}
                            disabled
                        >
                            {currentPage}
                        </button>
                    )}

                    {/* Next page number (if not last and not already shown) */}
                    {currentPage < totalPages - 1 && (
                        <button
                            className={`px-3 py-1 rounded transition-colors duration-150 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700`}
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
                            className={`px-3 py-1 rounded transition-colors duration-150 ${currentPage === totalPages ? 'bg-blue-500 text-white cursor-default' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            {totalPages}
                        </button>
                    )}

                    {/* Next Button */}
                    <button
                        className={`px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 transition-transform duration-150 ${currentPage === totalPages ? 'cursor-default opacity-60' : 'cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}
