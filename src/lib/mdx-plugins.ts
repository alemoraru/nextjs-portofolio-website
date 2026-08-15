import { toString as hastToString } from "hast-util-to-string"
import rehypeAutolinkHeadings, {
  type BuildProperties,
  type Options as AutolinkOptions,
} from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"

const buildAnchorProperties: BuildProperties = heading => ({
  className: ["anchor-link"],
  ariaLabel: `Link to ${hastToString(heading)} section`,
})

const autolinkOptions: AutolinkOptions = {
  behavior: "append",
  properties: buildAnchorProperties,
  content: {
    type: "element",
    tagName: "span",
    properties: { className: ["anchor-icon"], ariaHidden: "true" },
    children: [{ type: "text", value: "#" }],
  },
}

/**
 * Adds an `id` to every heading and appends a hoverable "#" link to it,
 * so sections on blog, project, and work pages can be deep-linked.
 */
export const headingLinkRehypePlugins = [
  rehypeSlug,
  [rehypeAutolinkHeadings, autolinkOptions] as [typeof rehypeAutolinkHeadings, AutolinkOptions],
]
