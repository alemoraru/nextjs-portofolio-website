import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React, {ReactNode} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import { ThemeProvider } from "next-themes"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: 'My Portfolio',
    description: 'A portfolio site showcasing my work, projects, blog, and books.',
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white 
        text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors`}>
        <Header/>
        <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
        <Footer/>
        </body>
        </html>
    )
}
