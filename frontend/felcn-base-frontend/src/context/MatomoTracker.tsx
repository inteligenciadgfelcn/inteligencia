'use client'

import { init, push } from '@socialgouv/matomo-next'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL?.trim()
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID?.trim()

const MatomoTracker = () => {
  const pathname = usePathname()
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (MATOMO_URL && MATOMO_SITE_ID) {
      init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID })
      return () => push(['HeatmapSessionRecording::disable'])
    }
  }, [])

  useEffect(() => {
    if (MATOMO_URL && MATOMO_SITE_ID && pathname) {
      if (isInitialLoad.current) {
        isInitialLoad.current = false
      } else {
        push(['setCustomUrl', pathname])
        push(['trackPageView'])
      }
    }
  }, [pathname])

  return null
}
export default MatomoTracker
