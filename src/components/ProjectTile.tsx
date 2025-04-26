'use client'

import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'framer-motion'

interface ProjectTileProps {
    slug: string
    title: string
    image: string
}

/**
 * A functional component that renders a project tile with a link, image, and title.
 *
 * @param {Object} props - The prop object for the component, containing slug, title, and image.
 */
export default function ProjectTile({slug, title, image}: ProjectTileProps) {
    return (
        <Link href={`/projects/${slug}`}>
            <motion.div
                initial={{opacity: 0, y: 0}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1.0}}
                className="bg-black rounded-xl overflow-hidden shadow-md hover:shadow-xl transition text-white
                hover:border-blue-500 border-2"
                whileHover={{scale: 1.04}}
            >
                <div className="relative w-full h-48">
                    <Image
                        src={image}
                        alt={title}
                        fill={true}
                        priority
                    />
                </div>
                <div className="p-4 text-center font-medium">{title}</div>
            </motion.div>
        </Link>
    )
}
