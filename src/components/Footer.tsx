import Link from 'next/link'
import {FaGithub, FaLinkedin, FaGoodreads, FaEnvelope, FaInstagram, FaReddit} from 'react-icons/fa'
import {FaXTwitter} from "react-icons/fa6";
import {appVersion} from "@/lib/constants";

export default function Footer() {

    return (
        <footer
            className="mt-4 py-6 text-center text-sm text-gray-500 px-4 border-t dark:border-gray-800 border-gray-300"
            id="footerPortfolio"
        >
            <div className="flex justify-center gap-6 mb-2 text-lg">
                <Link
                    href="/"
                    aria-label="GitHub"
                    className="hover:text-blue-500 transition-transform hover:scale-125 duration-200"
                >
                    <FaGithub/>
                </Link>
                <Link
                    href="/"
                    aria-label="LinkedIn"
                    className="hover:text-blue-500 transition-transform hover:scale-125 duration-200"
                >
                    <FaLinkedin/>
                </Link>
                <Link
                    href="/"
                    aria-label="GoodReads"
                    className="hover:text-blue-500 transition-transform hover:scale-125 duration-200"
                >
                    <FaGoodreads/>
                </Link>
                <Link
                    href="/"
                    aria-label="Instagram"
                    className="hover:text-blue-500 transition-transform hover:scale-125 duration-200"
                >
                    <FaInstagram/>
                </Link>
                <Link
                    href="/"
                    aria-label="X"
                    className="hover:text-blue-500 transition-transform hover:scale-125 duration-200"
                >
                    <FaXTwitter/>
                </Link>
                <Link
                    href="/"
                    aria-label="Reddit"
                    className="hover:text-blue-500 transition-transform hover:scale-125 duration-200"
                >
                    <FaReddit/>
                </Link>
                <Link
                    href="mailto:<EMAIL>"
                    target="_blank"
                    aria-label="Email"
                    className="hover:text-blue-500 transition-transform hover:scale-125 duration-200"
                >
                    <FaEnvelope/>
                </Link>
            </div>

            {/* Copyright section */}
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} John Doe. All rights reserved.</p>

            {/* Display version & Link to GitHub Repo */}
            {/* You can update or remove this for your own template */}
            <p className="text-xs sm:text-sm">
                <Link href={`https://github.com/alemoraru/nextjs-portofolio-website/releases/tag/v${appVersion}`}
                      rel="noopener noreferrer">
                    <span
                        className="font-semibold hover:text-blue-500 transition-colors duration-200"
                    >
                        v{appVersion}
                    </span>
                </Link>
                &nbsp;built by&nbsp;
                <Link href="https://github.com/alemoraru" rel="noopener noreferrer">
                    <span
                        className="font-semibold hover:text-blue-500 transition-colors duration-200"
                    >
                        @alemoraru
                    </span>
                </Link>
            </p>
        </footer>
    )
}
