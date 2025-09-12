import WorkClientUI from './WorkClientUI';
import WorkNotFound from './WorkNotFound';
import work from '@/data/work';

/**
 * WorkPage component that serves as the main page for displaying work experience.
 * This is accessed at the "/work" URL of the application.
 */
export default async function WorkPage({searchParams}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Destructure all query params at the top (Promise style, but not required)
    const {page, sort, company} = await Promise.resolve(searchParams);

    // Page param
    const pageParam = Array.isArray(page) ? page[0] : page;
    let currentPage = Math.max(1, parseInt(pageParam || '1', 10));
    const WORK_PER_PAGE = 6;

    // Sort param (default: newest)
    let sortOrder: 'newest' | 'oldest' = 'newest';
    if (sort === 'newest' || sort === 'oldest') {
        sortOrder = sort as 'newest' | 'oldest';
    }

    // Company param (handle string or string[])
    let selectedCompanies: string[] = [];
    if (company) {
        if (Array.isArray(company)) {
            selectedCompanies = company.flatMap(c => c.split(','));
        } else {
            selectedCompanies = company.split(',');
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

    // If page is out of bounds, show not-found
    if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
        return <WorkNotFound/>;
    }

    currentPage = Math.min(currentPage, totalPages || 1);
    if (currentPage < 1) currentPage = 1;
    if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;

    // Paginate
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
