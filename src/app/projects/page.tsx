import ProjectsClientUI from "./ProjectsClientUI"
import ProjectsNotFound from "./ProjectsNotFound"
import projects from "@/data/projects"
import { redirect } from "next/navigation"

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
  // Destructure all query params at once
  const searchParams = await props.searchParams

  // Page param
  const currentPage = Number(searchParams?.page) || 1
  const { sort, tech } = searchParams || {}
  const PROJECTS_PER_PAGE = 6

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
        return new Date(b.endDate || "").getTime() - new Date(a.endDate || "").getTime()
      } else {
        return new Date(a.startDate || "").getTime() - new Date(b.startDate || "").getTime()
      }
    })

  // Calculate total pages and clamp currentPage
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)

  // If page is out of bounds, show not-found
  if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
    return <ProjectsNotFound />
  }

  // Paginate the filtered projects
  const start = (currentPage - 1) * PROJECTS_PER_PAGE
  const paginatedProjects = filteredProjects.slice(start, start + PROJECTS_PER_PAGE)

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
