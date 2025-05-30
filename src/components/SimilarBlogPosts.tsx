import BlogPost from "@/components/BlogPost";
import {BlogPostProps} from "@/lib/types";

/**
 * @description Props for the SimilarBlogPosts component.
 */
interface SimilarBlogPostsProps {
    allPosts: BlogPostProps[];
    currentPostPlug: string;
    maxPosts?: number;
    heading?: string;
}

/**
 * Computes a similarity score between two posts based on shared tags.
 * More shared tags = higher score.
 */
function computeTagSimilarity(postA: BlogPostProps, postB: BlogPostProps): number {
    const tagsA = new Set(postA.tags || []);
    const tagsB = new Set(postB.tags || []);

    const sharedTags = [...tagsA].filter(tag => tagsB.has(tag));
    const totalTags = new Set([...tagsA, ...tagsB]);

    if (totalTags.size === 0) return 0;

    // compute Jaccard similarity: |A ∩ B| / |A ∪ B|
    return sharedTags.length / totalTags.size;
}

export default function SimilarBlogPosts(
    {
        allPosts,
        currentPostPlug,
        maxPosts = 3,
        heading = "Other posts that might interest you...",
    }: SimilarBlogPostsProps) {
    const currentPost = allPosts.find(p => p.slug === currentPostPlug);
    if (!currentPost) return null;

    const scoredPosts = allPosts
        .filter(p => p.slug !== currentPostPlug)
        .map(post => ({
            ...post,
            similarityScore: computeTagSimilarity(currentPost, post),
        }))
        .filter(p => p.similarityScore > 0)
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, maxPosts);

    if (scoredPosts.length === 0) return null;

    return (
        <section className="mt-14 border-t pt-10 border-zinc-600">
            <h2 className="text-2xl font-semibold mb-6 text-center">{heading}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {scoredPosts.map(sim => (
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
