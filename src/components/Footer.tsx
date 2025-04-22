import Link from 'next/link'
import {FaGithub, FaLinkedin, FaGoodreads, FaEnvelope, FaInstagram, FaTwitter} from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="border-t mt-10 py-6 text-center text-sm text-gray-500 px-4 border-gray-800">
            <div className="flex justify-center gap-6 mb-2 text-lg">
                <Link href="/" rel="noopener noreferrer" aria-label="GitHub">
                    <FaGithub/>
                </Link>
                <Link href="/" rel="noopener noreferrer"
                      aria-label="LinkedIn">
                    <FaLinkedin/>
                </Link>
                <Link href="/" rel="noopener noreferrer"
                      aria-label="GoodReads">
                    <FaGoodreads/>
                </Link>
                <Link href="/" rel="noopener noreferrer"
                      aria-label="Instagram">
                    <FaInstagram/>
                </Link>
                <Link href="/" rel="noopener noreferrer" aria-label="Twitter">
                    <FaTwitter/>
                </Link>
                <Link href="mailto:<EMAIL>" target="_blank" rel="noopener noreferrer" aria-label="Email">
                    <FaEnvelope/>
                </Link>
            </div>
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </footer>
    )
}
