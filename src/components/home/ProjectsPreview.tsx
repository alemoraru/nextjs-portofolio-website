"use client"

import { motion } from "framer-motion"
import ProjectTile from "@/components/ProjectTile"
import ViewAllHeader from "@/components/ViewAllHeader"
import { homeIntroConfig } from "@/data/content"
import { ProjectProps } from "@/lib/types"
import { sortProjects } from "@/lib/utils"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"

interface ProjectsPreviewProps {
  projects: ProjectProps[]
}

export default function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  const items = sortProjects(projects, "newest").slice(0, homeIntroConfig.projectsToShow)

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
        {items.map((proj, index) => (
          <motion.div key={proj.slug} variants={staggerItemVariants}>
            <ProjectTile {...proj} priority={index === 0} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
