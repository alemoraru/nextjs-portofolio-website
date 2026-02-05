import fs from "fs"
import path from "path"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import { BsStack } from "react-icons/bs"
import rehypeHighlight from "rehype-highlight"
import remark_gfm from "remark-gfm"
import AnimatedArticle from "@/components/AnimatedArticle"
import BackToPageButton from "@/components/BackToPageButton"
import { Timeline, TimelineItem } from "@/components/mdx/Timeline"
import TechBadge from "@/components/TechBadge"
import { homeIntroConfig } from "@/data/content"
import { getAllWorkItems } from "@/lib/mdx"
import { pageParams, WorkItemFrontmatter } from "@/lib/types"
import { calculateDuration } from "@/lib/utils"

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
 * Generate dedicated blog page metadata for SEO
 */
export async function generateMetadata(props: { params: pageParams }): Promise<Metadata> {
  const { slug } = await props.params
  const work = await getAllWorkItems()
  const post = work.find(w => w.slug === slug)

  if (!post) {
    return {
      title: "Work Not Found",
    }
  }

  return {
    title: `${post.company} - ${post.title} | ${homeIntroConfig.name}`,
    description: post.description,
    openGraph: {
      title: `${post.company} - ${post.title} | ${homeIntroConfig.name}`,
      description: post.description,
      type: "article",
    },
  }
}

/**
 * CompanyHeader component to display company logo and name
 */
function CompanyHeader({ frontmatter }: { frontmatter: WorkItemFrontmatter }) {
  return (
    <>
      {frontmatter.logoUrl && (
        <Image
          src={frontmatter.logoUrl}
          alt={`${frontmatter.company} logo`}
          width={48}
          height={48}
          className="rounded-lg object-contain"
        />
      )}
      <h1 className="text-4xl font-bold">{frontmatter.company}</h1>
    </>
  )
}

/**
 * WorkItemPage component that renders a single work item based on the slug.
 * It reads the corresponding MDX file, compiles it, and displays the content along with the frontmatter information.
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
      <div className="flex items-center gap-4 mb-2">
        {frontmatter.companyUrl ? (
          <Link
            href={frontmatter.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 hover:opacity-80 transition-opacity"
          >
            <CompanyHeader frontmatter={frontmatter} />
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <CompanyHeader frontmatter={frontmatter} />
          </div>
        )}
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">{frontmatter.description}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mb-6 flex items-center gap-2">
        <span>
          {frontmatter.start} - {frontmatter.end}
        </span>
        <span>·</span>
        <span>{calculateDuration(frontmatter.start, frontmatter.end)}</span>
      </p>
      {frontmatter.techStack && frontmatter.techStack.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <BsStack />
            <h2 className="text-xl font-semibold">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-4 mb-8">
            {frontmatter.techStack.map(techName => (
              <TechBadge key={techName} techName={techName} />
            ))}
          </div>
        </>
      )}
      <div className="max-w-5xl prose dark:prose-invert">{content}</div>
    </AnimatedArticle>
  )
}
