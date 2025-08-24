import Link from "next/link";
import posts from '@/data/blog';
import BlogPost from '@/components/BlogPost';
import {BlogPostProps, pageParams} from '@/lib/types';
import {FaArrowLeft, FaTag} from "react-icons/fa";

/**
 * BlogTagPage component that displays blog posts filtered by a specific tag.
 * We display posts that have the exact tag (case-insensitive), or suggest similar tags if none found.
 * This page is accessed via the "/blog/tag/[tag]" URL.
 * @param params - The route parameters including the tag to filter by.
 */
export default function BlogTagPage({params}: { params: pageParams & { tag: string } }) {

    // Decode the tag value to handle spaces and special characters
    const decodedTag = decodeURIComponent(params.tag);

    // Filter posts by tag (case-insensitive, exact match)
    const filteredPosts = posts.filter(post =>
        post.tags && post.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase())
    );

    // Dice coefficient for string similarity
    function diceCoefficient(a: string, b: string): number {
        if (!a.length || !b.length) return 0;
        if (a === b) return 1;
        const bigrams = (str: string) => {
            const s = str.toLowerCase();
            const pairs = [];
            for (let i = 0; i < s.length - 1; i++) {
                pairs.push(s.slice(i, i + 2));
            }
            return pairs;
        };
        const pairsA = bigrams(a);
        const pairsB = bigrams(b);
        const setB = new Set(pairsB);
        let matches = 0;
        for (const pair of pairsA) {
            if (setB.has(pair)) matches++;
        }
        return (2 * matches) / (pairsA.length + pairsB.length);
    }

    // Find top N posts with tags closest to the requested tag
    function getClosestTagPosts(posts: BlogPostProps[], targetTag: string, maxPosts: number = 3): Array<{
        post: BlogPostProps;
        bestScore: number;
        bestTag: string
    }> {
        return posts.map((post: BlogPostProps) => {
            const tags: string[] = post.tags ?? [];
            let bestScore = 0;
            let bestTag = '';
            for (const tag of tags) {
                const score = diceCoefficient(tag, targetTag);
                if (score > bestScore) {
                    bestScore = score;
                    bestTag = tag;
                }
            }
            return {post, bestScore, bestTag};
        })
            .filter(({bestScore}) => bestScore > 0)
            .sort((a, b) => b.bestScore - a.bestScore)
            .slice(0, maxPosts);
    }

    // For suggestions: find posts with tags closest to the requested tag
    const closestTagPosts = getClosestTagPosts(
        posts.filter(post =>
            post.tags && !post.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase())
        ),
        decodedTag,
        3
    );

    // If no posts are found for the tag, display a friendly message, link, and suggestions
    if (filteredPosts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-8">
                <FaTag className="w-8 h-8 text-blue-500 mb-2"/>
                <h1 className="text-2xl font-bold mb-2">No posts found for tag: <span
                    className="text-blue-600">{decodedTag}</span></h1>
                <Link href="/blog"
                      className="inline-flex items-center gap-2 text-blue-500 hover:underline font-medium mb-4">
                    <FaArrowLeft className="w-4 h-4"/>
                    Back to all blog posts
                </Link>
                {closestTagPosts.length > 0 && (
                    <div className="mt-4 w-full max-w-4xl">
                        <h2 className="text-lg font-semibold mb-2 text-center">You might be interested in these posts
                            with similar tags:</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
                            {closestTagPosts.map(({post, bestTag}) => (
                                <div key={post.slug}>
                                    <BlogPost {...post} />
                                    <div className="mt-2 text-xs text-gray-500">Most similar tag: <span
                                        className="font-semibold text-blue-600">{bestTag}</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Render the list of posts with the specified tag
    return (
        <div className="px-4 max-w-4xl mx-auto py-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <FaTag className="w-6 h-6 text-blue-500"/>

                {/* Responsive header: stacked on mobile, inline on md+ */}
                <div className="flex flex-col md:flex-row md:items-center">
                    <span className="text-2xl font-bold leading-tight md:mr-2">Posts tagged with</span>
                    <span className="text-blue-600 text-xl font-bold leading-tight">
                        &quot;{decodedTag}&quot;
                        <span className="ml-2 text-base font-semibold text-gray-500 align-middle">
                            ({filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''})
                        </span>
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {filteredPosts.map(post => (
                    <BlogPost key={post.slug} {...post} />
                ))}
            </div>
        </div>
    );
}
