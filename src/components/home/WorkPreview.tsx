"use client"

import { motion } from "framer-motion"
import ViewAllHeader from "@/components/ViewAllHeader"
import WorkItem from "@/components/WorkItem"
import { homeIntroConfig } from "@/data/content"
import { WorkItemProps } from "@/lib/types"
import { sortWorkItems } from "@/lib/utils"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"

interface WorkPreviewProps {
  work: WorkItemProps[]
}

export default function WorkPreview({ work }: WorkPreviewProps) {
  const items = sortWorkItems(work, "newest").slice(0, homeIntroConfig.workItemsToShow)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeUpVariants}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20"
    >
      <ViewAllHeader title="Work Experience" pageUrl="/work" itemCount={work.length} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={staggerContainerVariants}
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4"
      >
        {items.map((job, i) => (
          <motion.div key={i} variants={staggerItemVariants}>
            <WorkItem {...job} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
