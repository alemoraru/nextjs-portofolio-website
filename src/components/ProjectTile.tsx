'use client'

import Link from 'next/link'
import Image from 'next/image'
import {motion} from 'framer-motion'

interface ProjectTileProps {
    slug: string
    title: string
    image: string
    description?: string
    techStack?: string[]
    startDate?: string
    endDate?: string
}

/**
 * A functional component that renders a project tile with a link, image, and title.
 *
 * @param {Object} props - The prop object for the component, containing slug, title, and image.
 */
export default function ProjectTile({slug, title, image, description}: ProjectTileProps) {
    return (
        <Link href={`/projects/${slug}`} className="block group">
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{opacity: {duration: 0.8}}}
                whileHover={{
                    scale: 1.05,
                    filter: 'brightness(1.15)',
                    transition: {
                        type: "spring",
                        stiffness: 200,
                        damping: 30,
                        duration: 0.4
                    }
                }}
                className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all
                text-black dark:text-white hover:border-blue-500 border-1"
            >
                {/* Image */}
                <div className="relative w-full h-48 overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover"
                    />
                    <div
                        className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-lg font-semibold">Explore {title} ➔</span>
                    </div>
                </div>

                {/* Title with optional description */}
                <div
                    className="p-4 text-center font-semibold bg-gradient-to-t dark:from-zinc-900/80 dark:via-zinc-900/50 to-transparent">
                    {title}
                    {description && <span className="font-normal">: {description}</span>}
                </div>
            </motion.div>
        </Link>
    );
}
