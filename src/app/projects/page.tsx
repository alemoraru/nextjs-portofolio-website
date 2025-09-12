import ProjectsClientUI from './ProjectsClientUI';
import projects from '@/data/projects';

/**
 * ProjectsPage component that serves as the main page for displaying projects.
 * This is accessed at the "/projects" URL of the application.
 */
export default function ProjectsPage({searchParams}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Get page from query param
    const pageParam = Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page;
    let currentPage = Math.max(1, parseInt(pageParam || '1', 10));
    const PROJECTS_PER_PAGE = 6;

    // Get sort order from query param (default: newest)
    let sortOrder: 'newest' | 'oldest' = 'newest';
    if (searchParams?.sort === 'newest' || searchParams?.sort === 'oldest') {
        sortOrder = searchParams.sort as 'newest' | 'oldest';
    }

    // Get selected tech stack from query param
    let selectedTechStack: string[] = [];
    if (searchParams?.tech) {
        if (Array.isArray(searchParams.tech)) {
            selectedTechStack = searchParams.tech;
        } else {
            selectedTechStack = searchParams.tech.split(',');
        }
    }

    // Unique tech stack for filter dropdown
    const techStackCounts: Record<string, number> = {};
    projects.forEach(project => {
        (project.techStack || []).forEach(tech => {
            techStackCounts[tech] = (techStackCounts[tech] || 0) + 1;
        });
    });
    const uniqueTechStack = Object.entries(techStackCounts)
        .map(([tech, count]) => ({tech, count}))
        .sort((a, b) => a.tech.localeCompare(b.tech));

    // Filter and sort projects
    const filteredProjects = projects
        .filter(project =>
            selectedTechStack.length === 0 ||
            (project.techStack && selectedTechStack.some(tech => project.techStack.includes(tech)))
        )
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.endDate || '').getTime() - new Date(a.endDate || '').getTime();
            } else {
                return new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime();
            }
        });

    // Calculate total pages and clamp currentPage
    const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
    currentPage = Math.min(currentPage, totalPages || 1);
    if (currentPage < 1) currentPage = 1;
    if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;

    // Paginate the filtered projects
    const start = (currentPage - 1) * PROJECTS_PER_PAGE;
    const paginatedProjects = filteredProjects.slice(start, start + PROJECTS_PER_PAGE);

    return (
        <ProjectsClientUI
            uniqueTechStack={uniqueTechStack}
            selectedTechStack={selectedTechStack}
            sortOrder={sortOrder}
            filteredProjects={filteredProjects}
            paginatedProjects={paginatedProjects}
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/projects"
        />
    );
}
