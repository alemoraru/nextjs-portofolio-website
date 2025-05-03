import React from 'react';

type InlineCodeProps = {
    children: React.ReactNode;
};

/**
 * InlineCode component that wraps around inline code.
 * @param children - The content of the inline code.
 */
export const InlineCode = ({children}: InlineCodeProps) => {
    return (
        <code
            className="bg-gray-100 text-sm px-1.5 py-0.5 rounded-md font-mono text-gray-800
            dark:bg-gray-800 dark:text-gray-100"
        >
            {children}
        </code>
    );
};