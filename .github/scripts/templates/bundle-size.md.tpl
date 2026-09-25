## 📦 Bundle Size Report

| Asset | Size |
|-------|------|
| JavaScript | ${JS_SIZE} |
| CSS | ${CSS_SIZE} |
| Other (fonts, images, maps) | ${OTHER_SIZE} |
| **Total** (`.next/static`) | **${TOTAL_SIZE}** |

Budget: ${BUDGET_SIZE}. ${STATUS_LINE}

> [!NOTE]
> **How to read this:** sizes are raw (uncompressed) bytes of the client assets in `.next/static`, so they are larger than what users download over the wire (gzip/brotli typically shrinks JS and CSS by 60-80%). Only files in this build are counted; server code and `public/` are not included.
>
> **If over budget:** check for new or heavy dependencies, large client components, or icon/animation libraries pulled into the client bundle. Budgets are set in `.github/workflows/code-quality.yml` (`--budget-kb`).
>
> **Further reading:** [Optimizing package bundling](https://nextjs.org/docs/app/guides/package-bundling) and [Next.js Bundle Analyzer](https://nextjs.org/docs/app/guides/package-bundling#analyzing-javascript-bundles).
