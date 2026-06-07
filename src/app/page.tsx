import HomeContent from "@/components/home/HomeContent"
import { footerConfig, homeIntroConfig } from "@/data/content"
import { siteMetadata } from "@/data/metadata"
import { getAllBlogPosts, getAllProjects, getAllWorkItems } from "@/lib/mdx"
import type { Person, WithContext } from "schema-dts"

/**
 * Home component that serves as the main landing page for the portfolio.
 * This is accessed at the root URL ("/") of the application.
 * This is a server component wrapper that fetches data and passes it to the client HomeContent component.
 * It also generates JSON-LD structured data for SEO purposes, describing the person (author) and their social links.
 * The JSON-LD is included in a script tag in the head of the page, and it uses the schema.org "Person" type to describe the author.
 * The "sameAs" property includes links to social media profiles, which can help search engines understand the author's online presence.
 */
export default async function Home() {
  const [blog, work, projects] = await Promise.all([
    getAllBlogPosts(),
    getAllWorkItems(),
    getAllProjects(),
  ])

  const sameAs = Object.values(footerConfig.socialLinks).filter(url => url && url !== "/")

  const jsonLd: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteMetadata.author.name,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
    jobTitle: homeIntroConfig.facts.role,
    ...(sameAs.length > 0 && { sameAs }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <HomeContent blog={blog} work={work} projects={projects} />
    </>
  )
}
