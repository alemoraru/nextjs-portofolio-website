import type {NextConfig} from "next";
import createMDX from '@next/mdx'
import remarkGfm from "remark-gfm";

// Create MDX configuration
const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: []
    }
})

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']
};

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
