import fs from "fs"
import path from "path"
import { MDXComponents } from "mdx/types"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import { ReactElement } from "react"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import remark_gfm from "remark-gfm"
import AnimatedArticle from "@/components/AnimatedArticle"
import BackToPageButton from "@/components/BackToPageButton"
import BlogTag from "@/components/BlogTag"
import { CodeBlock } from "@/components/mdx/CodeBlock"
import { InlineCode } from "@/components/mdx/InlineCode"
import SimilarBlogPosts from "@/components/SimilarBlogPosts"
import TableOfContents from "@/components/TableOfContents"
import { homeIntroConfig } from "@/data/content"
import { getAllBlogPosts } from "@/lib/mdx"
import { pageParams } from "@/lib/types"

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
  const posts = await getAllBlogPosts()
  return posts.map(post => ({
    slug: post.slug,
  }))
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(props: { params: pageParams }): Promise<Metadata> {
  const { slug } = await props.params
  const posts = await getAllBlogPosts()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  return {
    title: `${post.title} | ${homeIntroConfig.name}`,
    description: post.title,
    openGraph: {
      title: `${post.title} | ${homeIntroConfig.name}`,
      description: post.title,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

/**
 * BlogPostPage component that renders a single blog post based on the slug.
 */
export default async function BlogPostPage(props: { params: pageParams }) {
  const { slug } = await props.params
  const posts = await getAllBlogPosts()
  const post = posts.find(p => p.slug === slug)
  if (!post) return notFound()

  const filePath = path.join(process.cwd(), "src", "data", "blog", `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return notFound()
  }

  const mdxSource = fs.readFileSync(filePath, "utf-8")
  const readingTime = getReadingTime(mdxSource)

  type PreProps = {
    children: ReactElement<{
      className?: string
      children: string
    }>
  }

  const mdxComponents: MDXComponents = {
    pre: ({ children }: PreProps) => {
      const child = children

      if (child?.props && typeof child.props.className === "string") {
        return <CodeBlock {...child.props} />
      }

      return <pre>{children}</pre>
    },

    code: ({ children, className }) => {
      // Block-level code is handled by <pre> tags, so we can assume this is inline
      if (className) {
        return <code className={className}>{children}</code>
      }

      return <InlineCode>{children}</InlineCode>
    },

    Image,
  }

  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remark_gfm],
        rehypePlugins: [
          rehypeSlug, // Automatically adds IDs to headings
          [rehypeHighlight, { ignoreMissing: true }],
        ],
      },
    },
    components: mdxComponents,
  })

  return (
    <AnimatedArticle>
      <BackToPageButton pageUrl="/blog" />
      <div className="text-3xl font-bold mb-4">{post.title}</div>
      <div className="flex items-center gap-4 text-gray-500 mb-8">
        <span>
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span>•</span>
        <span>{readingTime} min read</span>
      </div>

      {/* Display current blog post tags */}
      <div className="flex flex-wrap gap-2 mb-8 mt-2 justify-center items-center text-center">
        {post.tags &&
          post.tags.map(tag => (
            <BlogTag key={tag} tag={tag} href={`/blog/tag/${encodeURIComponent(tag)}`} />
          ))}
      </div>

      {/* Table of Contents */}
      <TableOfContents />

      <div className="prose dark:prose-invert max-w-full overflow-hidden">{content}</div>
      <SimilarBlogPosts allPosts={posts} currentPostPlug={slug} maxPosts={3} />
    </AnimatedArticle>
  )
}
