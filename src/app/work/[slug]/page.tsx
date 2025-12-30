import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight"
import remark_gfm from "remark-gfm"
import AnimatedArticle from "@/components/AnimatedArticle"
import BackToPageButton from "@/components/BackToPageButton"
import { Timeline, TimelineItem } from "@/components/mdx/Timeline"
import { techToIcon } from "@/lib/devIcons"
import { getAllWorkItems } from "@/lib/mdx"
import { pageParams, WorkItemFrontmatter } from "@/lib/types"

/**
 * Generate static parameters for the work item pages to be pre-rendered.
 */
export async function generateStaticParams() {
  const work = await getAllWorkItems()
  return work.map(item => ({
    slug: item.slug,
  }))
}

/**
 * WorkItemPage component that renders a single work item based on the slug.
 */
export default async function WorkItemPage(props: { params: pageParams }) {
  const { slug } = await props.params
  const work = await getAllWorkItems()
  const post = work.find(w => w.slug === slug)
  if (!post) return notFound()

  const filePath = path.join(process.cwd(), "src", "data", "work", `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return notFound()
  }

  const mdxSource = fs.readFileSync(filePath, "utf-8")

  const { content, frontmatter } = await compileMDX<WorkItemFrontmatter>({
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
      <BackToPageButton pageUrl="/work" />
      <h1 className="text-4xl font-bold mb-2">{frontmatter.company}</h1>
      <p className="text-lg text-gray-600 mb-6">{frontmatter.description}</p>
      <h2 className="text-xl font-semibold mb-6">Tech Stack</h2>
      <div className="flex flex-wrap gap-4 mb-8">
        {frontmatter.techStack?.map(techName => (
          <div
            key={techName}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
          >
            {techToIcon(techName)}
            <span>{techName}</span>
          </div>
        ))}
      </div>
      <div className="max-w-5xl prose dark:prose-invert">{content}</div>
    </AnimatedArticle>
  )
}
