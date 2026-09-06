/**
 * Reading-progress bar shown under the header on blog posts.
 *
 * The fill is driven entirely by CSS (`animation-timeline: scroll()`, see `.scroll-progress-bar`
 * in globals.css), so there is no scroll listener, no per-frame re-render, and no layout
 * measurement. Browsers without scroll-driven animation support just don't show the bar.
 */
export function ScrollProgress() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5" aria-hidden="true">
      <div className="scroll-progress-bar h-full w-full bg-accent-500" />
    </div>
  )
}
