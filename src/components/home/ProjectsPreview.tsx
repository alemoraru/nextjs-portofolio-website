"use client"

import { motion } from "framer-motion"
import ProjectTile from "@/components/ProjectTile"
import ViewAllHeader from "@/components/ViewAllHeader"
import { homeIntroConfig } from "@/data/content"
import { ProjectProps } from "@/lib/types"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"

interface ProjectsPreviewProps {
  projects: ProjectProps[]
}

function sortProjects(items: ProjectProps[]): ProjectProps[] {
  return items.slice().sort((a, b) => {
    const aIsPresent = a.endDate === "Present"
    const bIsPresent = b.endDate === "Present"
    if (aIsPresent && !bIsPresent) return -1
    if (!aIsPresent && bIsPresent) return 1
    if (aIsPresent && bIsPresent) return a.title.localeCompare(b.title)
    const endDiff = new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    if (endDiff !== 0) return endDiff
    return a.title.localeCompare(b.title)
  })
}

export default function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  const items = sortProjects(projects).slice(0, homeIntroConfig.projectsToShow)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeUpVariants}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20"
    >
      <ViewAllHeader title="Recent Projects" pageUrl="/projects" itemCount={projects.length} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={staggerContainerVariants}
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
      >
        {items.map(proj => (
          <motion.div key={proj.slug} variants={staggerItemVariants}>
            <ProjectTile {...proj} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
