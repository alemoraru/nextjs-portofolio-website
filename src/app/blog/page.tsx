import BlogClientUI from './BlogClientUI';
import posts from '@/data/blog';

/**
 * BlogPage component that serves as the main page for displaying blog posts.
 * This is accessed at the "/blog" URL of the application.
 */
export default function BlogPage({searchParams}: { searchParams: { [key: string]: string | string[] | undefined } }) {
    // Get page from query param
    const pageParam = Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page;
    let currentPage = Math.max(1, parseInt(pageParam || '1', 10));
    const POSTS_PER_PAGE = 5;

    // Get sort order from query param (default: desc, meaning newest)
    let sortOrder: 'asc' | 'desc' = 'desc';
    if (searchParams?.sort === 'asc' || searchParams?.sort === 'desc') {
        sortOrder = searchParams.sort as 'asc' | 'desc';
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

    return (
        <BlogClientUI
            uniqueTags={uniqueTags}
            selectedTags={selectedTags}
            sortOrder={sortOrder}
            filteredPosts={filteredPosts}
            paginatedPosts={paginatedPosts}
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/blog"
        />
    );
}
