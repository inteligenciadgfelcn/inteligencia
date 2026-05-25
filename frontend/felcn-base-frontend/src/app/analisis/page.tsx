'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalisisRootPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/analisis/casos') }, [router])
  return null
}
