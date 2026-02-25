'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'

export default function AuthBootstrap() {
  const { inicializarUsuario } = useAuth()

  useEffect(() => {
    inicializarUsuario()
  }, [])

  return null
}
