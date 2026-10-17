import BlogPost from "@/components/BlogPost"
import { DEFAULT_SIMILAR_POSTS_COUNT } from "@/lib/constants"
import { BlogPostProps } from "@/lib/types"

/**
 * @description Props for the SimilarBlogPosts component.
 */
interface SimilarBlogPostsProps {
  /** Every available blog post, including the one currently being viewed. */
  allPosts: BlogPostProps[]
  /** Slug of the post being viewed; it is excluded from the results. */
  currentPostPlug: string
  /** Maximum number of similar posts to show. Defaults to `DEFAULT_SIMILAR_POSTS_COUNT`. */
  maxPosts?: number
  /** Section heading shown above the posts. */
  heading?: string
}

/**
 * Computes a similarity score between two posts based on shared tags.
 * More shared tags = higher score.
 */
function computeTagSimilarity(postA: BlogPostProps, postB: BlogPostProps): number {
  const tagsA = new Set(postA.tags || [])
  const tagsB = new Set(postB.tags || [])

  const sharedTags = [...tagsA].filter(tag => tagsB.has(tag))
  const totalTags = new Set([...tagsA, ...tagsB])

  if (totalTags.size === 0) return 0

  // compute Jaccard similarity: |A ∩ B| / |A ∪ B|
  return sharedTags.length / totalTags.size
}

/**
 * Section listing other blog posts related to the current one, ranked by tag
 * similarity (see {@link computeTagSimilarity}). Posts with no shared tags are
 * omitted, and the component renders nothing if the current post is not found or
 * no similar posts exist.
 *
 * The grid adapts to the number of results via container queries: a single post
 * spans the full width, two posts split it in half (from 480px), and three or more
 * use up to three columns (from 800px).
 */
export default function SimilarBlogPosts({
  allPosts,
  currentPostPlug,
  maxPosts = DEFAULT_SIMILAR_POSTS_COUNT,
  heading = "Other posts that might interest you...",
}: SimilarBlogPostsProps) {
  const currentPost = allPosts.find(p => p.slug === currentPostPlug)
  if (!currentPost) return null

  const scoredPosts = allPosts
    .filter(p => p.slug !== currentPostPlug)
    .map(post => ({
      ...post,
      similarityScore: computeTagSimilarity(currentPost, post),
    }))
    .filter(p => p.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, maxPosts)

  if (scoredPosts.length === 0) return null

  // Cap columns at the post count so a lone post spans the full width and two split it in half
  const gridCols =
    scoredPosts.length === 1
      ? "grid-cols-1"
      : scoredPosts.length === 2
        ? "@[480px]:grid-cols-2"
        : "@[480px]:grid-cols-2 @[800px]:grid-cols-3"

  return (
    <section className="w-full mt-14 border-t pt-10 border-zinc-600">
      <h2 className="text-2xl font-semibold mb-6 text-center">{heading}</h2>
      <div className="@container">
        <div className={`grid gap-4 ${gridCols}`}>
          {scoredPosts.map(sim => (
            <BlogPost
              key={sim.slug}
              slug={sim.slug}
              title={sim.title}
              summary={sim.summary}
              date={sim.date}
              tags={sim.tags}
              readingTime={sim.readingTime}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
