# SEO Guide

This document covers all SEO features built into the template and the steps you need to take when customizing it.

---

## What's included out of the box

### Global metadata (`src/data/metadata.ts`)

All SEO-relevant metadata is centralized in `src/data/metadata.ts` and applied globally via Next.js's `<head>`:

- **Page title and description**: used by search engines and displayed in result snippets
- **Keywords**: meta keywords array
- **Author / creator / publisher** fields
- **Canonical URL**: set via `metadataBase` and `alternates.canonical`
- **Robots directives**: `index: true`, `follow: true`, with fine-grained Googlebot settings (no limits on snippet,
  image preview, or video preview length)
- **Favicon and Apple touch icon**: served from `/public/icons/`

### Open Graph and Twitter Card tags

Every page emits Open Graph and Twitter Card tags for rich link previews on social media platforms. The global defaults
come from `metadata.ts`; individual content pages (`/blog/[slug]`, `/projects/[slug]`, `/work/[slug]`) override title
and description with their own values.

### Dynamic OG image generation

Per-page Open Graph images are generated at build time using Next.js `ImageResponse`. Each image picks up the accent
color configured in `siteMetadata.theme`.

| Route              | Image content                                       |
|--------------------|-----------------------------------------------------|
| `/blog/[slug]`     | Post title, summary, up to 4 tags, publication date |
| `/blog/tag/[tag]`  | Tag name, post count, latest 3 post titles          |
| `/work/[slug]`     | Company name, role, description, period, locations  |
| `/projects/[slug]` | Project title, description, tech stack, duration    |

The home page (`/`) uses the static image at `/public/og-image.png`.

### JSON-LD structured data

Schema.org structured data is embedded in a `<script type="application/ld+json">` tag on every major page, making
content eligible for Google rich results:

| Page               | Schema type    | Key fields                                                   |
|--------------------|----------------|--------------------------------------------------------------|
| Home (`/`)         | `Person`       | Name, job title, site URL, social profile links (`sameAs`)   |
| `/blog/[slug]`     | `BlogPosting`  | Headline, summary, publish date, tags as keywords, author    |
| `/projects/[slug]` | `CreativeWork` | Name, description, dates, tech stack as keywords, GitHub URL |
| `/work/[slug]`     | `EmployeeRole` | Role name, company, description, start/end dates             |

Types are enforced via the [`schema-dts`](https://github.com/google/schema-dts) package.

### `sitemap.xml`

A `sitemap.xml` is generated automatically at `/sitemap.xml` (via `src/app/sitemap.ts`). It covers every
publicly routable URL on the site. No manual updates needed when you add/remove new content:

| Entries                       | Source                                | `changeFrequency`               | `priority` |
|-------------------------------|---------------------------------------|---------------------------------|------------|
| `/`                           | Static                                | `weekly`                        | `1.0`      |
| `/work`, `/projects`, `/blog` | Static                                | `yearly` / `monthly` / `weekly` | `0.8`      |
| `/blog/[slug]`                | All MDX files in `src/data/blog/`     | `monthly`                       | `0.6`      |
| `/blog/tag/[tag]`             | Unique tags across all posts          | `weekly`                        | `0.5`      |
| `/work/[slug]`                | All MDX files in `src/data/work/`     | `yearly`                        | `0.6`      |
| `/projects/[slug]`            | All MDX files in `src/data/projects/` | `monthly`                       | `0.6`      |

Blog post entries use the post's `date` frontmatter field as `lastModified`; project entries use `endDate`.

The `change frequency` and `priority` hints are just that: hints. Search engines may choose to ignore them
and instead crawl based on internal linking structure and their own algorithms. In reality, the actual change
frequency may, of course, vary widely based on how often you add new content or update existing pages.

### `robots.txt`

A `robots.txt` is generated automatically at `/robots.txt` (via `src/app/robots.ts`). It allows all crawlers on `/` and
disallows `/api/`, `/_next/`, and `/private/`. The sitemap URL is included.

### RSS feed

A full RSS feed is available at `/rss.xml` and is advertised in the `<head>` via an `application/rss+xml` `alternates`
link. It is built from all blog posts in `src/data/blog/`.

### `llms.txt`

A `/llms.txt` route is generated from content metadata to help AI agents and LLM crawlers discover and understand the
site's content structure.

### Per-page `<title>` and `<meta description>`

Each dynamic content page (`/blog/[slug]`, `/projects/[slug]`, `/work/[slug]`) generates its own `<title>` and
`<meta name="description">` via Next.js `generateMetadata`, overriding the global defaults.

---

## Steps to take when customizing the template

### 1. Fill in `src/data/metadata.ts`

This is the single most important file for SEO. Update every field:

```ts
export const siteMetadata = {
    title: "Your Name – Developer Portfolio",
    description: "Short, compelling description of your work (≤ 160 chars).",
    keywords: ["Your Name", "Software Engineer", "React", ...],
    author: {
        name: "Your Name",
        url: "https://yourdomain.com",
    },
    siteUrl: "https://yourdomain.com",   // or set NEXT_PUBLIC_SITE_URL in .env.local
    social: {
        twitter: "@yourhandle",
    },
    ogImage: "/og-image.png",
}
```

`siteUrl` is used in canonical URLs, sitemap entries, and JSON-LD `url` fields, so make sure it matches your actual
deployed domain exactly (no trailing slash).

### 2. Replace the static OG image

Create a 1200×630 px image and place it at `/public/og-image.png`. This image is used as the fallback for the home page
and any page without a dynamically generated image.

### 3. Replace the favicon

Replace `/public/icons/favicon.ico` with your own icon. If you add additional formats (`.png`, `.svg`), update the
`icons` object in `metadata.ts` to point to them.

### 4. Update social links in `src/data/content.ts`

The `Person` JSON-LD on the home page reads its `sameAs` links from `footerConfig.socialLinks`. Fill in your actual
profile URLs. Any field left empty (`""`) is automatically excluded from the structured data.

### 5. Populate `siteUrl` before deploying

Before your first deployment, set `NEXT_PUBLIC_SITE_URL` in your hosting environment (e.g. a Vercel environment
variable) or hardcode it in `metadata.ts`. Canonical URLs and sitemap entries will be wrong if this is left as the
default placeholder.

### 6. Submit your sitemap to Google Search Console

Once deployed, go to [Google Search Console](https://search.google.com/search-console) --> Sitemaps, and submit
`https://yourdomain.com/sitemap.xml`. This accelerates indexing.

### 7. Validate structured data

Use [Google's Rich Results Test](https://search.google.com/test/rich-results) or
the [Schema Markup Validator](https://validator.schema.org/) to verify that JSON-LD on each page is parsed correctly.
Paste the page URL or the raw JSON.

### 8. Keep the sitemap in sync with new routes

`src/app/sitemap.ts` automatically discovers all content by reading the MDX files in `src/data/blog/`,
`src/data/work/`, and `src/data/projects/` at build time. Adding a new `.mdx` file is all it takes, therefore no
manual edits to the sitemap are required.

If you add entirely new static pages (outside of the existing content types), add them to the `staticRoutes`
array at the top of `src/app/sitemap.ts`. However, for most portfolio use cases, the existing dynamic routes
should cover all your needs without modification.
