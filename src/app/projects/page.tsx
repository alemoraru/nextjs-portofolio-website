import { redirect } from "next/navigation"
import { homeIntroConfig, paginationConfig } from "@/data/content"
import { getAllProjects } from "@/lib/mdx"
import ProjectsClientUI from "./ProjectsClientUI"
import ProjectsNotFound from "./ProjectsNotFound"

const PROJECTS_PAGE_SIZE = paginationConfig.projectsPerPage

/**
 * Generate metadata for SEO
 */
export async function generateMetadata() {
  return {
    title: `Projects | ${homeIntroConfig.name}`,
    description: "Browse my portfolio of projects, side projects, and technical work.",
    openGraph: {
      title: `Projects | ${homeIntroConfig.name}`,
      description: "Browse my portfolio of projects, side projects, and technical work.",
      type: "website",
    },
  }
}

/**
 * ProjectsPage component that serves as the main page for displaying projects.
 * This is accessed at the "/projects" URL of the application.
 */
export default async function ProjectsPage(props: {
  searchParams?: Promise<{
    page?: string
    sort?: string
    tech?: string | string[]
  }>
}) {
  // Get all projects from MDX files
  const projects = await getAllProjects()

  // Destructure all query params at once
  const searchParams = await props.searchParams

  // Page param
  const currentPage = Number(searchParams?.page) || 1
  const { sort, tech } = searchParams || {}

  // Sort param (default: newest)
  const allowedSorts = ["newest", "oldest"]
  let sortOrder: "newest" | "oldest" = "newest"
  let sortIsValid: boolean
  if (sort && allowedSorts.includes(sort as string)) {
    sortOrder = sort as "newest" | "oldest"
    sortIsValid = true
  } else {
    sortOrder = "newest"
    sortIsValid = false
  }

  // If sort is invalid, rewrite the URL
  if (sort && !sortIsValid) {
    const params = new URLSearchParams()
    if (searchParams?.page) params.set("page", String(currentPage))
    if (tech) {
      if (Array.isArray(tech)) {
        params.set("tech", tech.join(","))
      } else {
        params.set("tech", tech)
      }
    }
    params.set("sort", sortOrder)
    redirect(`/projects${params.toString() ? "?" + params.toString() : ""}`)
  }

  // Tech param (handle string or string[])
  let selectedTechStack: string[] = []
  if (tech) {
    if (Array.isArray(tech)) {
      selectedTechStack = tech.flatMap(t => t.split(","))
    } else {
      selectedTechStack = tech.split(",")
    }
  }

  // Unique tech stack for filter dropdown
  const techStackCounts: Record<string, number> = {}
  projects.forEach(project => {
    ;(project.techStack || []).forEach(tech => {
      techStackCounts[tech] = (techStackCounts[tech] || 0) + 1
    })
  })
  const uniqueTechStack = Object.entries(techStackCounts)
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => a.tech.localeCompare(b.tech))

  // Filter and sort projects
  const filteredProjects = projects
    .filter(
      project =>
        selectedTechStack.length === 0 ||
        (project.techStack && selectedTechStack.some(tech => project.techStack.includes(tech)))
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        // Items with "Present" should be at the top
        const aIsPresent = a.endDate === "Present"
        const bIsPresent = b.endDate === "Present"

        if (aIsPresent && !bIsPresent) return -1
        if (!aIsPresent && bIsPresent) return 1

        // If both are Present, sort by title
        if (aIsPresent && bIsPresent) {
          return a.title.localeCompare(b.title)
        }

        // Otherwise sort by end date (newest first)
        const endDiff = new Date(b.endDate || "").getTime() - new Date(a.endDate || "").getTime()
        if (endDiff !== 0) return endDiff

        // If end dates are the same, sort by title
        return a.title.localeCompare(b.title)
      } else {
        return new Date(a.startDate || "").getTime() - new Date(b.startDate || "").getTime()
      }
    })

  // Calculate total pages and clamp currentPage
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PAGE_SIZE)

  // If page is out of bounds, show not-found
  if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
    return <ProjectsNotFound />
  }

  // Paginate the filtered projects
  const start = (currentPage - 1) * PROJECTS_PAGE_SIZE
  const paginatedProjects = filteredProjects.slice(start, start + PROJECTS_PAGE_SIZE)

  return (
    <ProjectsClientUI
      uniqueTechStack={uniqueTechStack}
      selectedTechStack={selectedTechStack}
      sortOrder={sortOrder}
      filteredProjects={filteredProjects}
      paginatedProjects={paginatedProjects}
      currentPage={currentPage}
      totalPages={totalPages}
      baseUrl="/projects"
    />
  )
}
