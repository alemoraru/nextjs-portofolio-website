import ProjectTile from '@/components/ProjectTile'
import projects from '@/data/projects'

export default function ProjectsPage() {
    return (
        <section>
            <h1 className="text-3xl font-bold mb-6">Projects</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectTile key={project.slug} {...project} />
                ))}
            </div>
        </section>
    )
}
