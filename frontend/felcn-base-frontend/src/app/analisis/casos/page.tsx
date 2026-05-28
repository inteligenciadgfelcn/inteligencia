'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CasosRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/analisis')
  }, [router])

  return null
}
