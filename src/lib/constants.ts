import packageJson from "../../package.json"

/**
 * Array of navigation items for the website (i.e. paths/pages to navigate to).
 */
export const navItems = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
]

/**
 * Array of navigation items for the website (i.e. paths/pages to navigate to) that are
 * displayed in the desktop header navigation menu. This is a subset of `navItems` that
 * excludes the "Home" item, since the header's name/initials link already goes home.
 */
export const desktopNavItems = [
  { name: "Work", path: "/work" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
]

/**
 * Version of the application from package.json.
 */
export const appVersion = packageJson.version

/**
 * Sentinel value used in work/project frontmatter `end`/`endDate` fields to mean
 * "ongoing, no end date yet".
 */
export const PRESENT = "Present"

/**
 * Default number of tag-similarity-suggested blog posts to show, e.g. at the bottom of a
 * blog post ("Other posts that might interest you") or on a tag page with no exact matches.
 */
export const DEFAULT_SIMILAR_POSTS_COUNT = 3

/**
 * Max number of tech-stack badges shown on a project card before collapsing the rest into
 * a "+N more" chip.
 */
export const MAX_PROJECT_TILE_TECH_BADGES = 5
