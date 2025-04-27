import BlogPost from '@/components/BlogPost'
import posts from '@/data/blog'

/**
 * BlogPage component that serves as the main page for displaying blog posts.
 * This is accessed at the "/blog" URL of the application.
 */
export default function BlogPage() {
    return (
        <section className="px-4 max-w-4xl mx-auto">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <BlogPost key={post.slug} {...post} />
                ))}
            </div>
        </section>
    )
}
