import { FaGithub, FaLinkedin, FaGoodreads } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="border-t mt-10 py-6 text-center text-sm text-gray-500 px-4">
            <div className="flex justify-center gap-6 mb-2 text-lg">
                <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/your-username/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FaLinkedin />
                </a>
                <a href="https://www.goodreads.com/user/show/your-id" target="_blank" rel="noopener noreferrer" aria-label="GoodReads">
                    <FaGoodreads />
                </a>
            </div>
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </footer>
    )
}
