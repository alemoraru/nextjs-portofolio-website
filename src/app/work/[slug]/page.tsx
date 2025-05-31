import {notFound} from 'next/navigation'
import path from 'path'
import fs from 'fs'
import {compileMDX} from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import work from "@/data/work";
import AnimatedArticle from "@/components/AnimatedArticle";
import StackIcon from "tech-stack-icons";
import {techStackMap} from "@/lib/constants";
import {Timeline, TimelineItem} from '@/components/mdx/Timeline'
import {pageParams} from "@/lib/types";
import BackToPageButton from "@/components/BackToPageButton";
import remark_gfm from "remark-gfm";

/**
 * Generate static parameters for the work item pages to be pre-rendered.
 */
export async function generateStaticParams() {
    return work.map((item) => ({
        slug: item.slug,
    }))
}

/**
 * WorkItemPage component that renders a single work item based on the slug.
 */
export default async function WorkItemPage(props: { params: pageParams }) {
    const {slug} = await props.params
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
    }>({
        source: mdxSource,
        components: {
            Timeline,
            TimelineItem,
        },
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remark_gfm],
                rehypePlugins: [rehypeHighlight],
            },
        },
    })

    return (
        <AnimatedArticle>
            <BackToPageButton pageUrl="/work"/>
            <h1 className="text-4xl font-bold mb-2">{frontmatter.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{frontmatter.description}</p>
            <h2 className="text-xl font-semibold mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-4 mb-8">
                {frontmatter.techStack?.map((tech) => (
                    <div
                        key={tech}
                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
                    >
                        <StackIcon
                            name={techStackMap[tech] || tech}
                            style={{width: '24px', height: '24px'}}
                        />
                        <span>{tech}</span>
                    </div>
                ))}
            </div>
            <div className="max-w-5xl prose dark:prose-invert">{content}</div>
        </AnimatedArticle>
    )
}
