'use client'
import { useEffect, useState } from 'react'

interface MediaQueries {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isSmallScreen: boolean // xs + sm
}

export function useIsMobile(): MediaQueries {
  const [mediaQueries, setMediaQueries] = useState<MediaQueries>({
    isMobile: false,
    isTablet: false, 
    isDesktop: false,
    isSmallScreen: false,
  })

  useEffect(() => {
    function updateMediaQueries() {
      const width = window.innerWidth
      
      setMediaQueries({
        isMobile: width <= 640, // sm breakpoint
        isTablet: width > 640 && width <= 1024, // md breakpoint
        isDesktop: width > 1024, // lg+ breakpoints
        isSmallScreen: width <= 768, // xs + sm combined
      })
    }

    updateMediaQueries()
    
    window.addEventListener('resize', updateMediaQueries)
    return () => window.removeEventListener('resize', updateMediaQueries)
  }, [])

  return mediaQueries
}