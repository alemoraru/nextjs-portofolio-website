'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProjectTileProps {
    slug: string
    title: string
    image: string
}

export default function ProjectTile({ slug, title, image }: ProjectTileProps) {
    return (
        <Link href={`/projects/${slug}`}>
            <motion.div
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
                whileHover={{ scale: 1.03 }}
            >
                <img src={image} alt={title} className="w-full h-48 object-cover" />
                <div className="p-4 text-center font-medium">{title}</div>
            </motion.div>
        </Link>
    )
}
