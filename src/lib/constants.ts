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
 * Version of the application from package.json.
 */
export const appVersion = packageJson.version
