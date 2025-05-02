'use client';

import {useState, useMemo, useRef, useEffect} from 'react';
import {FaChevronDown, FaBroom, FaFrown} from 'react-icons/fa';
import {motion, AnimatePresence} from 'framer-motion';
import ProjectTile from '@/components/ProjectTile';
import projects from '@/data/projects';

/**
 * ProjectsPage component that serves as the main page for displaying projects.
 * This is accessed at the "/projects" URL of the application.
 */
export default function ProjectsPage() {
    const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
    const [techStackDrafts, setTechStackDrafts] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('newest');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const uniqueTechStack = useMemo(() => {
        return Array.from(new Set(projects.flatMap(project => project.techStack || []))).sort((a, b) =>
            a.localeCompare(b)
        );
    }, []);

    const toggleTechStackDraft = (tech: string) => {
        setTechStackDrafts(prev =>
            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
        );
    };

    const applyFilters = () => {
        setSelectedTechStack([...techStackDrafts]);
        setIsDropdownOpen(false);
    };

    const clearFilters = () => {
        setSelectedTechStack([]);
        setTechStackDrafts([]);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
                setIsSortDropdownOpen(false);
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsDropdownOpen(false);
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

    const filteredProjects = useMemo(() => {
        const filtered = projects.filter(project =>
            selectedTechStack.length === 0 ||
            (project.techStack && selectedTechStack.every(tech => project.techStack.includes(tech)))
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

                {/* Tech Stack Filter Dropdown */}
                <div className="relative flex-grow md:flex-grow-0" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        className="flex items-center justify-between border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 w-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
                    >
                        <span className="truncate">
                            {selectedTechStack.length === 0
                                ? 'Filter by Tech'
                                : `${selectedTechStack.length} Selected`}
                        </span>
                        <FaChevronDown className="ml-2 text-sm"/>
                    </button>

                    <div
                        className={
                            "origin-top transition-all duration-200 ease-out transform absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg p-4 space-y-3" +
                            (isDropdownOpen
                                ? " scale-y-100 opacity-100"
                                : " scale-y-0 opacity-0 pointer-events-none")
                        }
                        style={{transformOrigin: 'top'}}
                    >
                        <div className="max-h-48 overflow-y-auto">
                            {uniqueTechStack.map(tech => (
                                <label
                                    key={tech}
                                    className="flex items-center space-x-3 cursor-pointer group py-1"
                                >
                                    <span className="relative inline-block w-5 h-5">
                                        <input
                                            type="checkbox"
                                            checked={techStackDrafts.includes(tech)}
                                            onChange={() => toggleTechStackDraft(tech)}
                                            className="peer absolute opacity-0 w-full h-full z-10 cursor-pointer"
                                        />
                                        <span
                                            className="block w-full h-full rounded border border-gray-400 dark:border-gray-500 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition duration-200"
                                        ></span>
                                        <svg
                                            className="absolute top-0 left-0 w-full h-full p-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                        >
                                            <path
                                                d="M6 10l3 3 6-6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <span
                                        className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                        {tech}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <button
                                onClick={applyFilters}
                                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer"
                            >
                                Apply
                            </button>
                            <button
                                onClick={clearFilters}
                                className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 cursor-pointer"
                                title="Clear filters"
                            >
                                <FaBroom className="mr-1"/>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative flex-grow md:flex-grow-0 z-20" ref={sortDropdownRef}>
                    <button
                        onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                        className="flex items-center justify-between border px-4 py-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600 w-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-200"
                    >
                        <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                        <FaChevronDown className="ml-2 text-sm"/>
                    </button>

                    <div
                        className={
                            "origin-top-right absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg text-sm z-50" +
                            (isSortDropdownOpen
                                ? " scale-y-100 opacity-100"
                                : " scale-y-0 opacity-0 pointer-events-none")
                        }
                        style={{transformOrigin: 'top right'}}
                    >
                        <button
                            onClick={() => {
                                setSortOrder('newest');
                                setIsSortDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            Newest First
                        </button>
                        <button
                            onClick={() => {
                                setSortOrder('oldest');
                                setIsSortDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            Oldest First
                        </button>
                    </div>
                </div>
            </div>

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
