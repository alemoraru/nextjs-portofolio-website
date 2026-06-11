import { siteMetadata } from "@/data/metadata"
import { getAllBlogPosts, getAllProjects, getAllWorkItems } from "@/lib/mdx"
import type { MetadataRoute } from "next"

const base = siteMetadata.siteUrl

/**
 * Generates a sitemap.xml file for the website.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, workItems, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllWorkItems(),
    getAllProjects(),
  ])

  const tags = [...new Set(posts.flatMap(post => post.tags ?? []))]

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/work`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${base}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const blogPostRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const blogTagRoutes: MetadataRoute.Sitemap = tags.map(tag => ({
    url: `${base}/blog/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  const workRoutes: MetadataRoute.Sitemap = workItems.map(item => ({
    url: `${base}/work/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.6,
  }))

  const projectRoutes: MetadataRoute.Sitemap = projects.map(project => ({
    url: `${base}/projects/${project.slug}`,
    lastModified: new Date(project.endDate),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogPostRoutes, ...blogTagRoutes, ...workRoutes, ...projectRoutes]
}
