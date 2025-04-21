import BlogPost from '@/components/BlogPost'
import posts from '@/data/blog'

export default function BlogPage() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <BlogPost key={post.slug} {...post} />
            ))}
        </div>
    )
}
