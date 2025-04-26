import {notFound} from 'next/navigation'
import path from 'path'
import fs from 'fs'
import {compileMDX} from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import Link from 'next/link'
import work from "@/data/work";
import AnimatedArticle from "@/components/AnimatedArticle";

export default async function WorkItemPage({params}: { params: { slug: string } }) {
    const {slug} = await params // Await params before destructuring
    const post = work.find(w => w.slug === slug)
    if (!post) return notFound()

    const filePath = path.join(process.cwd(), 'src', 'data', 'work', `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return notFound()
    }

    const mdxSource = fs.readFileSync(filePath, 'utf-8')

    const {content, frontmatter} = await compileMDX<{
        name: string
        description: string
        techStack: string[]
        position: string
    }>({
        source: mdxSource,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [rehypeHighlight],
            },
        },
    })

    /**
     * Temporary mapping for tech stack icons.
     */
    const techStackMap: Record<string, string> = {
        'React': 'reactjs',
        'TypeScript': 'typescript',
        'TailwindCSS': 'tailwindcss',
        'Node.js': 'nodejs',
        'NextJS': 'nextjs',
        'aws': 'aws',
        'MongoDB': 'mongodb',
        'PostgreSQL': 'postgresql',
        'Python': 'python',
        'Flask': 'flask',
        'Solidity': 'solidity',
        'C#': 'csharp',
        'Firebase': 'firebase',
        'AWS IoT': 'aws',
        'C++': 'c++',
        'Azure': 'azure'
    }

    return (
        <AnimatedArticle>
            <Link
                href="/work"
                className="mb-8 text-blue-500 hover:text-blue-700 transition-all flex items-center gap-2"
            >
            <span className="inline-block transform transition-transform group-hover:-translate-x-1">
                ←
            </span>
                Back to work
            </Link>
            <h1 className="text-3xl font-extrabold mb-4">{frontmatter.name}</h1>

            <div className="max-w-4xl prose dark:prose-invert">{content}</div>
        </AnimatedArticle>
    )
}
