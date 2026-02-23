"use client"

import { motion } from "framer-motion"
import BlogPost from "@/components/BlogPost"
import ViewAllHeader from "@/components/ViewAllHeader"
import { homeIntroConfig } from "@/data/content"
import { BlogPostProps } from "@/lib/types"
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations"

interface BlogPreviewProps {
  blog: BlogPostProps[]
}

export default function BlogPreview({ blog }: BlogPreviewProps) {
  const posts = blog
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, homeIntroConfig.blogPostsToShow)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={fadeUpVariants}
      viewport={{ once: true, margin: "-100px" }}
      className="mt-20 mb-16"
    >
      <ViewAllHeader title="Recent Blog Posts" pageUrl="/blog" itemCount={blog.length} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={staggerContainerVariants}
        viewport={{ once: true, margin: "-50px" }}
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        {posts.map(post => (
          <motion.div key={post.slug} variants={staggerItemVariants}>
            <BlogPost {...post} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
