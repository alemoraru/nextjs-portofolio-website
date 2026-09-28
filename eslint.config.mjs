import { createRequire } from "node:module"
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier/flat"

const require = createRequire(import.meta.url)
const { version: reactVersion } = require("react/package.json")

/**
 * ESLint configuration for a Next.js project using TypeScript.
 * Includes rules for import order and disables certain TypeScript and React hook rules.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "public/**",
    "coverage/**",
  ]),
  {
    // `eslint-config-next` sets `settings.react.version` to "detect", which makes
    // eslint-plugin-react (still at 7.37.5, its latest release) call the ESLint
    // `context.getFilename()` method to resolve a basedir for the lookup. That method
    // was removed in ESLint 10 (in favor of the `context.filename` property), so "detect"
    // crashes every lint run with "contextOrFilename.getFilename is not a function".
    // Pinning the version explicitly (read from the installed `react` package, so it stays
    // in sync) skips that lookup entirely. Safe to drop once eslint-plugin-react has
    // ESLint 10 support.
    settings: {
      react: {
        version: reactVersion,
      },
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./*", "../*"],
              message: 'Use the "@/..." alias instead of a relative import.',
            },
          ],
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off", // Temporarily disable to avoid conflicts with custom hooks
    },
  },
  {
    // package.json lives outside src/, which is all the "@/" alias maps to, so importing it
    // is the one legitimate case where a relative import is unavoidable.
    files: ["src/lib/constants.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
])

export default eslintConfig
