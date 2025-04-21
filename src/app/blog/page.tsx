import BlogPost from '@/components/BlogPost'

const posts = [
    {
        slug: 'my-first-post',
        title: 'My First Blog Post',
        summary: 'This is a short preview of what the blog post is about.',
        date: '2024-11-02',
    },
    {
        slug: 'deep-dive-react',
        title: 'Deep Dive into React Patterns',
        summary: 'We explore common patterns and antipatterns in modern React.',
        date: '2025-01-12',
    },
]

export default function BlogPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <BlogPost key={post.slug} {...post} />
            ))}
        </div>
    )
}
