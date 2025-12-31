import type { MetadataRoute } from "next"

/**
 * Generates a robots.txt file for the website.
 * Allows all search engines to crawl and index the portfolio for maximum discoverability.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
    ],
    sitemap: "https://nextjs-portofolio-website.vercel.app/sitemap.xml",
  }
}
