import { siteMetadata } from "@/data/metadata"
import { getAllBlogPosts, getAllProjects, getAllWorkItems } from "@/lib/mdx"
import type { MetadataRoute } from "next"

const base = siteMetadata.siteUrl

/**
 * Parses a "Mon YYYY" string (e.g. "Aug 2024") to the first of that month, in UTC so the
 * result doesn't depend on the build machine's timezone.
 */
const monthStart = (value: string) => new Date(`${value} 1 UTC`)

/** The most recent of the given dates. */
const newest = (dates: Date[]) => new Date(Math.max(...dates.map(Number)))

/**
 * Generates a sitemap.xml file for the website.
 *
 * Entries, in order: static pages (`/`, `/work`, `/projects`, `/blog`), blog posts, blog tag
 * pages, work items, and projects.
 *
 * `lastModified` is derived from content dates, never from the build time, so it only changes
 * when content does (a build-time `new Date()` would mark every page as modified on each deploy):
 * - Blog post: its `date`.
 * - Project: its `endDate`.
 * - Work item: its `end` date, or its `start` date if the role is ongoing ("Present"); both are
 *   "Mon YYYY" values, treated as the 1st of that month.
 * - Listing pages (`/blog`, `/projects`, `/work`): the newest item they list.
 * - Blog tag page: the newest post carrying that tag.
 * - Home (`/`): the newest of the blog, projects, and work dates.
 *
 * Work items with several positions still use a single date, since per-position dates only
 * exist in the MDX body, not in the frontmatter.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, workItems, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllWorkItems(),
    getAllProjects(),
  ])

  const tags = [...new Set(posts.flatMap(post => post.tags ?? []))]

  const blogPostRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const blogTagRoutes: MetadataRoute.Sitemap = tags.map(tag => ({
    // Tags may contain spaces (e.g. "full-stack development"); sitemap URLs must be encoded.
    url: `${base}/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: newest(posts.filter(p => p.tags?.includes(tag)).map(p => new Date(p.date))),
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  const workRoutes: MetadataRoute.Sitemap = workItems.map(item => ({
    url: `${base}/work/${item.slug}`,
    // Ongoing roles ("Present") fall back to the start date; ended roles use the end date.
    lastModified: monthStart(item.end === "Present" ? item.start : item.end),
    changeFrequency: "yearly",
    priority: 0.6,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map(project => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: new Date(project.endDate),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  // The listing pages' lastModified is the newest of the items they list.
  const postsDate = newest(blogPostRoutes.map(r => r.lastModified as Date))
  const workDate = newest(workRoutes.map(r => r.lastModified as Date))
  const projectsDate = newest(projectRoutes.map(r => r.lastModified as Date))

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: newest([postsDate, workDate, projectsDate]),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/work`,
      lastModified: workDate,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${base}/projects`,
      lastModified: projectsDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      lastModified: postsDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  return [...staticRoutes, ...blogPostRoutes, ...blogTagRoutes, ...workRoutes, ...projectRoutes]
}
