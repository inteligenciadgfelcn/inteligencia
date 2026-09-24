'use client'

import { useCallback, useState } from 'react'
import { imprimir } from '@/utils/imprimir'
import type {
  FiltrosEstadisticosLgi,
} from '@/services/reportes/LgiEstadisticasService'

interface RespuestaLgi<T> {
  finalizado: boolean
  mensaje: string
  datos: T
}

type Fetcher<T> = (filtros: FiltrosEstadisticosLgi) => Promise<RespuestaLgi<T>>

export function useReporteLgi<T>(fetcher: Fetcher<T>) {
  const [datos, setDatos] = useState<T | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [consultado, setConsultado] = useState(false)

  const buscar = useCallback(
    async (filtros: FiltrosEstadisticosLgi) => {
      setCargando(true)
      setError(null)
      try {
        const res = await fetcher(filtros)
        setDatos(res.datos ?? null)
        setConsultado(true)
        if (!res.finalizado) {
          setError(res.mensaje ?? 'Error al obtener el reporte')
        }
      } catch (e) {
        imprimir(e)
        setError('No se pudo obtener el reporte. Intente nuevamente.')
        setDatos(null)
        setConsultado(true)
      } finally {
        setCargando(false)
      }
    },
    [fetcher],
  )

  const limpiar = useCallback(() => {
    setDatos(null)
    setError(null)
    setConsultado(false)
  }, [])

  return { datos, cargando, error, consultado, buscar, limpiar }
}