import {FaGithub, FaLinkedin, FaGoodreads, FaTwitter, FaInstagram} from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="border-t mt-10 py-6 text-center text-sm text-gray-500">
            <div className="flex justify-center gap-6 mb-2">
                <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={20}/>
                </a>
                <a href="https://www.linkedin.com/in/your-username/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={20}/>
                </a>
                <a href="https://www.goodreads.com/user/show/your-id" target="_blank" rel="noopener noreferrer">
                    <FaGoodreads size={20}/>
                </a>
                <a href="https://twitter.com/your-username" target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={20}/>
                </a>
                <a href="https://www.instagram.com/your-username/" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={20}/>
                </a>
            </div>
            <p>© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </footer>
    )
}
