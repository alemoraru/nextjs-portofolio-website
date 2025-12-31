"use client"

import { motion } from "framer-motion"
import {
  FaMapMarkerAlt,
  FaBook,
  FaLanguage,
  FaGamepad,
  FaUniversity,
  FaSkiing,
  FaBuilding,
  FaTools,
} from "react-icons/fa"
import BlogPost from "@/components/BlogPost"
import ProjectTile from "@/components/ProjectTile"
import ViewAllHeader from "@/components/ViewAllHeader"
import WorkItem from "@/components/WorkItem"
import { BlogPostProps, ProjectProps, WorkItemProps } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HomeContentProps {
  blog: BlogPostProps[]
  work: WorkItemProps[]
  projects: ProjectProps[]
}

/**
 * HomeContent component that renders the main content of the landing page.
 * This is a client component to support framer-motion animations.
 */
export default function HomeContent({ blog, work, projects }: HomeContentProps) {
  /**
   * Get time in milliseconds safely from a date string.
   * @param dateStr - Date string
   * @returns Time in milliseconds or 0 if invalid
   */
  const getTimeSafe = (dateStr: string | undefined) => {
    const date = new Date(dateStr ?? "")
    return isNaN(date.getTime()) ? 0 : date.getTime()
  }

  return (
    <section className="px-4 max-w-4xl mx-auto">
      {/* Intro Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mt-2"
      >
        {/* Introductory Text */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Hi, I&#39;m John Doe{" "}
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            className="inline-block"
          >
            👋
          </motion.span>
        </h1>

        <div className="space-y-4 max-w-3xl mx-auto mb-8">
          <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 text-left">
            I&#39;m a software engineer passionate about solving problems, building things, and
            reading sci-fi. Whenever I&#39;m not coding, you can find me exploring the world,
            playing tennis or skating. I love to share my knowledge and experiences through my blog,
            where I write about tech, books, and life lessons.
          </p>

          <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 text-left">
            I am currently working at Hypernova Labs as a software engineer, where I focus on
            building scalable applications and improving user experiences. I have a keen interest in
            full-stack development, particularly in React and Node.js. I enjoy collaborating with
            cross-functional teams to deliver high-quality software solutions.
          </p>
        </div>

        {/* Quick Facts Section */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Quick & Fun Facts
          </h2>

          <div className="flex flex-wrap justify-center gap-3 px-4 max-w-4xl mx-auto">
            {[
              { icon: FaBuilding, label: "Hypernova Labs" },
              { icon: FaUniversity, label: "Computer Science Grad @ VuA" },
              { icon: FaMapMarkerAlt, label: "Lille, France" },
              { icon: FaBook, label: "Book Reviewer" },
              { icon: FaLanguage, label: "EN / ES / DE" },
              { icon: FaTools, label: "Full-Stack Dev" },
              { icon: FaGamepad, label: "Sci-fi Fan" },
              { icon: FaSkiing, label: "Skiing Enthusiast" },
            ].map((fact, i) => {
              const Icon = fact.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full",
                    "border border-gray-300 dark:border-gray-700",
                    "bg-gray-50 dark:bg-gray-800",
                    "text-sm font-medium text-gray-700 dark:text-gray-300",
                    "shadow-sm hover:shadow-md",
                    "hover:border-blue-400 dark:hover:border-blue-600",
                    "transition-all duration-200 cursor-default"
                  )}
                >
                  <Icon className="text-blue-600 dark:text-blue-400 text-base shrink-0" />
                  <span>{fact.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Recent Work */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <ViewAllHeader title="Work Experience" pageUrl="/work" itemCount={work.length} />
        <div className="grid gap-4">
          {work.slice(0, 3).map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <WorkItem {...job} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <ViewAllHeader title="Recent Projects" pageUrl="/projects" itemCount={projects.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.slice(0, 4).map(proj => (
            <motion.div
              key={proj.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <ProjectTile key={proj.slug} {...proj} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Blog Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-16 mb-12"
      >
        <ViewAllHeader title="Recent Blog Posts" pageUrl="/blog" itemCount={blog.length} />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {blog
            .slice()
            .sort((a, b) => getTimeSafe(b.date) - getTimeSafe(a.date))
            .slice(0, 3)
            .map(post => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <BlogPost {...post} />
              </motion.div>
            ))}
        </div>
      </motion.div>
    </section>
  )
}
