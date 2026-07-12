'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { useAuth } from '@/context/AuthProvider'

// Tiempo de inactividad antes de cerrar la sesión (15 minutos)
const INACTIVIDAD_MS = 15 * 60 * 1000
// Aviso anticipado antes del cierre (60 segundos)
const AVISO_ANTICIPADO_MS = 60_000
// Evitar recrear timers en cada evento del mouse (throttle de 5 s)
const THROTTLE_MS = 5_000

const EVENTOS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
]

export const useInactivity = () => {
  const { estaAutenticado } = useAuth()
  const { cerrarSesion } = useSession()
  const [mostrarAviso, setMostrarAviso] = useState(false)

  const cerrarRef = useRef(cerrarSesion)
  const timerAvisoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerCierreRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ultimoResetRef = useRef<number>(0)

  useEffect(() => {
    cerrarRef.current = cerrarSesion
  }, [cerrarSesion])

  const limpiar = useCallback(() => {
    if (timerAvisoRef.current) clearTimeout(timerAvisoRef.current)
    if (timerCierreRef.current) clearTimeout(timerCierreRef.current)
    timerAvisoRef.current = null
    timerCierreRef.current = null
  }, [])

  const resetear = useCallback(() => {
    limpiar()
    setMostrarAviso(false)

    timerAvisoRef.current = setTimeout(
      () => setMostrarAviso(true),
      INACTIVIDAD_MS - AVISO_ANTICIPADO_MS
    )
    timerCierreRef.current = setTimeout(() => {
      setMostrarAviso(false)
      void cerrarRef.current()
    }, INACTIVIDAD_MS)
  }, [limpiar])

  const manejarActividad = useCallback(() => {
    const ahora = Date.now()
    // Throttle: solo resetear timers una vez cada THROTTLE_MS
    if (ahora - ultimoResetRef.current < THROTTLE_MS) return
    ultimoResetRef.current = ahora
    resetear()
  }, [resetear])

  useEffect(() => {
    if (!estaAutenticado) {
      limpiar()
      setMostrarAviso(false)
      return
    }

    resetear()

    EVENTOS.forEach((ev) =>
      window.addEventListener(ev, manejarActividad, { passive: true })
    )

    return () => {
      limpiar()
      EVENTOS.forEach((ev) =>
        window.removeEventListener(ev, manejarActividad)
      )
    }
  }, [estaAutenticado, resetear, manejarActividad, limpiar])

  const continuarSesion = useCallback(() => {
    // Ignorar throttle para que el clic en "Continuar" resetee de inmediato
    ultimoResetRef.current = 0
    resetear()
  }, [resetear])

  const cerrarAhora = useCallback(async () => {
    limpiar()
    setMostrarAviso(false)
    await cerrarRef.current()
  }, [limpiar])

  return { mostrarAviso, continuarSesion, cerrarAhora }
}
