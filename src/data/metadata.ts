import type { Theme } from "@/lib/types"
import type { Metadata } from "next"

/**
 * Site metadata configuration
 * Customize this file with your own information for SEO and social media sharing
 */
export const siteMetadata = {
  /**
   * Accent color theme for the portfolio.
   * Options: "blue" | "purple" | "green" | "orange" | "rose" | "teal" | "indigo" | "amber" | "cyan" | "violet"
   * The chosen theme controls the accent color used across all components.
   */
  theme: "blue" as Theme,

  /**
   * Site title (shown in browser tabs and search results)
   */
  title: "Next.js Developer Portfolio Template",

  /**
   * Site description (shown in search results and social media)
   */
  description:
    "Developer portfolio showcasing projects, work experience, and technical blog posts. Built with Next.js, TypeScript, and Tailwind CSS.",

  /**
   * Keywords for SEO
   */
  keywords: [
    "Developer",
    "Software Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Web Development",
    "Portfolio",
  ],

  /**
   * Author information
   */
  author: {
    name: "Alexandru Moraru",
    url: "https://alexradumoraru.com",
  },

  /**
   * Base URL of your website (used for canonical URLs and Open Graph)
   */
  siteUrl: "https://nextjs-portofolio-website.vercel.app",

  /**
   * Social media handles
   */
  social: {
    twitter: "@alexradumoraru",
  },

  /**
   * Open Graph image (for social media sharing)
   * Path to your og-image.png in the public folder
   */
  ogImage: "/og-image.png",
}

/**
 * Generate the complete metadata object for Next.js
 * This is used in layout.tsx
 */
export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author.name, url: siteMetadata.author.url }],
  creator: siteMetadata.author.name,
  publisher: siteMetadata.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.ico",
    apple: "/icons/favicon.ico",
  },
  metadataBase: new URL(siteMetadata.siteUrl),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [
      {
        url: siteMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: siteMetadata.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: siteMetadata.social.twitter,
    images: [siteMetadata.ogImage],
  },
  category: "technology",
}
