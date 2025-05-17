import type {Metadata} from "next";
import "./globals.css";
import {Gabarito} from "next/font/google";
import React, {ReactNode} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const gabarito = Gabarito({
    variable: "--font-gabarito",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: 'Next.js Developer Portfolio Template',
    description: 'Developer-focused portfolio starter built with Next.js, TypeScript, TailwindCSS, and optimized for SEO.',
    icons: {
        icon: '/icons/favicon.ico',
        shortcut: '/icons/favicon.ico',
        apple: '/icons/favicon.ico',
    },
    metadataBase: new URL('https://nextjs-portofolio-website.vercel.app'),
    openGraph: {
        title: 'Next.js Developer Portfolio Template',
        description: 'Developer-focused portfolio starter built with Next.js, TypeScript, TailwindCSS, and optimized for SEO.',
        url: 'https://nextjs-portofolio-website.vercel.app',
        siteName: 'Next.js Developer Portfolio Template',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Next.js Developer Portfolio Template'
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Next.js Developer Portfolio Template',
        description: 'Developer-focused portfolio starter built with Next.js, TypeScript, TailwindCSS, and optimized for SEO.',
        images: ['/og-image.png']
    }
}

// This script initializes the theme based on user preference or saved settings
// And is used to avoid FOUC (Flash of Unstyled Content) on the initial load
const themeInitScript = `
(function() {
  try {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch(e) {}
})();`

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en" className={`${gabarito.className} ${gabarito.variable}`} suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{__html: themeInitScript}}/>
            <title>My Developer Portfolio</title>
        </head>
        <body
            className={`antialiased flex flex-col min-h-screen transition-colors ${gabarito.className} ${gabarito.variable}`}
        >
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

        <Header/>
        <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
        <Footer/>
        </body>
        </html>
    )
}
