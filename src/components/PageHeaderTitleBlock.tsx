/**
 * Truncated page title (max 2 lines) plus a subtitle line, shown in place of the
 * breadcrumbs once the reader scrolls down on a detail page (mobile only).
 */
export default function PageHeaderTitleBlock({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="min-w-0">
      <p className="font-semibold text-sm leading-snug line-clamp-2">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
    </div>
  )
}
