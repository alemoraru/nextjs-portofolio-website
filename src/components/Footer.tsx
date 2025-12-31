import Link from "next/link"
import {
  FaGithub,
  FaLinkedin,
  FaGoodreads,
  FaEnvelope,
  FaInstagram,
  FaReddit,
  FaDribbble,
  FaYoutube,
  FaCodeBranch,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { appVersion } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function Footer() {
  const socialLinks = [
    { href: "/", icon: FaGithub, label: "GitHub" },
    { href: "/", icon: FaLinkedin, label: "LinkedIn" },
    { href: "/", icon: FaGoodreads, label: "GoodReads" },
    { href: "/", icon: FaInstagram, label: "Instagram" },
    { href: "/", icon: FaXTwitter, label: "X" },
    { href: "/", icon: FaReddit, label: "Reddit" },
    { href: "/", icon: FaDribbble, label: "Dribbble" },
    { href: "/", icon: FaYoutube, label: "YouTube" },
    { href: "mailto:<EMAIL>", icon: FaEnvelope, label: "Email" },
  ]

  return (
    <footer
      className="relative mt-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400
                 px-4 border-t border-gray-200 dark:border-gray-900
                 bg-zinc-50/80 dark:bg-black/80 backdrop-blur-sm
                 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0
                 before:h-px before:bg-linear-to-r before:from-transparent
                 before:via-blue-500/30 before:to-transparent"
      id="footerPortfolio"
    >
      {/* Social Links Grid */}
      <div className="flex justify-center flex-wrap gap-4 mb-4">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            target={href.startsWith("mailto") ? "_blank" : undefined}
            className={cn(
              "group relative flex items-center justify-center w-11 h-11",
              "rounded-lg border border-gray-300 dark:border-gray-700",
              "bg-gray-100 dark:bg-gray-800",
              "text-gray-700 dark:text-gray-300",
              "hover:border-blue-500 dark:hover:border-blue-400",
              "hover:bg-blue-50 dark:hover:bg-blue-950/30",
              "hover:text-blue-600 dark:hover:text-blue-400",
              "transition-all duration-200",
              "hover:scale-110 hover:shadow-md",
              "active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black"
            )}
          >
            <Icon className="w-5 h-5" />
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="max-w-xs mx-auto mb-4 h-px bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

      {/* Copyright */}
      <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} John Doe. All rights reserved.
      </p>

      {/* Version & Attribution - Terminal style */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3
                      text-xs font-mono text-gray-500 dark:text-gray-500"
      >
        <Link
          href={`https://github.com/alemoraru/nextjs-portofolio-website/releases/tag/v${appVersion}`}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md
                     bg-gray-200 dark:bg-gray-800
                     border border-gray-300 dark:border-gray-700
                     hover:border-blue-500 dark:hover:border-blue-400
                     hover:bg-blue-50 dark:hover:bg-blue-950/30
                     transition-all duration-200
                     hover:shadow-sm"
        >
          <FaCodeBranch className="w-3 h-3 text-gray-500 dark:text-gray-500" />
          <span className="font-semibold text-blue-600 dark:text-blue-400">{appVersion}</span>
        </Link>

        <span className="text-gray-500 dark:text-gray-500">
          built by{" "}
          <Link
            href="https://github.com/alemoraru"
            rel="noopener noreferrer"
            className="font-semibold hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            @alemoraru
          </Link>
        </span>
      </div>
    </footer>
  )
}
