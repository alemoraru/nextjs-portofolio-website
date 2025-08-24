import posts from '@/data/blog';
import BlogPost from '@/components/BlogPost';
import AnimatedArticle from '@/components/AnimatedArticle';
import {pageParams} from '@/lib/types';

/**
 * BlogTagPage component that displays blog posts filtered by a specific tag.
 * This page is accessed via the "/blog/tag/[tag]" URL.
 * @param params - The route parameters including the tag to filter by.
 */
export default function BlogTagPage({params}: { params: pageParams & { tag: string } }) {
    const {tag} = params;

    // Filter posts by tag (case-insensitive)
    const filteredPosts = posts.filter(post =>
        post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );

    // If no posts are found for the tag, display a message
    if (filteredPosts.length === 0) {
        return (
            <AnimatedArticle>
                <h1 className="text-2xl font-bold mb-4">No posts found for tag: {tag}</h1>
            </AnimatedArticle>
        );
    }

    return (
        <AnimatedArticle>
            <h1 className="text-2xl font-bold mb-4">Posts tagged with "{tag}"</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map(post => (
                    <BlogPost key={post.slug} {...post} />
                ))}
            </div>
        </AnimatedArticle>
    );
}

