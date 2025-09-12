"use client";

import {Suspense, useState, useEffect} from 'react';
import FilterDropdown from '@/components/FilterDropdown';
import SortDropdown from '@/components/SortDropdown';
import ActiveFilterChips from '@/components/ActiveFilterChips';
import ProjectTile from '@/components/ProjectTile';
import PaginationControls from '@/components/PaginationControls';
import {AnimatePresence, motion} from 'framer-motion';
import {FaFrown} from 'react-icons/fa';
import {useRouter, useSearchParams} from 'next/navigation';
import {ProjectProps} from "@/lib/types";

/**
 * Client component used to render the projects page from within the server component.
 * @param uniqueTechStack - the list of unique tech stack items with counts
 * @param selectedTechStack - the currently selected tech stack items
 * @param sortOrder - the current sort order ('newest' or 'oldest')
 * @param filteredProjects - the list of projects after filtering
 * @param paginatedProjects - the list of projects for the current page
 * @param currentPage - the current page number
 * @param totalPages - the total number of pages
 * @param baseUrl - the base URL for pagination links
 */
export default function ProjectsClientUI(
    {
        uniqueTechStack,
        selectedTechStack,
        sortOrder,
        filteredProjects,
        paginatedProjects,
        currentPage,
        totalPages,
        baseUrl
    }: {
        uniqueTechStack: { tech: string, count: number }[];
        selectedTechStack: string[];
        sortOrder: 'newest' | 'oldest';
        filteredProjects: ProjectProps[];
        paginatedProjects: ProjectProps[];
        currentPage: number;
        totalPages: number;
        baseUrl: string;
    }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Draft state for tech stack selection
    const [techStackDrafts, setTechStackDrafts] = useState<string[]>(selectedTechStack);
    useEffect(() => {
        setTechStackDrafts(selectedTechStack);
    }, [selectedTechStack]);

    // Handlers for filter/sort UI
    const handleToggleTech = (tech: string) => {
        setTechStackDrafts(prev =>
            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
        );
    };

    // Apply filters by updating URL params
    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (techStackDrafts.length > 0) {
            params.set('tech', techStackDrafts.join(','));
        } else {
            params.delete('tech');
        }
        params.delete('page'); // Reset to page 1
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Handler to clear all filters
    const handleClearFilters = () => {
        setTechStackDrafts([]);
        const params = new URLSearchParams(searchParams.toString());
        params.delete('tech');
        params.delete('page');
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Update sort order in URL params
    const handleSortChange = (order: "desc" | "newest" | "oldest" | "asc") => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', order);
        params.delete('page');
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Remove a single tech from active filters
    const handleRemoveTech = (tech: string) => {
        // Remove tech from draft and apply immediately
        const newDrafts = techStackDrafts.filter(t => t !== tech);
        setTechStackDrafts(newDrafts);
        const params = new URLSearchParams(searchParams.toString());
        if (newDrafts.length > 0) {
            params.set('tech', newDrafts.join(','));
        } else {
            params.delete('tech');
        }
        params.delete('page'); // Reset to page 1
        router.push(`${baseUrl}${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Clear all tech filters
    const handleClearAllTech = () => {
        handleClearFilters();
    };

    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">
                {/* Tech Stack Filter Dropdown - Left */}
                <div className="relative flex-grow md:flex-grow-0">
                    <Suspense fallback={null}>
                        <FilterDropdown
                            items={uniqueTechStack.map(({tech, count}) => ({name: tech, count}))}
                            selectedItems={techStackDrafts}
                            onToggle={handleToggleTech}
                            onApply={handleApplyFilters}
                            onClear={handleClearFilters}
                            placeholder="Filter by Tech"
                            resultCount={filteredProjects.length}
                        />
                    </Suspense>
                </div>

                {/* Sort Order Dropdown - Right */}
                <div className="relative flex-grow md:flex-grow-0 z-20">
                    <Suspense fallback={null}>
                        <SortDropdown
                            sortOrder={sortOrder}
                            onChange={handleSortChange}
                            options={[{label: 'Newest First', value: 'newest'}, {
                                label: 'Oldest First',
                                value: 'oldest'
                            }]}
                        />
                    </Suspense>
                </div>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips
                filters={selectedTechStack}
                onRemove={handleRemoveTech}
                onClearAll={selectedTechStack.length > 1 ? handleClearAllTech : undefined}
            />

            {/* Projects Grid or No Results Message */}
            <AnimatePresence mode="wait">
                {filteredProjects.length > 0 ? (
                    <motion.div
                        key="projects"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                    >
                        {paginatedProjects.map((project) => (
                            <ProjectTile key={project.slug} {...project} />
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
                            No projects found
                        </p>
                        <p className="text-sm md:text-base lg:text-lg mt-2 max-w-2xl">
                            The combination of selected tech stack filters didn&apos;t match any projects.
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
