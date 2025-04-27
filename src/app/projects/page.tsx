import ProjectTile from '@/components/ProjectTile'
import projects from '@/data/projects'

/**
 * ProjectsPage component that serves as the main page for displaying projects.
 * This is accessed at the "/projects" URL of the application.
 */
export default function ProjectsPage() {
    return (
        <section className="px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Projects</h1>
            {/* Grid setup for 1 on small screens, 2 on medium, and 3 on large */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <ProjectTile key={project.slug} {...project} />
                ))}
            </div>
        </section>
    );
}
