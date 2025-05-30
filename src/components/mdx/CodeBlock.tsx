'use client';

import React, {useState} from 'react';
import {FiClipboard, FiCheck} from 'react-icons/fi';

type CodeBlockProps = {
    className?: string;
    children: React.ReactNode;
};

/**
 * CodeBlock component that wraps around a code block which was rendered by MDX.
 * @param className - The class name of the code block. This is used to determine the language of the code block.
 * @param children - The content of the code block. This is typically a string of code.
 */
export function CodeBlock({className = '', children}: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const classParts = className.split(' ').filter(Boolean);
    const langPart = classParts.find(cls => cls.startsWith('language-'));
    const language = langPart ? langPart.replace('language-', '') : 'text';

    const code = typeof children === 'string' ? children.trim() : String(children).trim();

    // Copy to clipboard functionality
    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="rounded-md border border-gray-700/50 bg-[#0d1117] text-sm w-full max-w-full">
            {/* Code Block Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-100 text-xs font-mono">
                <span className="uppercase tracking-wide">{language}</span>
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1 text-xs px-2 py-1 cursor-pointer rounded-md transition-all duration-200 
                    ${
                        copied ? 'text-blue-400' : 'text-gray-300 hover:text-white hover:bg-gray-500/20'
                    }`}
                >
                    {copied ? (
                        <>
                            <FiCheck className="w-4 h-4"/>
                            Copied
                        </>
                    ) : (
                        <>
                            <FiClipboard className="w-4 h-4"/>
                            Copy
                        </>
                    )}
                </button>
            </div>

            {/* Scrollable code container */}
            <div className="overflow-x-auto w-full">
                <pre className="min-w-full p-0 whitespace-pre">
                    <code className={`${className} block`}>{children}</code>
                </pre>
            </div>
        </div>
    );
}
