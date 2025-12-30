import HomeContent from "@/components/content/HomeContent"
import { getAllBlogPosts } from "@/lib/mdx"

/**
 * Home component that serves as the main landing page for the portfolio.
 * This is accessed at the root URL ("/") of the application.
 * This is a server component wrapper that fetches data and passes it to the client HomeContent component.
 */
export default async function Home() {
  // Fetch all blog posts from MDX files
  const blog = await getAllBlogPosts()

  return <HomeContent blog={blog} />
}
