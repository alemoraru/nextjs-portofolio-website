import {notFound} from 'next/navigation'
import posts from '@/data/blog'
import path from 'path'
import fs from 'fs'
import {compileMDX} from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import Link from 'next/link'
import AnimatedArticle from "@/components/AnimatedArticle";

/**
 * Calculate the reading time of a text based on the number of words.
 * Assumes an average reading speed of 200 words per minute.
 * @param text The text to calculate the reading time for.
 */
function getReadingTime(text: string): number {
    const wordsPerMinute = 200
    const numberOfWords = text.trim().split(/\s+/).length
    return Math.ceil(numberOfWords / wordsPerMinute)
}

export default async function BlogPostPage({params}: { params: { slug: string } }) {
    const {slug} = await params // Await params before destructuring
    const post = posts.find(p => p.slug === slug)
    if (!post) return notFound()

    const filePath = path.join(process.cwd(), 'src', 'data', 'blog', `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return notFound()
    }

    const mdxSource = fs.readFileSync(filePath, 'utf-8')

    const readingTime = getReadingTime(mdxSource)
    const {content} = await compileMDX({
        source: mdxSource,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [rehypeHighlight],
            },
        },
    })

    return (
        <AnimatedArticle>
            <Link
                href="/blog"
                className="mb-8 text-blue-500 hover:text-blue-700 transition-all flex items-center gap-2"
            >
                <span className="inline-block transform transition-transform group-hover:-translate-x-1">
                    ←
                </span>
                Back to blogs
            </Link>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 mb-8">
                {new Date(post.date).toLocaleDateString()} • {readingTime} min read
            </p>
            <div className="prose dark:prose-invert">{content}</div>
        </AnimatedArticle>
    )
}
