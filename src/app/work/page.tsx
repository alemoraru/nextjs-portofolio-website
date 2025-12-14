import { redirect } from "next/navigation"
import work from "@/data/work"
import WorkClientUI from "./WorkClientUI"
import WorkNotFound from "./WorkNotFound"

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
  // Destructure all query params at once
  const searchParams = await props.searchParams

  // Page param
  const currentPage = Number(searchParams?.page) || 1
  const { sort, company } = searchParams || {}
  const WORK_PER_PAGE = 6

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
        return new Date(b.end || "").getTime() - new Date(a.end || "").getTime()
      } else {
        return new Date(a.start || "").getTime() - new Date(b.start || "").getTime()
      }
    })

  // Calculate total pages and clamp currentPage
  const totalPages = Math.ceil(filteredWorkItems.length / WORK_PER_PAGE)

  // If page is out of bounds, show not-found
  if (currentPage < 1 || (totalPages > 0 && currentPage > totalPages)) {
    return <WorkNotFound />
  }

  // Paginate
  const start = (currentPage - 1) * WORK_PER_PAGE
  const paginatedWorkItems = filteredWorkItems.slice(start, start + WORK_PER_PAGE)

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
