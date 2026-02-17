"use client"

import { motion, AnimatePresence } from "framer-motion"
import React, { useState, useRef } from "react"
import { FiClipboard, FiCheck } from "react-icons/fi"
import { cn } from "@/lib/utils"

type CodeBlockProps = {
  className?: string
  children: React.ReactNode
}

/**
 * CodeBlock component that wraps around a code block which was rendered by MDX.
 * @param className - The class name of the code block. This is used to determine the language of the code block.
 * @param children - The content of the code block. This is typically a string of code.
 */
export function CodeBlock({ className = "", children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const classParts = className.split(" ").filter(Boolean)
  const langPart = classParts.find(cls => cls.startsWith("language-"))
  const language = langPart ? langPart.replace("language-", "") : "text"

  // Copy to clipboard functionality
  const handleCopy = async () => {
    const code = codeRef.current?.textContent || ""
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden w-full max-w-full",
        "border border-gray-700/50 bg-[#0d1117]",
        "shadow-lg text-sm"
      )}
    >
      {/* Code Block Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2.5",
          "bg-gray-800/90 border-b border-gray-700/50",
          "text-gray-100"
        )}
      >
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-300">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer",
            "text-xs font-medium transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-accent-500 focus-visible:ring-offset-2",
            "focus-visible:ring-offset-gray-800",
            "active:scale-95",
            copied
              ? "text-accent-400 bg-accent-400/10"
              : "text-gray-300 hover:text-white hover:bg-gray-700/50"
          )}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.div
                key="check"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <FiCheck className="w-4 h-4" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="clipboard"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <FiClipboard className="w-4 h-4" />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Scrollable code container */}
      <div className="overflow-x-auto w-full custom-scrollbar">
        <pre className="min-w-full p-0 whitespace-pre">
          <code ref={codeRef} className={`${className} block`}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  )
}
