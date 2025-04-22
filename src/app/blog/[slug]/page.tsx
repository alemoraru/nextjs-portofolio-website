import {notFound} from 'next/navigation'
import posts from '@/data/blog'
import path from 'path'
import fs from 'fs'
import {compileMDX} from 'next-mdx-remote/rsc'

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
        <article className="mx-auto px-4">
            <h1>{post.title}</h1>
            <p className="text-gray-500">{post.date}</p>
            {content}
        </article>
    )
}
