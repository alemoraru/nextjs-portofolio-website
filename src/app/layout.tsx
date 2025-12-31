import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Gabarito } from "next/font/google"
import { ThemeProvider } from "next-themes"
import React, { ReactNode } from "react"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import type { Metadata } from "next"

/**
 * Import and configure the Gabarito font from Google Fonts.
 * We only use this font in the application (for headings and body text).
 */
const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
})

/**
 * Viewport configuration for optimal mobile experience.
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

/**
 * Metadata for the application, including SEO and social media sharing information.
 *
 * IMPORTANT: Customize this metadata for your own portfolio!
 * Replace descriptions, and URLs with your actual information.
 * See README.md for detailed customization instructions.
 */
export const metadata: Metadata = {
  title: "Next.js Developer Portfolio Template",
  description:
    "Developer portfolio showcasing projects, work experience, and technical blog posts. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: [
    "Developer",
    "Software Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Web Development",
    "Portfolio",
  ],
  authors: [{ name: "Alexandru Moraru", url: "https://alexradumoraru.com" }],
  creator: "Alexandru Moraru",
  publisher: "Alexandru Moraru",
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
  metadataBase: new URL("https://nextjs-portofolio-website.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Next.js Developer Portfolio Template",
    description:
      "Developer portfolio showcasing projects, work experience, and technical blog posts. Built with Next.js, TypeScript, and Tailwind CSS.",
    url: "https://yourwebsite.com",
    siteName: "Next.js Developer Portfolio Template",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Next.js Developer Portfolio Template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Developer Portfolio Template",
    description:
      "Developer portfolio showcasing projects, work experience, and technical blog posts. Built with Next.js, TypeScript, and Tailwind CSS.",
    creator: "@alexradumoraru",
    images: ["/og-image.png"],
  },
  category: "technology",
}

/**
 * RootLayout component that wraps the entire application.
 * It includes global styles, fonts, and layout structure.
 * @param children - The child components to be rendered within the layout.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${gabarito.className} ${gabarito.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`antialiased flex flex-col min-h-screen transition-colors ${gabarito.className} ${gabarito.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          {/* Dot Background Layer */}
          <div
            className={`
                        fixed inset-0 -z-10
                        bg-[radial-gradient(circle,#d1d5db_1px,transparent_1px)]
                        dark:bg-[radial-gradient(circle,#3f3f46_1px,transparent_1px)]
                        bg-size-[30px_30px]
                        mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]
                      `}
          />
          <Header />
          <main className="grow container mx-auto px-4 py-6">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
