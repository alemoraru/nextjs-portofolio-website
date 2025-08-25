'use client';

import {useState, useMemo} from 'react';
import {FaFrown, FaTimes, FaTrashAlt} from 'react-icons/fa';
import {motion, AnimatePresence} from 'framer-motion';
import FilterDropdown from '@/components/FilterDropdown';
import SortDropdown from '@/components/SortDropdown';
import ProjectTile from '@/components/ProjectTile';
import projects from '@/data/projects';

/**
 * ProjectsPage component that serves as the main page for displaying projects.
 * This is accessed at the "/projects" URL of the application.
 */
export default function ProjectsPage() {
    const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
    const [techStackDrafts, setTechStackDrafts] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('newest');

    // Memoized unique tech stack list with counts to avoid recalculating on every render
    const uniqueTechStack = useMemo(() => {
        const techStackCounts: Record<string, number> = {};
        projects.forEach(project => {
            (project.techStack || []).forEach(tech => {
                techStackCounts[tech] = (techStackCounts[tech] || 0) + 1;
            });
        });
        return Object.entries(techStackCounts)
            .map(([tech, count]) => ({tech, count}))
            .sort((a, b) => a.tech.localeCompare(b.tech));
    }, []);

    const toggleTechStackDraft = (tech: string) => {
        setTechStackDrafts(prev =>
            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
        );
    };

    const applyFilters = () => {
        setSelectedTechStack([...techStackDrafts]);
    };

    const clearFilters = () => {
        setSelectedTechStack([]);
        setTechStackDrafts([]);
    };

    // Handler to remove a single tech from filters
    const removeTech = (tech: string) => {
        setSelectedTechStack(prev => prev.filter(t => t !== tech));
        setTechStackDrafts(prev => prev.filter(t => t !== tech));
    };

    // Handler to clear all tech filters
    const clearAllTech = () => {
        setSelectedTechStack([]);
        setTechStackDrafts([]);
    };

    // Memoized filtered projects based on selected tech stack and sort order
    const filteredProjects = useMemo(() => {
        const filtered = projects.filter(project =>
            selectedTechStack.length === 0 ||
            (project.techStack && selectedTechStack.some(tech => project.techStack.includes(tech)))
        );

        return filtered.sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.endDate || '').getTime() - new Date(a.endDate || '').getTime();
            } else {
                return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime();
            }
        });
    }, [selectedTechStack, sortOrder]);

    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">

                {/* Tech Stack Filter Dropdown - Left */}
                <div className="relative flex-grow md:flex-grow-0">
                    <FilterDropdown
                        items={uniqueTechStack.map(({tech, count}) => ({name: tech, count}))}
                        selectedItems={techStackDrafts}
                        onToggle={toggleTechStackDraft}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        placeholder="Filter by Tech"
                        resultCount={filteredProjects.length}
                    />
                </div>

                {/* Sort Order Dropdown - Right */}
                <div className="relative flex-grow md:flex-grow-0 z-20">
                    <SortDropdown
                        sortOrder={sortOrder}
                        onChange={(order) => setSortOrder(order as 'newest' | 'oldest')}
                        options={[
                            {label: 'Newest First', value: 'newest'},
                            {label: 'Oldest First', value: 'oldest'},
                        ]}
                    />
                </div>
            </div>

            {/* Active Filter Chips */}
            {selectedTechStack.length > 0 && (
                <div
                    className="flex flex-row flex-wrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                    {selectedTechStack.map(tech => (
                        <span key={tech}
                              className="flex items-center bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm">
                            {tech}
                            <button
                                onClick={() => removeTech(tech)}
                                aria-label={`Remove filter ${tech}`}
                                className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none cursor-pointer flex items-center"
                                tabIndex={0}
                            >
                                <FaTimes className="w-4 h-4 md:w-4 md:h-4"/>
                            </button>
                        </span>
                    ))}
                    {selectedTechStack.length > 1 && (
                        <button
                            onClick={clearAllTech}
                            className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs md:text-sm font-medium shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 ml-2 cursor-pointer"
                            aria-label="Clear all filters"
                            tabIndex={0}
                        >
                            <FaTrashAlt className="w-4 h-4 md:w-4 md:h-4 mr-1"/>
                            Clear All
                        </button>
                    )}
                </div>
            )}

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
                        {filteredProjects.map((project) => (
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
        </section>
    );
}
