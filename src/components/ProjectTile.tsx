'use client'

import Link from 'next/link'
import Image from 'next/image'
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
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition text-black"
                whileHover={{ scale: 1.04 }}
            >
                <div className="relative w-full h-48">
                    <Image
                        src={image}
                        alt={title}
                        layout="fill"
                        priority
                    />
                </div>
                <div className="p-4 text-center font-medium">{title}</div>
            </motion.div>
        </Link>
    )
}

