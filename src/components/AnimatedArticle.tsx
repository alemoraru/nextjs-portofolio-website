"use client"

import {motion} from 'framer-motion'
import {ReactNode} from 'react'

/**
 * AnimatedArticle component that wraps around an article element and applies a fade-in animation.
 * @param children - The content of the article.
 * @constructor
 */
export default function AnimatedArticle({children}: { children: ReactNode }) {
    return (
        <motion.article
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1.0}}
            className="mx-auto px-4 max-w-4xl flex flex-col items-center justify-center text-left"
        >
            {children}
        </motion.article>
    )
}
