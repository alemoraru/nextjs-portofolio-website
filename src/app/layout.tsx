import type {Metadata} from "next";
import {Gabarito} from "next/font/google";
import "./globals.css";
import React, {ReactNode} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const gabarito = Gabarito({
    subsets: ["latin"],
    variable: "--font-gabarito",
    weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
    title: 'MyPortfolio',
    description: 'A portfolio site showcasing my work, projects, blog, and books.',
    robots: {
        index: false,
        follow: false
    },
    icons: {
        icon: '/icons/favicon.ico',
        shortcut: '/icons/favicon.ico',
        apple: '/icons/favicon.ico',
    }
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className={`${gabarito.variable} antialiased flex flex-col min-h-screen bg-white 
        text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors`}>

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
