'use client'
import { useCallback, useEffect, useRef } from 'react'
import { leerCookie } from '@/utils'
import { tiempoHastaExpirar } from '@/utils/token'
import { useSession } from '@/hooks/useSession'
import { useAuth } from '@/context/AuthProvider'
import { imprimir } from '@/utils/imprimir'

// Renovar el token cuando quede el 20% de su vida útil
const REFRESH_RATIO = 0.8

export const useTokenRefresh = () => {
  const { estaAutenticado } = useAuth()
  const { actualizarSesion } = useSession()

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const actualizarRef = useRef(actualizarSesion)
  // Ref al propio programar para evitar closure desactualizado en el setTimeout
  const programarRef = useRef<() => void>(() => {})

  useEffect(() => {
    actualizarRef.current = actualizarSesion
  }, [actualizarSesion])

  const limpiar = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const programar = useCallback(() => {
    limpiar()
    const token = leerCookie('token')
    if (!token) return

    const msRestantes = tiempoHastaExpirar(token)
    if (msRestantes <= 0) return

    const msParaRefresh = Math.floor(msRestantes * REFRESH_RATIO)
    imprimir(`Renovación de token programada en ${msParaRefresh} ms`)

    timerRef.current = setTimeout(async () => {
      await actualizarRef.current()
      programarRef.current() // re-programa con el nuevo token
    }, msParaRefresh)
  }, [limpiar])

  useEffect(() => {
    programarRef.current = programar
  }, [programar])

  useEffect(() => {
    if (estaAutenticado) {
      programar()
    } else {
      limpiar()
    }
    return () => limpiar()
  }, [estaAutenticado, programar, limpiar])
}
