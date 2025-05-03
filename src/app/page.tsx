"use client";

import blog from "@/data/blog";
import projects from "@/data/projects";
import work from "@/data/work";
import WorkItem from "@/components/WorkItem";
import ProjectTile from "@/components/ProjectTile";
import BlogPost from "@/components/BlogPost";
import ViewAllHeader from "@/components/ViewAllHeader";
import {motion} from "framer-motion";
import {HiCheckCircle} from 'react-icons/hi'

/**
 * Home component that serves as the main landing page for the portfolio.
 * This is accessed at the root URL ("/") of the application.
 */
export default function Home() {

    const getTimeSafe = (dateStr: string | undefined) => {
        const date = new Date(dateStr ?? '');
        return isNaN(date.getTime()) ? 0 : date.getTime();
    };

    return (
        <section className="px-4 max-w-4xl mx-auto">

            {/* Intro Section */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                viewport={{once: true}}
                className="text-center mt-10"
            >
                {/* Introductory Text */}
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    Hi, I&#39;m Your Name 👋
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-left mb-6">
                    I&#39;m a software engineer passionate about solving problems, building things, and reading sci-fi.
                    Whenever I&#39;m not coding, you can find me exploring the world, playing tennis or skating.
                    I love to share my knowledge and experiences through my blog, where I write about tech, books, and
                    life lessons.
                </p>

                {/* Current Work Description or other highlights */}
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-left">
                    I am currently working at Hypernova Labs as a software engineer, where I focus on building scalable
                    applications and improving user experiences. I have a keen interest in full-stack development,
                    particularly in React and Node.js. I enjoy collaborating with cross-functional teams to deliver
                    high-quality software solutions.
                </p>

                {/* Quick Facts and Languages */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 text-sm sm:text-base">
                    {/* Quick Facts */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Quick Facts</h2>
                        <ul className="space-y-3 w-3/4 max-w-xs sm:max-w-sm">
                            {[
                                "🛠️ Currently working at Big Boss Corp",
                                "📍 Based in Git, Hub",
                                "📚 Love reviewing books",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <HiCheckCircle className="mt-1 text-blue-500 dark:text-blue-400 text-lg"/>
                                    <span className="text-left">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Languages</h2>
                        <ul className="space-y-3 w-3/4 max-w-xs sm:max-w-sm">
                            {[
                                "🇺🇸 English (Fluent)",
                                "🇪🇸 Spanish (Fluent)",
                                "🇩🇪 German (Intermediate)",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <HiCheckCircle className="mt-1 text-blue-500 dark:text-blue-400 text-lg"/>
                                    <span className="text-left">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </motion.div>

            {/* Recent Work */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                viewport={{once: true}}
                className="mt-16"
            >
                <ViewAllHeader title="Recent Work" pageUrl="/work" itemCount={work.length}/>
                <div className="grid gap-4">
                    {work.slice(0, 3).map((job, i) => (
                        <motion.div
                            key={i}
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 1}}
                            viewport={{once: true}}
                        >
                            <WorkItem {...job} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Projects */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                viewport={{once: true}}
                className="mt-16"
            >
                <ViewAllHeader title="Recent Projects" pageUrl="/projects" itemCount={projects.length}/>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {projects.slice(0, 4).map((proj) => (
                        <motion.div
                            key={proj.slug}
                            initial={{opacity: 0, y: 20}}
                            whileInView={{opacity: 1, y: 0}}
                            transition={{duration: 1}}
                            viewport={{once: true}}
                        >
                            <ProjectTile key={proj.slug} {...proj} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Recent Blog Posts */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 1}}
                viewport={{once: true}}
                className="mt-16 mb-12"
            >
                <ViewAllHeader title="Recent Blog Posts" pageUrl="/blog" itemCount={blog.length}/>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {blog
                        .slice()
                        .sort((a, b) => getTimeSafe(b.date) - getTimeSafe(a.date))
                        .slice(0, 3)
                        .map((post) => (
                            <motion.div
                                key={post.slug} // Use a unique key instead of index
                                initial={{opacity: 0, y: 20}}
                                whileInView={{opacity: 1, y: 0}}
                                transition={{duration: 1}}
                                viewport={{once: true}}
                            >
                                <BlogPost {...post} />
                            </motion.div>
                        ))}
                </div>
            </motion.div>

        </section>
    )
}

