import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Gabarito } from "next/font/google"
import { ThemeProvider } from "next-themes"
import React, { ReactNode } from "react"
import Footer from "@/components/Footer"
import Header from "@/components/Header"

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
 * IMPORTANT: To customize this metadata for your own portfolio,
 * edit the file: src/data/metadata.ts
 */
export { metadata } from "@/data/metadata"

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
