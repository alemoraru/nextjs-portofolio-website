import BlogPost from "@/components/BlogPost";

/**
 * Component to display similar blog posts based on tags.
 */
interface SimilarBlogPostsProps {
    allPosts: { slug: string; title: string; summary: string; date?: string; tags?: string[] }[];
    currentPostPlug: string;
    maxPosts?: number;
    heading?: string;
}

/**
 * SimilarBlogPosts component displays a list of blog posts that are similar to the current post
 * @param allPosts the list of all blog posts available on the site
 * @param currentPostPlug the slug of the current post to find similar posts for
 * @param maxPosts the maximum number of similar posts to display
 * @param heading the heading for the similar posts section
     */
export default function SimilarBlogPosts(
    {
        allPosts,
        currentPostPlug,
        maxPosts = 3,
        heading = "Other posts that might interest you...",
    }: SimilarBlogPostsProps) {

    const currentPost = allPosts.find(p => p.slug === currentPostPlug);
    if (!currentPost) return null;

    const similar = allPosts
        .filter(
            p =>
                p.slug !== currentPostPlug &&
                p.tags?.some(tag => currentPost.tags?.includes(tag))
        )
        .slice(0, maxPosts);

    if (similar.length === 0) return null;

    return (
        <section className="mt-14 border-t pt-10 border-zinc-600">
            <h2 className="text-2xl font-semibold mb-6 text-center">{heading}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {similar.map(sim => (
                    <BlogPost
                        key={sim.slug}
                        slug={sim.slug}
                        title={sim.title}
                        summary={sim.summary}
                        date={sim.date}
                        tags={sim.tags}
                    />
                ))}
            </div>
        </section>
    );
}
