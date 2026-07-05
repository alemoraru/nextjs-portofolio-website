"use client"

import { useEffect } from "react"
import { usePageHeader } from "@/components/PageHeaderProvider"

/**
 * Publishes the current page's title/subtitle into `PageHeaderProvider` so the mobile
 * header flip in `Header` can render them. Renders nothing itself. Used by any detail
 * page that wants the mobile header title flip (blog posts, projects, work items).
 */
export default function PageHeaderSync({ title, subtitle }: { title: string; subtitle: string }) {
  const { setHeaderInfo } = usePageHeader()

  useEffect(() => {
    setHeaderInfo({ title, subtitle })
    return () => setHeaderInfo(null)
  }, [title, subtitle, setHeaderInfo])

  return null
}
