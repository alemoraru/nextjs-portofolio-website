"use client";

import {Suspense, useState, useEffect} from 'react';
import FilterDropdown from '@/components/FilterDropdown';
import SortDropdown from '@/components/SortDropdown';
import ActiveFilterChips from '@/components/ActiveFilterChips';
import BlogPost from '@/components/BlogPost';
import PaginationControls from '@/components/PaginationControls';
import {AnimatePresence, motion} from 'framer-motion';
import {FaFrown} from 'react-icons/fa';
import {useRouter, useSearchParams} from 'next/navigation';
import {BlogPostProps} from "@/lib/types";

/**
 * Client component used to render the blog page from within the server component.
 * @param uniqueTags - the list of unique tags with counts
 * @param selectedTags - the currently selected tags
 * @param sortOrder - the current sort order ('asc' or 'desc')
 * @param filteredPosts - the list of posts after filtering
 * @param paginatedPosts - the list of posts for the current page
 * @param currentPage - the current page number
 * @param totalPages - the total number of pages
 * @param baseUrl - the base URL for pagination links
 */
export default function BlogClientUI(
    {
        uniqueTags,
        selectedTags,
        sortOrder,
        filteredPosts,
        paginatedPosts,
        currentPage,
        totalPages,
        baseUrl
    }: {
        uniqueTags: { tag: string, count: number }[];
        selectedTags: string[];
        sortOrder: 'asc' | 'desc';
        filteredPosts: BlogPostProps[];
        paginatedPosts: BlogPostProps[];
        currentPage: number;
        totalPages: number;
        baseUrl: string;
    }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Draft state for tag selection
    const [tagDrafts, setTagDrafts] = useState<string[]>(selectedTags);
    useEffect(() => {
        setTagDrafts(selectedTags);
    }, [selectedTags]);

    // Handlers for filter/sort UI
    const handleToggleTag = (tag: string) => {
        setTagDrafts(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Apply tags to URL params
    const handleApplyTags = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (tagDrafts.length > 0) {
            params.set('tags', tagDrafts.join(','));
        } else {
            params.delete('tags');
        }
        params.delete('page'); // Reset to page 1
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Clear all tags from URL params
    const handleClearTags = () => {
        setTagDrafts([]);
        const params = new URLSearchParams(searchParams.toString());
        params.delete('tags');
        params.delete('page');
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Update sort order in URL params
    const handleSortChange = (order: 'asc' | 'desc' | 'oldest' | 'newest') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', order);
        params.delete('page');
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    const handleRemoveTag = (tag: string) => {
        // Remove tag from draft and apply immediately
        const newDrafts = tagDrafts.filter(t => t !== tag);
        setTagDrafts(newDrafts);
        const params = new URLSearchParams(searchParams.toString());
        if (newDrafts.length > 0) {
            params.set('tags', newDrafts.join(','));
        } else {
            params.delete('tags');
        }
        params.delete('page'); // Reset to page 1
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Clear all tags handler
    const handleClearAllTags = () => {
        handleClearTags();
    };

    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">

                {/* Tag Filter Dropdown - Left */}
                <div className="relative flex-grow md:flex-grow-0">
                    <Suspense fallback={null}>
                        <FilterDropdown
                            items={uniqueTags.map(({tag, count}) => ({name: tag, count}))}
                            selectedItems={tagDrafts}
                            onToggle={handleToggleTag}
                            onApply={handleApplyTags}
                            onClear={handleClearTags}
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
                            onChange={handleSortChange}
                            options={[{label: 'Newest First', value: 'desc'}, {label: 'Oldest First', value: 'asc'}]}
                        />
                    </Suspense>
                </div>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips
                filters={selectedTags}
                onRemove={handleRemoveTag}
                onClearAll={selectedTags.length > 1 ? handleClearAllTags : undefined}
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
                baseUrl={baseUrl}
                searchParams={Object.fromEntries(searchParams.entries())}
            />
        </section>
    );
}
