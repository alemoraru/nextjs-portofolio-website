import { Metadata } from "next"
import { redirect } from "next/navigation"
import { homeIntroConfig, paginationConfig } from "@/data/content"
import { getAllWorkItems } from "@/lib/mdx"
import WorkClientUI from "./WorkClientUI"
import WorkNotFound from "./WorkNotFound"

const WORK_PAGE_SIZE = paginationConfig.projectsPerPage

/**
 * Generate metadata for SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Work | ${homeIntroConfig.name}`,
    description: "Explore my professional work experience and career journey.",
    openGraph: {
      title: `Work | ${homeIntroConfig.name}`,
      description: "Explore my professional work experience and career journey.",
      type: "website",
    },
  }
}

/**
 * WorkPage component that serves as the main page for displaying work experience.
 * This is accessed at the "/work" URL of the application.
 */
export default async function WorkPage(props: {
  searchParams?: Promise<{
    page?: string
    sort?: string
    company?: string | string[]
  }>
}) {
  // Get all work items from MDX files
  const work = await getAllWorkItems()

  // Destructure all query params at once
  const searchParams = await props.searchParams

  // Page param
  const currentPage = Number(searchParams?.page) || 1
  const { sort, company } = searchParams || {}

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
    if (company) {
      if (Array.isArray(company)) {
        params.set("company", company.join(","))
      } else {
        params.set("company", company)
      }
    }
    params.set("sort", sortOrder)
    redirect(`/work${params.toString() ? "?" + params.toString() : ""}`)
  }

  // Company param (handle string or string[])
  let selectedCompanies: string[] = []
  if (company) {
    if (Array.isArray(company)) {
      selectedCompanies = company.flatMap(c => c.split(","))
    } else {
      selectedCompanies = company.split(",")
    }
  }

  // Unique companies for filter dropdown
  const companyCounts: Record<string, number> = {}
  work.forEach(workItem => {
    companyCounts[workItem.company] = (companyCounts[workItem.company] || 0) + 1
  })
  const uniqueCompanies = Object.entries(companyCounts)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => a.company.localeCompare(b.company))

  // Filter and sort work items
  const filteredWorkItems = work
    .filter(
      workItem =>
        selectedCompanies.length === 0 ||
        (workItem.company && selectedCompanies.some(company => workItem.company === company))
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        // Items with "Present" should be at the top
        const aIsPresent = a.end === "Present"
        const bIsPresent = b.end === "Present"

        if (aIsPresent && !bIsPresent) return -1
        if (!aIsPresent && bIsPresent) return 1

        // If both are Present, sort by company name
        if (aIsPresent && bIsPresent) {
          return a.company.localeCompare(b.company)
        }

        // Otherwise sort by end date (newest first)
        const endDiff = new Date(b.end || "").getTime() - new Date(a.end || "").getTime()
        if (endDiff !== 0) return endDiff

        // If end dates are the same, sort by company name
        return a.company.localeCompare(b.company)
      } else {
        return new Date(a.start || "").getTime() - new Date(b.start || "").getTime()
      }
    })

  // Calculate total pages and clamp currentPage
  const totalPages = Math.ceil(filteredWorkItems.length / WORK_PAGE_SIZE)

  // If page is out of bounds, show not-found
  if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
    return <WorkNotFound />
  }

  // Paginate
  const start = (currentPage - 1) * WORK_PAGE_SIZE
  const paginatedWorkItems = filteredWorkItems.slice(start, start + WORK_PAGE_SIZE)

  return (
    <WorkClientUI
      uniqueCompanies={uniqueCompanies}
      selectedCompanies={selectedCompanies}
      sortOrder={sortOrder}
      filteredWorkItems={filteredWorkItems}
      paginatedWorkItems={paginatedWorkItems}
      currentPage={currentPage}
      totalPages={totalPages}
      baseUrl="/work"
    />
  )
}
