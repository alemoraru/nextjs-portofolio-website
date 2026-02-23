"use client"

import { motion } from "framer-motion"
import ViewAllHeader from "@/components/ViewAllHeader"
import WorkItem from "@/components/WorkItem"
import { homeIntroConfig } from "@/data/content"
import { WorkItemProps } from "@/lib/types"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"

interface WorkPreviewProps {
  work: WorkItemProps[]
}

function sortWork(items: WorkItemProps[]): WorkItemProps[] {
  return items.slice().sort((a, b) => {
    const aIsPresent = a.end === "Present"
    const bIsPresent = b.end === "Present"
    if (aIsPresent && !bIsPresent) return -1
    if (!aIsPresent && bIsPresent) return 1
    if (aIsPresent && bIsPresent) return a.company.localeCompare(b.company)
    const endDiff = new Date(b.end).getTime() - new Date(a.end).getTime()
    if (endDiff !== 0) return endDiff
    return a.company.localeCompare(b.company)
  })
}

export default function WorkPreview({ work }: WorkPreviewProps) {
  const items = sortWork(work).slice(0, homeIntroConfig.workItemsToShow)

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
