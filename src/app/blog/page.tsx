'use client';

import {useEffect, useState, useMemo, useRef} from 'react';
import {FaChevronDown, FaFrown} from 'react-icons/fa';
import {motion, AnimatePresence} from 'framer-motion';
import FilterDropdown from '@/components/FilterDropdown';
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

    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const tagDropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

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

    const toggleTagDraft = (tag: string) => {
        setTagDrafts(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const applyFilters = () => {
        setSelectedTags([...tagDrafts]);
        setIsTagDropdownOpen(false);
    };

    const clearFilters = () => {
        setSelectedTags([]);
        setTagDrafts([]);
        setIsTagDropdownOpen(false);
    };

    // Handle outside click and Escape
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                tagDropdownRef.current &&
                !tagDropdownRef.current.contains(e.target as Node)
            ) {
                setIsTagDropdownOpen(false);
            }
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(e.target as Node)
            ) {
                setIsSortDropdownOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsTagDropdownOpen(false);
                setIsSortDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const filteredPosts = useMemo(() => {
        return posts
            .filter(post =>
                selectedTags.length === 0 ||
                (post.tags && selectedTags.some(tag => post.tags.includes(tag)))
            )
            .sort((a, b) => {
                const dateA = new Date(a.date || '').getTime();
                const dateB = new Date(b.date || '').getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });
    }, [selectedTags, sortOrder]);

    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">

                {/* Tag Filter Dropdown - Left Aligned */}
                <div className="relative flex-grow md:flex-grow-0">
                    <FilterDropdown
                        items={uniqueTags.map(({tag, count}) => ({name: tag, count}))}
                        selectedItems={tagDrafts}
                        onToggle={toggleTagDraft}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        placeholder="Filter by Tag"
                    />
                </div>

                {/* Sort Dropdown - Right Aligned */}
                <div className="relative flex-grow md:flex-grow-0" ref={sortDropdownRef}>
                    <button
                        onClick={() => {
                            setIsSortDropdownOpen(prev => !prev);
                            setIsTagDropdownOpen(false);
                        }}
                        className="flex items-center justify-between border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 w-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
                    >
                        <span>
                            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                        </span>
                        <FaChevronDown className="ml-2 text-sm"/>
                    </button>

                    <div
                        className={
                            "origin-top transition-all duration-200 ease-out transform absolute z-10 mt-2 right-0 max-w-full w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg text-sm" +
                            (isSortDropdownOpen
                                ? " scale-y-100 opacity-100"
                                : " scale-y-0 opacity-0 pointer-events-none")
                        }
                        style={{transformOrigin: 'top'}}
                    >
                        <button
                            onClick={() => {
                                setSortOrder('desc');
                                setIsSortDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            Newest First
                        </button>
                        <button
                            onClick={() => {
                                setSortOrder('asc');
                                setIsSortDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            Oldest First
                        </button>
                    </div>
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
                        {filteredPosts.map(post => (
                            <BlogPost key={post.slug} {...post} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="no-results"
                        className="flex flex-col items-center text-center text-gray-600 dark:text-gray-300 mt-12 px-4"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
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
        </section>
    );
}
