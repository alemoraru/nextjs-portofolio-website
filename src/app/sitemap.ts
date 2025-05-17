import type {MetadataRoute} from 'next';

/**
 * Generates a sitemap.xml file for the website.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://nextjs-portofolio-website.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: 'https://nextjs-portofolio-website.vercel.app/work',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.8
        },
        {
            url: 'https://nextjs-portofolio-website.vercel.app/projects',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: 'https://nextjs-portofolio-website.vercel.app/blog',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
    ]
}
