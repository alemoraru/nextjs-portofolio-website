import fs from "fs"
import path from "path"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import { BsCardImage, BsStack } from "react-icons/bs"
import { FaUsers, FaUserTie, FaClock, FaGithub, FaBook } from "react-icons/fa"
import rehypeHighlight from "rehype-highlight"
import remark_gfm from "remark-gfm"
import AnimatedArticle from "@/components/AnimatedArticle"
import BackToPageButton from "@/components/BackToPageButton"
import ProjectImageCarousel from "@/components/ProjectImageCarousel"
import TechBadge from "@/components/TechBadge"
import { homeIntroConfig } from "@/data/content"
import { getAllProjects } from "@/lib/mdx"
import { pageParams, ProjectFrontmatter } from "@/lib/types"
import { formatDuration } from "@/lib/utils"

/**
 * Generate static parameters for the project pages to be pre-rendered.
 */
export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map(project => ({
    slug: project.slug,
  }))
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(props: { params: pageParams }): Promise<Metadata> {
  const { slug } = await props.params
  const projects = await getAllProjects()
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | ${homeIntroConfig.name}`,
    description: project.description,
    openGraph: {
      title: `${project.title} | ${homeIntroConfig.name}`,
      description: project.description,
      type: "article",
    },
  }
}

/**
 * ProjectPage component that renders a single project based on the slug.
 */
export default async function ProjectPage(props: { params: pageParams }) {
  const { slug } = await props.params
  const projects = await getAllProjects()
  const post = projects.find(p => p.slug === slug)
  if (!post) return notFound()

  const filePath = path.join(process.cwd(), "src", "data", "projects", `${slug}.mdx`)
  const projectPhotoDir = path.join(process.cwd(), "public", "projects", slug)

  if (!fs.existsSync(filePath)) {
    return notFound()
  }

  const mdxSource = fs.readFileSync(filePath, "utf-8")

  const { content, frontmatter } = await compileMDX<ProjectFrontmatter>({
    source: mdxSource,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remark_gfm],
        rehypePlugins: [rehypeHighlight],
      },
    },
  })

  // Format duration from startDate and endDate
  const duration = formatDuration(frontmatter.startDate, frontmatter.endDate)

  // Get project images
  const projectImages: { src: string; alt: string }[] = []
  if (fs.existsSync(projectPhotoDir)) {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp"]
    const imageFiles = fs
      .readdirSync(projectPhotoDir)
      .filter(f => allowedExtensions.includes(path.extname(f).toLowerCase()))

    imageFiles.forEach((filename, index) => {
      projectImages.push({
        src: `/projects/${slug}/${filename}`,
        alt: `${frontmatter.title} ${index + 1}`,
      })
    })
  }

  return (
    <AnimatedArticle>
      <BackToPageButton pageUrl="/projects" />

      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">{frontmatter.title}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{frontmatter.description}</p>

      {/* Metadata Pills & Links */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {frontmatter.teamSize && (
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
            <FaUsers className="w-4 h-4" />
            <span>
              <strong>Team Size:</strong> {frontmatter.teamSize}
            </span>
          </div>
        )}
        {frontmatter.role && (
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
            <FaUserTie className="w-4 h-4" />
            <span>
              <strong>Role:</strong> {frontmatter.role}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
          <FaClock className="w-4 h-4" />
          <span>
            <strong>Duration:</strong> {duration}
          </span>
        </div>
        {frontmatter.githubUrl && (
          <Link
            href={frontmatter.githubUrl}
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm transition"
          >
            <FaGithub className="w-4 h-4" />
            <span>View on GitHub</span>
          </Link>
        )}
        {frontmatter.paperUrl && (
          <Link
            href={frontmatter.paperUrl}
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm transition"
          >
            <FaBook className="w-4 h-4" />
            <span>Read Paper</span>
          </Link>
        )}
      </div>

      {/* Tech Stack Section */}
      <div className="flex items-center gap-2 mb-4">
        <BsStack />
        <h2 className="text-xl font-semibold">Tech Stack</h2>
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        {frontmatter.techStack?.map(techName => (
          <TechBadge key={techName} techName={techName} />
        ))}
      </div>

      {/* Image Carousel - Display project photos if available */}
      {projectImages.length > 0 && (
        <div className="w-full">
          <div
            className="flex items-center justify-center gap-2 mb-4"
            style={{ fontSize: "1.25rem" }}
          >
            <BsCardImage />
            <h2 className="text-xl font-semibold">Project Gallery</h2>
          </div>
          <ProjectImageCarousel images={projectImages} />
        </div>
      )}

      {/* Display the actual content of the .mdx file */}
      <div className="max-w-4xl prose dark:prose-invert">{content}</div>
    </AnimatedArticle>
  )
}
