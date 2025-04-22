import {notFound} from 'next/navigation'
import posts from '@/data/blog'
import path from 'path'
import fs from 'fs'
import {compileMDX} from 'next-mdx-remote/rsc'
import Link from 'next/link'

export default async function BlogPostPage({params}: { params: { slug: string } }) {
    const {slug} = await params // Await params before destructuring
    const post = posts.find(p => p.slug === slug)
    if (!post) return notFound()

    const filePath = path.join(process.cwd(), 'src', 'data', 'blog', `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return notFound()
    }

    const mdxSource = fs.readFileSync(filePath, 'utf-8')

    const {content} = await compileMDX({source: mdxSource})

    return (
        <article className="mx-auto px-4 max-w-3xl flex flex-col items-center justify-center text-left">
            <Link
                href="/blog"
                className="mb-8 text-blue-500 hover:text-blue-700 transition-all flex items-center gap-2"
            >
                <span className="inline-block transform transition-transform group-hover:-translate-x-1">
                    ←
                </span>
                Back to blogs
            </Link>
            <h1 className="text-3xl font-bold text-center mb-4">{post.title}</h1>
            <p className="text-gray-500 text-center mb-8">{post.date}</p>
            <div className="prose dark:prose-invert">{content}</div>
        </article>
    )
}
