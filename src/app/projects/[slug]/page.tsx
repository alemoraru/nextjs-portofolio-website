import fs from "fs"
import path from "path"
import Link from "next/link"
import { notFound } from "next/navigation"
import { compileMDX } from "next-mdx-remote/rsc"
import { BsStack, BsCardImage } from "react-icons/bs"
import { FaUsers, FaUserTie, FaClock, FaGithub, FaBook } from "react-icons/fa"
import rehypeHighlight from "rehype-highlight"
import remark_gfm from "remark-gfm"
import AnimatedArticle from "@/components/AnimatedArticle"
import BackToPageButton from "@/components/BackToPageButton"
import ImageCarousel from "@/components/ImageCarousel"
import { techToIcon } from "@/lib/devIcons"
import { getAllProjects } from "@/lib/mdx"
import { pageParams, ProjectFrontmatter } from "@/lib/types"

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
  const duration = `${frontmatter.startDate}–${frontmatter.endDate}`

  // Get project images
  const projectImages: { src: string; alt: string }[] = []
  if (fs.existsSync(projectPhotoDir)) {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
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
      <h1 className="text-3xl font-extrabold mb-4">{frontmatter.title}</h1>

      {/* Links Section */}
      <div className="mb-4">
        {frontmatter.githubUrl && (
          <Link
            href={frontmatter.githubUrl}
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-800 dark:text-gray-100 hover:text-blue-600 transition"
          >
            <FaGithub className="mr-2 w-5 h-5" />
            <span className="underline underline-offset-4">View on GitHub</span>
          </Link>
        )}
        {frontmatter.paperUrl && (
          <Link
            href={frontmatter.paperUrl}
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-800 dark:text-gray-100 hover:text-blue-600 transition ml-6"
          >
            <FaBook className="mr-2 w-5 h-5" />
            <span className="underline underline-offset-4">Read Paper</span>
          </Link>
        )}
      </div>

      {/* Project Metadata */}
      <div className="w-full mb-6 bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          {frontmatter.teamSize && (
            <div className="flex items-center gap-2">
              <FaUsers className="text-blue-500" />
              <span>
                <strong>Team Size:</strong> {frontmatter.teamSize}
              </span>
            </div>
          )}
          {frontmatter.role && (
            <div className="flex items-center gap-2">
              <FaUserTie className="text-green-500" />
              <span>
                <strong>Role:</strong> {frontmatter.role}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaClock className="text-purple-500" />
            <span>
              <strong>Duration:</strong> {duration}
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 mb-4" style={{ fontSize: "1.25rem" }}>
          <BsStack></BsStack>
          <h2 className="text-xl font-semibold">Tech Stack</h2>
        </div>
        <ul className="flex flex-wrap gap-4">
          {frontmatter.techStack?.map(TechName => (
            <li key={TechName} className="flex items-center gap-2">
              {techToIcon(TechName)}
              <span>{TechName}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Image Carousel - Display project photos if available */}
      {projectImages.length > 0 && (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-4" style={{ fontSize: "1.25rem" }}>
            <BsCardImage></BsCardImage>
            <h2 className="text-xl font-semibold">Project Gallery</h2>
          </div>
          <ImageCarousel images={projectImages} />
        </div>
      )}

      {/* Display the actual content of the .mdx file */}
      <div className="max-w-4xl prose dark:prose-invert">{content}</div>
    </AnimatedArticle>
  )
}
