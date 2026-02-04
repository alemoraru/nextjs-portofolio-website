import fs from "fs"
import path from "path"
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
import { homeIntroConfig } from "@/data/content"
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
 * Generate dedicated blog page metadata for SEO
 */
export async function generateMetadata(props: { params: pageParams }) {
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
 * Calculate duration between two dates and format it LinkedIn-style
 * @param start - Start date string (e.g., "Jan 2020", "January 2020", "2020-01")
 * @param end - End date string or "Present"
 * @returns Formatted duration (e.g., "2 yrs 3 mos", "6 mos", "1 yr")
 */
function calculateDuration(start: string, end: string): string {
  const parseDate = (dateStr: string): Date => {
    // Handle "Present" or similar
    if (dateStr.toLowerCase().includes("present") || dateStr.toLowerCase().includes("current")) {
      return new Date()
    }

    // Try parsing common formats
    // Format: "Jan 2020", "January 2020"
    const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/)
    if (monthYearMatch) {
      return new Date(`${monthYearMatch[1]} 1, ${monthYearMatch[2]}`)
    }

    // Format: "2020-01", "2020/01"
    const dashMatch = dateStr.match(/^(\d{4})[-/](\d{2})$/)
    if (dashMatch) {
      return new Date(parseInt(dashMatch[1]), parseInt(dashMatch[2]) - 1, 1)
    }

    // Fallback to Date constructor
    return new Date(dateStr)
  }

  const startDate = parseDate(start)
  const endDate = parseDate(end)

  // Calculate difference in months
  const yearDiff = endDate.getFullYear() - startDate.getFullYear()
  const monthDiff = endDate.getMonth() - startDate.getMonth()
  const totalMonths = yearDiff * 12 + monthDiff

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0 && months === 0) {
    return "1 mo"
  } else if (years === 0) {
    return `${months} mo${months > 1 ? "s" : ""}`
  } else if (months === 0) {
    return `${years} yr${years > 1 ? "s" : ""}`
  } else {
    return `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`
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
              <div
                key={techName}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
              >
                {techToIcon(techName)}
                <span>{techName}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="max-w-5xl prose dark:prose-invert">{content}</div>
    </AnimatedArticle>
  )
}
