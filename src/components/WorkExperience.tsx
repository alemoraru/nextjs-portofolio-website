interface WorkExperienceProps {
    company: string
    title: string
    start: string
    end: string
    description: string
}

export default function WorkExperience({ company, title, start, end, description }: WorkExperienceProps) {
    return (
        <div className="border rounded-xl p-4 shadow-sm hover:border-blue-500 transition cursor-pointer">
            <h3 className="text-xl font-semibold">{title} @ {company}</h3>
            <p className="text-sm text-gray-500">{start} – {end}</p>
            <p className="mt-2 text-gray-700">{description}</p>
        </div>
    )
}
