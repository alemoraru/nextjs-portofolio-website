import Link from "next/link";
import blog from "@/data/blog";
import projects from "@/data/projects";
import work from "@/data/work";
import WorkItem from "@/components/WorkItem";
import ProjectTile from "@/components/ProjectTile";
import BlogPost from "@/components/BlogPost";

/**
 * Home component that serves as the main landing page for the portfolio.
 * This is accessed at the root URL ("/") of the application.
 */
export default function Home() {
    return (
        <section className="px-4 max-w-4xl mx-auto">

            {/* Intro Section */}
            <div className="text-center mt-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Hi, I&#39;m Your Name 👋
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-left mb-6">
                    I&#39;m a software engineer passionate about solving problems, building things, and reading sci-fi.
                    Whenever I&#39;m not coding, you can find me exploring the world, playing tennis or skating.
                    I love to share my knowledge and experiences through my blog, where I write about tech, books, and
                    life lessons.
                </p>

                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-left">
                    I am currently working at Big Boss Corp as a software engineer, where I focus on building scalable
                    applications and improving user experiences. I have a keen interest in full-stack development,
                    particularly in React and Node.js. I enjoy collaborating with cross-functional teams to deliver
                    high-quality software solutions.

                </p>

                <div className="mt-10">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Quick Facts</h2>
                    <ul className="space-y-3 text-left max-w-md mx-auto text-sm sm:text-base">
                        <li>• 🛠️ Currently working at Big Boss Corp</li>
                        <li>• 📍 Based in Git, Hub</li>
                        <li>• 📚 Love reviewing books on Goodreads</li>
                    </ul>
                </div>
            </div>

            {/* Recent Work */}
            <div className="mt-16">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Recent Work</h2>
                    <Link href="/work" className="text-blue-500 hover:underline text-sm">View all</Link>
                </div>
                <div className="grid gap-4">
                    {work.slice(0, 3).map((job, i) => ( // Limit to 3 items
                        <WorkItem key={i} {...job} />
                    ))}
                </div>
            </div>

            {/* Recent Projects */}
            <div className="mt-16">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Recent Projects</h2>
                    <Link href="/projects" className="text-blue-500 hover:underline text-sm">View all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {projects.slice(0, 4).map((proj) => ( // Limit to 3 items
                        <ProjectTile key={proj.slug} {...proj} />
                    ))}
                </div>
            </div>

            {/* Recent Blog Posts */}
            <div className="mt-16 mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Recent Blog Posts</h2>
                    <Link href="/blog" className="text-blue-500 hover:underline text-sm">View all</Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {blog.slice(0, 3).map((post, i) => ( // Limit to 3 items
                        <BlogPost key={i} {...post} />
                    ))}
                </div>
            </div>
        </section>
    )
}
