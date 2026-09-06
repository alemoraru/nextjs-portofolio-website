/**
 * Renders a JSON-LD structured-data `<script>` tag.
 *
 * The payload is serialized with `JSON.stringify` and every `<` is replaced with its
 * `<` Unicode escape so that a string value can never break out of the `<script>`
 * element (e.g. a title containing a literal closing script tag), which would otherwise
 * be an XSS vector.
 *
 * @param data - The structured-data object (typically a `schema-dts` `WithContext<...>`).
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
