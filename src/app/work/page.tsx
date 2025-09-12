import WorkClientUI from './WorkClientUI';
import work from '@/data/work';

/**
 * WorkPage component that serves as the main page for displaying work experience.
 * This is accessed at the "/work" URL of the application.
 */
export default function WorkPage({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
    // Get page from query param
    const pageParam = Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page;
    let currentPage = Math.max(1, parseInt(pageParam || '1', 10));
    const WORK_PER_PAGE = 6;

    // Get sort order from query param (default: newest)
    let sortOrder: 'newest' | 'oldest' = 'newest';
    if (searchParams?.sort === 'newest' || searchParams?.sort === 'oldest') {
        sortOrder = searchParams.sort as 'newest' | 'oldest';
    }

    // Get selected companies from query param
    let selectedCompanies: string[] = [];
    if (searchParams?.company) {
        if (Array.isArray(searchParams.company)) {
            selectedCompanies = searchParams.company;
        } else {
            selectedCompanies = searchParams.company.split(',');
        }
    }

    // Unique companies for filter dropdown
    const companyCounts: Record<string, number> = {};
    work.forEach(workItem => {
        companyCounts[workItem.company] = (companyCounts[workItem.company] || 0) + 1;
    });
    const uniqueCompanies = Object.entries(companyCounts)
        .map(([company, count]) => ({company, count}))
        .sort((a, b) => a.company.localeCompare(b.company));

    // Filter and sort work items
    const filteredWorkItems = work
        .filter(workItem =>
            selectedCompanies.length === 0 ||
            (workItem.company && selectedCompanies.some(company => workItem.company === company))
        )
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.end || '').getTime() - new Date(a.end || '').getTime();
            } else {
                return new Date(a.start || '').getTime() - new Date(b.start || '').getTime();
            }
        });

    // Calculate total pages and clamp currentPage
    const totalPages = Math.ceil(filteredWorkItems.length / WORK_PER_PAGE);
    currentPage = Math.min(currentPage, totalPages || 1);
    if (currentPage < 1) currentPage = 1;
    if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;

    // Paginate the filtered work items
    const start = (currentPage - 1) * WORK_PER_PAGE;
    const paginatedWorkItems = filteredWorkItems.slice(start, start + WORK_PER_PAGE);

    return (
        <WorkClientUI
            uniqueCompanies={uniqueCompanies}
            selectedCompanies={selectedCompanies}
            sortOrder={sortOrder}
            filteredWorkItems={filteredWorkItems}
            paginatedWorkItems={paginatedWorkItems}
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/work"
        />
    );
}
