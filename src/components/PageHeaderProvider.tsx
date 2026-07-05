"use client"

import { createContext, ReactNode, useContext, useState } from "react"

/**
 * Title + subtitle for the currently viewed detail page (blog post, project, or work
 * item), needed to render the mobile header flip. The subtitle's meaning is left up to
 * the caller - e.g. "Jane Doe's Blog · Apr 18, 2025" for a post, "Acme Corp · 2022 - 2024"
 * for a work item.
 */
export interface PageHeaderInfo {
  title: string
  subtitle: string
}

interface PageHeaderContextValue {
  headerInfo: PageHeaderInfo | null
  setHeaderInfo: (info: PageHeaderInfo | null) => void
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null)

/**
 * Provides the current detail page's header info (title + subtitle) so that `Header`,
 * which lives outside the page content in the root layout, can render its mobile
 * header flip without needing the page data passed down as props.
 */
export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [headerInfo, setHeaderInfo] = useState<PageHeaderInfo | null>(null)

  return (
    <PageHeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </PageHeaderContext.Provider>
  )
}

/**
 * Hook for reading and updating the current detail page's header info.
 * Must be used within a `PageHeaderProvider`.
 */
export function usePageHeader() {
  const context = useContext(PageHeaderContext)
  if (!context) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider")
  }
  return context
}
