export default function Home() {
    return (
        <section className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Hi, I&#39;m Your Name 👋
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                I&#39;m a software engineer passionate about solving problems, building things, and reading sci-fi.
            </p>

            <div className="mt-10">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Quick Facts</h2>
                <ul className="space-y-3 text-left max-w-md mx-auto text-sm sm:text-base px-4">
                    <li>• 🛠️ Currently working at Evil Corp</li>
                    <li>• 📍 Based in Git, Hub</li>
                    <li>• 📚 Love reviewing books on Goodreads</li>
                </ul>
            </div>
        </section>
    )
}

