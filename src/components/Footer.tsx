import Link from 'next/link'
import {FaGithub, FaLinkedin, FaGoodreads, FaEnvelope, FaInstagram, FaTwitter} from 'react-icons/fa'
import {appVersion} from "@/lib/constants";

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
            {/* Copyright section */}
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} Your Name. All rights reserved.</p>

            {/* Display version & Link to GitHub Repo */}
            <p className="text-xs sm:text-sm">
                <Link href={`https://github.com/alemoraru/nextjs-portofolio-website/releases/tag/v${appVersion}`}
                      rel="noopener noreferrer">
                    <span className="font-semibold hover:text-blue-500 transition-colors duration-200">v{appVersion}</span>
                </Link>
            </p>
        </footer>
    )
}
