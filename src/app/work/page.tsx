'use client'

import WorkItem from '@/components/WorkItem'
import work from '@/data/work'
import {useMemo, useState} from "react";
import SortDropdown from "@/components/SortDropdown";
import FilterDropdown from "@/components/FilterDropdown";
import {AnimatePresence, motion} from "framer-motion";

/**
 * WorkPage component that serves as the main page for displaying work experience.
 * This is accessed at the "/work" URL of the application.
 */
export default function WorkPage() {
    const [selectedWorkCompanies, setSelectedWorkCompanies] = useState<string[]>([]);
    const [workCompanyDrafts, setWorkCompanyDrafts] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('newest');

    // Memoized unique work item (companies) list with counts to avoid recalculating on every render
    const uniqueWorkCompany = useMemo(() => {
        const companyCounts: Record<string, number> = {};
        work.forEach(workItem => {
            companyCounts[workItem.company] = (companyCounts[workItem.company] || 0) + 1;
        });
        return Object.entries(companyCounts)
            .map(([company, count]) => ({company, count}))
            .sort((a, b) => a.company.localeCompare(b.company));
    }, []);

    const toggleWorkCompanyDrafts = (tech: string) => {
        setWorkCompanyDrafts(prev =>
            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
        );
    };

    const applyFilters = () => {
        setSelectedWorkCompanies([...workCompanyDrafts]);
    };

    const clearFilters = () => {
        setSelectedWorkCompanies([]);
        setWorkCompanyDrafts([]);
    };

    // Memoized filtered work items based on selected companies and sort order
    const filteredWorkItems = useMemo(() => {
        const filtered = work.filter(workItem =>
            selectedWorkCompanies.length === 0 ||
            (workItem.company && selectedWorkCompanies.some(company => workItem.company.includes(company)))
        );

        return filtered.sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.end || '').getTime() - new Date(a.end || '').getTime();
            } else {
                return new Date(a.start || '').getTime() - new Date(b.start || '').getTime();
            }
        });
    }, [selectedWorkCompanies, sortOrder]);

    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-4 mb-8 items-center w-full">
                {/* Company Filter Dropdown - Left */}
                <div className="relative flex-grow md:flex-grow-0">
                    <FilterDropdown
                        items={uniqueWorkCompany.map(({company, count}) => ({name: company, count}))}
                        selectedItems={workCompanyDrafts}
                        onToggle={toggleWorkCompanyDrafts}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        placeholder="Filter by Company"
                        resultCount={filteredWorkItems.length}
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

            <AnimatePresence mode="wait">
                {filteredWorkItems.length > 0 ? (
                    <motion.div
                        key="work-items"
                        className="space-y-6 grid"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        {filteredWorkItems.map((item) => (
                            <WorkItem key={item.slug} {...item} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center text-gray-500">
                        No work items found for the selected filters.
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
