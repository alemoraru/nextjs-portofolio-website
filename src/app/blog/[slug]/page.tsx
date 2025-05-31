import {notFound} from 'next/navigation'
import posts from '@/data/blog'
import path from 'path'
import fs from 'fs'
import {compileMDX} from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import AnimatedArticle from "@/components/AnimatedArticle";
import {pageParams} from "@/lib/types";
import BackToPageButton from "@/components/BackToPageButton";
import {CodeBlock} from "@/components/mdx/CodeBlock";
import {InlineCode} from "@/components/mdx/InlineCode";
import SimilarBlogPosts from "@/components/SimilarBlogPosts";
import BlogTag from "@/components/BlogTag";
import {ReactElement} from "react";
import {MDXComponents} from "mdx/types";
import remark_gfm from "remark-gfm";

/**
 * Calculate the reading time of a text based on the number of words.
 * Assumes an average reading speed of 200 words per minute.
 * @param text The text to calculate the reading time for.
 */
function getReadingTime(text: string): number {
    const wordsPerMinute = 100
    const numberOfWords = text.trim().split(/\s+/).length
    return Math.ceil(numberOfWords / wordsPerMinute)
}

/**
 * Generate static parameters for the blog post pages to be pre-rendered.
 */
export async function generateStaticParams() {
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

/**
 * BlogPostPage component that renders a single blog post based on the slug.
 */
export default async function BlogPostPage(props: { params: pageParams }) {
    const {slug} = await props.params
    const post = posts.find(p => p.slug === slug)
    if (!post) return notFound()

    const filePath = path.join(process.cwd(), 'src', 'data', 'blog', `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return notFound()
    }

    const mdxSource = fs.readFileSync(filePath, 'utf-8')
    const readingTime = getReadingTime(mdxSource)

    type PreProps = {
        children: ReactElement<{
            className?: string;
            children: string;
        }>;
    };

    const mdxComponents: MDXComponents = {
        pre: ({children}: PreProps) => {
            const child = children;

            if (child?.props && typeof child.props.className === 'string') {
                return <CodeBlock {...child.props} />;
            }

            return <pre>{children}</pre>;
        },

        code: ({children, className}) => {
            // Block-level code is handled by <pre> tags, so we can assume this is inline
            if (className) {
                return <code className={className}>{children}</code>;
            }

            return <InlineCode>{children}</InlineCode>;
        },
    };

    const {content} = await compileMDX({
        source: mdxSource,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remark_gfm],
                rehypePlugins: [[rehypeHighlight, {ignoreMissing: true}]]
            },
        },
        components: mdxComponents
    })

    return (
        <AnimatedArticle>
            <BackToPageButton pageUrl="/blog"/>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 mb-8">
                {new Date(post.date).toLocaleDateString()} • {readingTime} min read
            </p>
            {/* Display current blog post tags */}
            <div className="flex flex-wrap gap-2 mb-8 mt-2 justify-center items-center text-center">
                {post.tags && post.tags.map(tag => (
                    <BlogTag key={tag} tag={tag}/>
                ))}
            </div>
            <div className="prose dark:prose-invert max-w-full overflow-hidden">{content}</div>
            <SimilarBlogPosts allPosts={posts} currentPostPlug={slug} maxPosts={3}/>
        </AnimatedArticle>
    )
}
