import Link from "next/link";
import posts from '@/data/blog';
import BlogPost from '@/components/BlogPost';
import {pageParams} from '@/lib/types';
import {FaTag, FaArrowLeft} from "react-icons/fa";

/**
 * BlogTagPage component that displays blog posts filtered by a specific tag.
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

    // Similarity function
    function computeTagSimilarity(postTags: string[], targetTag: string): number {
        if (!postTags || postTags.length === 0) return 0;
        // Jaccard similarity: 1 if tag is present, 0 otherwise (since only one tag)
        return postTags.includes(targetTag) ? 1 : 0;
    }

    // For suggestions: score posts by tag similarity (excluding exact matches)
    const similarPosts = posts
        .filter(post =>
            post.tags && !post.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase())
        )
        .map(post => ({
            post,
            score: computeTagSimilarity((post.tags ?? []).map(t => t.toLowerCase()), decodedTag.toLowerCase())
        }))
        .filter(({score}) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({post}) => post);

    // If no posts are found for the tag, display a friendly message, link, and suggestions
    if (filteredPosts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-8">
                <FaTag className="w-8 h-8 text-blue-500 mb-2"/>
                <h1 className="text-2xl font-bold mb-2">No posts found for tag: <span
                    className="text-blue-600">{decodedTag}</span></h1>

                {/* Back to main page for blog posts */}
                <Link href="/blog"
                      className="inline-flex items-center gap-2 text-blue-500 hover:underline font-medium mb-4">
                    <FaArrowLeft className="w-4 h-4"/>
                    Back to all blog posts

                </Link>
                {similarPosts.length > 0 && (
                    <div className="mt-4 w-full max-w-2xl">
                        <h2 className="text-lg font-semibold mb-2">You might be interested in these posts with similar
                            tags:</h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {similarPosts.map(post => (
                                <BlogPost key={post.slug} {...post} />
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
