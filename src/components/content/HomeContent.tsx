"use client"

import { motion } from "framer-motion"
import BlogPost from "@/components/BlogPost"
import ProjectTile from "@/components/ProjectTile"
import ViewAllHeader from "@/components/ViewAllHeader"
import WorkItem from "@/components/WorkItem"
import { homeIntroConfig, factIconMap } from "@/data/content"
import { BlogPostProps, ProjectProps, WorkItemProps } from "@/lib/types"
import { cn } from "@/lib/utils"

interface HomeContentProps {
  blog: BlogPostProps[]
  work: WorkItemProps[]
  projects: ProjectProps[]
}

/**
 * Internal component to render quick facts
 */
function QuickFacts() {
  // Build array of facts from predefined fields and additional facts
  const allFacts = [
    // Add predefined facts (filtering out empty values)
    ...Object.entries(homeIntroConfig.facts)
      .filter(([_, value]) => value && value.trim() !== "")
      .map(([category, value]) => {
        const categoryKey = category as keyof typeof factIconMap
        return {
          icon: factIconMap[categoryKey],
          label: value,
        }
      }),
    // Add additional custom facts
    ...homeIntroConfig.additionalFacts,
  ]

  return (
    <>
      {allFacts.map((fact, i) => {
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
    </>
  )
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
          Hi, I&#39;m {homeIntroConfig.shortName || homeIntroConfig.name}{" "}
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
          {homeIntroConfig.introParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 text-left"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Quick Facts Section */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Quick & Fun Facts
          </h2>

          <div className="flex flex-wrap justify-center gap-3 px-4 max-w-4xl mx-auto">
            <QuickFacts />
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
          {work
            .slice()
            .sort((a, b) => {
              // Items with "Present" should be at the top
              const aIsPresent = a.end === "Present"
              const bIsPresent = b.end === "Present"

              if (aIsPresent && !bIsPresent) return -1
              if (!aIsPresent && bIsPresent) return 1

              // If both are Present or both have dates, sort by end date (newest first)
              if (aIsPresent && bIsPresent) {
                return a.company.localeCompare(b.company)
              }

              const endDiff = getTimeSafe(b.end) - getTimeSafe(a.end)
              if (endDiff !== 0) return endDiff

              // If end dates are the same, sort by company name
              return a.company.localeCompare(b.company)
            })
            .slice(0, 3)
            .map((job, i) => (
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
          {projects
            .slice()
            .sort((a, b) => {
              // Items with "Present" should be at the top
              const aIsPresent = a.endDate === "Present"
              const bIsPresent = b.endDate === "Present"

              if (aIsPresent && !bIsPresent) return -1
              if (!aIsPresent && bIsPresent) return 1

              // If both are Present or both have dates, sort by end date (newest first)
              if (aIsPresent && bIsPresent) {
                return a.title.localeCompare(b.title)
              }

              const endDiff = getTimeSafe(b.endDate) - getTimeSafe(a.endDate)
              if (endDiff !== 0) return endDiff

              // If end dates are the same, sort by title
              return a.title.localeCompare(b.title)
            })
            .slice(0, 4)
            .map(proj => (
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
