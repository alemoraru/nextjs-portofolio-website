import type { Metadata } from "next"
import "./globals.css"
import { Gabarito } from "next/font/google"
import React, { ReactNode } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ThemeProvider } from "next-themes"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

/**
 * Import and configure the Gabarito font from Google Fonts.
 * We only use this font in the application (for headings and body text).
 */
const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
})

/**
 * Metadata for the application, including SEO and social media sharing information.
 */
export const metadata: Metadata = {
  title: "Next.js Developer Portfolio Template",
  description:
    "Developer-focused portfolio starter built with Next.js, TypeScript, TailwindCSS, and optimized for SEO.",
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon.ico",
    apple: "/icons/favicon.ico",
  },
  metadataBase: new URL("https://nextjs-portofolio-website.vercel.app"),
  openGraph: {
    title: "Next.js Developer Portfolio Template",
    description:
      "Developer-focused portfolio starter built with Next.js, TypeScript, TailwindCSS, and optimized for SEO.",
    url: "https://nextjs-portofolio-website.vercel.app",
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
      "Developer-focused portfolio starter built with Next.js, TypeScript, TailwindCSS, and optimized for SEO.",
    images: ["/og-image.png"],
  },
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
      <head>
        <title>Next.js Developer Portfolio Template</title>
      </head>
      <body
        className={`antialiased flex flex-col min-h-screen transition-colors ${gabarito.className} ${gabarito.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          {/* Dot Background Layer */}
          <div
            className={`
                        fixed inset-0 -z-10
                        bg-[radial-gradient(circle,_#d1d5db_1px,_transparent_1px)]
                        dark:bg-[radial-gradient(circle,_#3f3f46_1px,_transparent_1px)]
                        bg-[length:30px_30px]
                        [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]
                      `}
          />
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6">
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
