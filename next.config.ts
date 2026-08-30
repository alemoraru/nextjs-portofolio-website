import type { NextConfig } from "next"

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' is required by next-themes (theme flash prevention script)
  // and by Next.js itself for inline style injection.
  // 'unsafe-eval' is required by React in development mode only (call-stack reconstruction).
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // data: for base64 images; blob: for OG image generation
  "img-src 'self' data: blob:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  // Disallow embedding this site in any iframe (clickjacking protection)
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Serve AVIF (then WebP) where the browser supports it; the default is WebP only.
    formats: ["image/avif", "image/webp"],
    // All images are local assets that only change on deploy, so allow the optimizer
    // to cache each variant for a long time (31 days).
    minimumCacheTTL: 2_678_400,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

export default nextConfig
