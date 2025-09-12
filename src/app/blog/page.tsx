import BlogClientUI from './BlogClientUI';
import BlogNotFound from './BlogNotFound';
import posts from '@/data/blog';

/**
 * BlogPage component that serves as the main page for displaying blog posts.
 * This is accessed at the "/blog" URL of the application.
 */
export default async function BlogPage({searchParams}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Destructure all query params at once
    const {page, sort, tags} = await Promise.resolve(searchParams);

    // Page param
    const pageParam = Array.isArray(page) ? page[0] : page;
    let currentPage = Math.max(1, parseInt(pageParam || '1', 10));
    const POSTS_PER_PAGE = 5;

    // Sort param (default: desc)
    let sortOrder: 'asc' | 'desc' = 'desc';
    if (sort === 'asc' || sort === 'desc') {
        sortOrder = sort as 'asc' | 'desc';
    }

    // Tags param (handle string or string[])
    let selectedTags: string[] = [];
    if (tags) {
        if (Array.isArray(tags)) {
            selectedTags = tags.flatMap(tag => tag.split(','));
        } else {
            selectedTags = tags.split(',');
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

    // If page is out of bounds, show not-found
    if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
        return <BlogNotFound/>;
    }

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
