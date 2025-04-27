import WorkItem from '@/components/WorkItem'
import work from '@/data/work'

/**
 * WorkPage component that serves as the main page for displaying work experience.
 * This is accessed at the "/work" URL of the application.
 */
export default function WorkPage() {
    return (
        <section className="px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Work Experience</h1>
            <div className="space-y-6 grid">
                {work.map((item) => (
                    <WorkItem key={item.slug} {...item} />
                ))}
            </div>
        </section>
    )
}
