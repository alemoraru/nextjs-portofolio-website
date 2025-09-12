import {FaFrown} from 'react-icons/fa';
import {motion, AnimatePresence} from 'framer-motion';
import FilterDropdown from '@/components/FilterDropdown';
import SortDropdown from '@/components/SortDropdown';
import BlogPost from '@/components/BlogPost';
import PaginationControls from '@/components/PaginationControls';
import ActiveFilterChips from '@/components/ActiveFilterChips';
import posts from '@/data/blog';
import {Suspense} from 'react';

/**
 * BlogPage component that serves as the main page for displaying blog posts.
 * This is accessed at the "/blog" URL of the application.
 */
export default function BlogPage({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
    // Get page from query param
    const pageParam = Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page;
    let currentPage = Math.max(1, parseInt(pageParam || '1', 10));
    const POSTS_PER_PAGE = 5;

    // Get sort order from query param (default: desc)
    let sortOrder = 'desc';
    if (searchParams?.sort === 'asc' || searchParams?.sort === 'desc') {
        sortOrder = searchParams.sort;
    }

    // Get selected tags from query param
    let selectedTags: string[] = [];
    if (searchParams?.tags) {
        if (Array.isArray(searchParams.tags)) {
            selectedTags = searchParams.tags;
        } else {
            selectedTags = searchParams.tags.split(',');
        }
    }

    // Unique tags for filter dropdown
    const tagCounts: Record<string, number> = {};
    posts.forEach(post => {
        (post.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    const uniqueTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({tag, count}))
        .sort((a, b) => a.tag.localeCompare(b.tag));

    // Filter and sort posts
    const filteredPosts = posts
        .filter(post =>
            selectedTags.length === 0 ||
            (post.tags && selectedTags.some(tag => post.tags && post.tags.includes(tag)))
        )
        .sort((a, b) => {
            const dateA = new Date(a.date || '').getTime();
            const dateB = new Date(b.date || '').getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

    // Calculate total pages and clamp currentPage
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    currentPage = Math.min(currentPage, totalPages || 1);
    if (currentPage < 1) currentPage = 1;
    if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;

    // Paginate
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

    // Handler stubs for filter/sort (client-side dropdowns will need to update URL)
    // These will be handled by client components via navigation

    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">
                {/* Tag Filter Dropdown - Left */}
                <div className="relative flex-grow md:flex-grow-0">
                    <Suspense fallback={null}>
                        <FilterDropdown
                            items={uniqueTags.map(({tag, count}) => ({name: tag, count}))}
                            selectedItems={selectedTags}
                            // onToggle, onApply, onClear: should update URL via router.push in client
                            onToggle={() => {
                            }}
                            onApply={() => {
                            }}
                            onClear={() => {
                            }}
                            placeholder="Filter by Tag"
                            resultCount={filteredPosts.length}
                        />
                    </Suspense>
                </div>
                {/* Sort Order Dropdown - Right */}
                <div className="relative flex-grow md:flex-grow-0">
                    <Suspense fallback={null}>
                        <SortDropdown
                            sortOrder={sortOrder}
                            onChange={() => {
                            }}
                            options={[{label: 'Newest First', value: 'desc'}, {label: 'Oldest First', value: 'asc'}]}
                        />
                    </Suspense>
                </div>
            </div>
            {/* Active Filter Chips */}
            <ActiveFilterChips
                filters={selectedTags}
                onRemove={() => {
                }}
                onClearAll={selectedTags.length > 1 ? () => {
                } : undefined}
            />
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
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                // Instead of setCurrentPage, pass baseUrl and query info
                baseUrl="/blog"
                searchParams={searchParams}
            />
        </section>
    );
}
