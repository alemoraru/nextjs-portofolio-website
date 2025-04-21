import WorkItem from '@/components/WorkItem'
import work from '@/data/work'

export default function WorkPage() {
    return (
        <section>
            <h1 className="text-3xl font-bold mb-6">Work Experience</h1>
            <div className="space-y-6">
                {work.map((item) => (
                    <WorkItem key={item.company} {...item} />
                ))}
            </div>
        </section>
    )
}
