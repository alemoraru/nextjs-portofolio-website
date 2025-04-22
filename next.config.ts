import type {NextConfig} from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx']
};

// Create MDX configuration
const withMDX = createMDX({
    extension: /\.mdx$/,
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)
