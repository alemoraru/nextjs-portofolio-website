# Next.js Developer-Themed Personal Website Template

This is a custom personal website theme built using [Next.js](https://nextjs.org), bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It's designed as a minimal,
performance-focused starting point for showcasing your **work**, **blogs**, and **projects**.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![MDX](https://img.shields.io/badge/MDX-Supported-orange?style=for-the-badge&logo=mdx)
![Vitest](https://img.shields.io/badge/Vitest-4.0-6E9F18?style=for-the-badge&logo=vitest)
![Prettier](https://img.shields.io/badge/Prettier-3.6-F7B93E?style=for-the-badge&logo=prettier)
![ESLint](https://img.shields.io/badge/ESLint-9.39-4B32C3?style=for-the-badge&logo=eslint)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

<details>
<summary><b>📝 Author's Note About This Theme</b></summary>

This theme is generally aimed at developers and designers who want to create a personal website quickly and easily. Yes,
I'm aware there are many other templates and themes available..._you can literally find them all over the internet_. The
personal goal of building this theme was to get familiar with [Next.js](https://nextjs.org), and improve skills in
**React** and **TypeScript**.

I also wanted to create a starter template for myself, since none of the existing templates met my exact design and
functionality needs, without requiring extensive modifications. So...here we are! Feel free to use this as a starting
point for your own personal website, or as a reference for doing the same thing I did: _building your own custom theme!_

</details>

![Screenshot Pages Desktop](public/homepage-screenshot-desktop.png)

![Screenshot Pages Phone](public/pages-screenshots-mobile.png)

---

## 🧱 Project Structure

The site is organized around the following main routes/pages:

- 🏠 **Home** – `/`
- 💼 **Work** – `/work`
- 🛠️ **Projects** – `/projects`
- ✍️ **Blog** – `/blog`

Each page is intentionally _simple_ and _clean_, making it easy to customize and build upon.

### ✨ Minimal Configuration Required

This theme is designed with **simplicity** in mind. After customizing your home page, adding content is as easy as
creating `.mdx` files:

- **Blog Posts**: Drop a new `.mdx` file in `src/data/blog/` with frontmatter (title, summary, date, tags)
- **Work Items**: Add an `.mdx` file in `src/data/work/` with your work details
- **Projects**: Create an `.mdx` file in `src/data/projects/` with project information

That's it! No manual configuration files to update, no arrays to maintain. The site automatically discovers and renders
your content. Just write your content in Markdown, add frontmatter metadata, and the theme handles the rest: generating
pages, navigation, filtering, and search capabilities automatically.

---

## 🚀 Getting Started

To start your development environment locally, after cloning the repository, run the following command
in the root directory of the project:

```bash
npm run dev
```

or via `pnpm` (recommended):

```bash
pnpm dev
```

Once the server is running, open [http://localhost:3000](http://localhost:3000) in your browser to view the
homepage. Running this command starts the app in development mode with hot-reloading enabled, so any changes you make to
the code will automatically reflect in the browser without needing to restart the server.

You can also build the project for production using:

```bash
npm run build
```

or via `pnpm`:

```bash
pnpm build
```

And then start the production server with:

```bash
npm start
```

or via `pnpm`:

```bash
pnpm start
```

---

## 🎨 Customization

This template is designed for easy customization! All content and configuration is centralized in the `src/data/`
folder. Here's how to make it yours:

### 1. Update Site Metadata (`src/data/metadata.ts`)

Edit `src/data/metadata.ts` to customize your site's SEO and social media information:

- **theme**: Choose an accent color for the site (e.g., `blue`, `green`, `purple`, `amber`, etc.)
- **title**: Your site/portfolio title
- **description**: A brief description of your portfolio
- **keywords**: Array of relevant keywords for SEO
- **author**: Your name and website URL
- **siteUrl**: Your actual domain (e.g., `https://yourdomain.com`)
- **social.twitter**: Your Twitter/X handle (e.g., `@yourhandle`)
- **ogImage**: Path to your Open Graph image for social media sharing

### 2. Update Personal Information (`src/data/content.ts`)

Edit `src/data/content.ts` to customize your homepage and footer:

**Homepage Intro:**

- `name`: Your name (displayed in the heading)
- `introParagraphs`: Array of introduction paragraphs about yourself
- `facts`: Your current company, education, location, languages, and role
- `additionalFacts`: Custom facts with icons (hobbies, interests, etc.)

**Footer:**

- `copyrightName`: Your name for the copyright notice
- `socialLinks`: Your social media URLs (just add the URLs, icons are automatic!)
    - Supported platforms: GitHub, LinkedIn, Goodreads, Instagram, Twitter/X, Reddit, Dribbble, YouTube, Bluesky, Stack
      Overflow, Email
    - Leave any field empty (`""`) to hide that social link
- `showVersionAndAttribution`: Set to `false` to hide the template attribution (true by default). Leaving the
  attribution is appreciated but not required!

### 3. Add Your Content (`.mdx` files)

Create `.mdx` files in the respective folders to add your content:

- **Blog Posts**: `src/data/blog/your-post.mdx`
- **Projects**: `src/data/projects/your-project.mdx`
- **Work Experience**: `src/data/work/your-job.mdx`

Each `.mdx` file should include frontmatter with metadata (title, date, tags, etc.). The site automatically discovers
and renders all content from these files!

### 4. Update Visual Assets

- **Favicon**: Replace `/public/icons/favicon.ico` with your own icon
- **OG Image**: Create a 1200x630px image at `/public/og-image.png` for social media previews

That's it! 🎉 The template automatically uses your configuration and content throughout the site. No need to modify
components or understand the codebase!

---

## 💎 Key Features

- Main dashboard (Home page), with `/work`, `/projects`, and `/blog` links
- MDX support for blog posts, projects, and work items
- Syntax highlighting for code blocks in MDX files
- Light/dark mode toggle
- Responsive design for mobile and desktop
- SEO-friendly structure and metadata
- SSR support for pagination, sorting, and filtering of blog posts, projects, and work items
- Similar blog posts recommendations
- Blog post categories pages

## 🧭 Roadmap

Planned improvement ideas and future features:

- [X] ❔ Add guides (i.e., READMEs) for creating blog/project/work pages
- [X] 🖼 Add theme customization options:
    - [X] Centralized config file for content and appearance settings
    - [X] Color palette options
- [ ] ✨ Add layout variations for customization (e.g., sidebar, grid, etc.)

---

## 📚 Learn More

Want to dig deeper into `Next.js`, or other resources, and see how this project was built? Check out the following
resources:

- [📘 Next.js Documentation](https://nextjs.org/docs): Core concepts and API
- [🎓 Learn Next.js](https://nextjs.org/learn): Interactive tutorial
- [🔗 GitHub – Next.js](https://github.com/nextjs): Source code and community discussion
- [📖 React Documentation](https://reactjs.org/docs/getting-started.html): Learn React
- [🎨 Tailwind CSS Documentation](https://tailwindcss.com/docs): Utility-first CSS framework
- [🌎 MDN Web Docs](https://developer.mozilla.org/en-US/): Comprehensive web development resources
- [🛠 Vercel Documentation](https://vercel.com/docs): Deployment and hosting with Vercel

---

## ▲ Deployment

The fastest way to deploy this app is
via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme),
the platform made by the creators of Next.js.

For more detailed instructions, check out
the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying).
If you do decide to use Vercel, this repository includes by default Analytics and Speed Insights integration.

> **Note:** This does not mean you _have_ to use Vercel. You can deploy this app on any platform that supports
> Node.js, such as [Netlify](https://www.netlify.com), [Render](https://render.com),
> [AWS Amplify](https://aws.amazon.com/amplify/), or much more.

---

## 🛠 Tech Stack

This project uses:

- ⚛️ [Next.js](https://nextjs.org) React-based framework
- 💅 [Tailwind CSS](https://tailwindcss.com) Utility-first CSS framework
- 🧱 [TypeScript](https://www.typescriptlang.org) Static typing
- 📝 [MDX](https://mdxjs.com) Markdown with JSX support
- 🧪 [Vitest](https://vitest.dev) Unit testing framework

---

## 💎 Code Quality & Guidelines

This project follows best practices for code quality and style:

- **Testing** with [Vitest](https://vitest.dev) for unit and component testing
    - Run `pnpm test` to execute all tests
    - Run `pnpm test:watch` to run tests in watch mode
    - Run `pnpm test:ui` to open the Vitest UI
    - Run `pnpm test:coverage` to generate a code coverage report (we use `v8` for fast coverage reporting). Note that
      coverage is being generated in the `coverage/` directory, and the report can be viewed by opening
      `coverage/index.html` in a browser.
    - Tests are located in the `tests/` directory, mirroring the `src/` structure
    - Check out `vitest.config.ts` for configuration details
- **Code Formatting** using [Prettier](https://prettier.io)
    - Run `pnpm format:check` to check for formatting issues
    - Run `pnpm format:write` to automatically format the code
    - Check out `.prettierrc.json` & `.prettierignore` files for configuration details
- **Linting** with [ESLint](https://eslint.org) to ensure code quality
    - Run `pnpm lint:check` to check for linting issues
    - Run `pnpm lint:write` to automatically fix linting issues where possible
    - Check out `eslint.config.mjs` file for configuration details
- **Modular and reusable** (React) components

> **Note**: To run both prettier and ESLint checks together, you can use the command:
> `pnpm format-lint` or `pnpm lint-format`.

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=alemoraru/nextjs-portofolio-website&type=date&legend=top-left)](https://www.star-history.com/#alemoraru/nextjs-portofolio-website&type=date&legend=top-left)

## 🪪 License

This project is licensed under the [MIT License](LICENSE).

## 💬 Feedback & Contributions

Got suggestions, issues, or ideas for improvement? Feel free to open an issue or submit a pull request.
Contributions are always welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details.
