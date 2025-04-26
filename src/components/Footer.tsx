import Link from 'next/link'
import {FaGithub, FaLinkedin, FaGoodreads, FaEnvelope, FaInstagram, FaTwitter} from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="border-t mt-10 py-6 text-center text-sm text-gray-500 px-4 border-gray-800">
            <div className="flex justify-center gap-6 mb-2 text-lg">
                <Link href="/" rel="noopener noreferrer" aria-label="GitHub"
                      className="hover:scale-125 transition-transform duration-200">
                    <FaGithub/>
                </Link>
                <Link href="/" rel="noopener noreferrer" aria-label="LinkedIn"
                      className="hover:scale-125 transition-transform duration-200">
                    <FaLinkedin/>
                </Link>
                <Link href="/" rel="noopener noreferrer" aria-label="GoodReads"
                      className="hover:scale-125 transition-transform duration-200">
                    <FaGoodreads/>
                </Link>
                <Link href="/" rel="noopener noreferrer" aria-label="Instagram"
                      className="hover:scale-125 transition-transform duration-200">
                    <FaInstagram/>
                </Link>
                <Link href="/" rel="noopener noreferrer" aria-label="Twitter"
                      className="hover:scale-125 transition-transform duration-200">
                    <FaTwitter/>
                </Link>
                <Link href="mailto:<EMAIL>" target="_blank" rel="noopener noreferrer" aria-label="Email"
                      className="hover:scale-125 transition-transform duration-200">
                    <FaEnvelope/>
                </Link>
            </div>
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </footer>
    )
}
