'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import IconShare from '@/components/Icon/IconShare'
import { FiltrosCasos } from './ui/FiltrosCasos'
import { ReporteCasosListado } from './ui/ReporteCasosListado'
import { ReportesS2iService } from '@/services/analisis'
import type { CasoReporteS2i, FiltrosCasosReporte } from '@/services/analisis'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'

export default function ReportesPage() {
  const { Alerta } = useAlerts()
  const [casos, setCasos] = useState<CasoReporteS2i[]>([])
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado] = useState(false)

  const buscar = useCallback(async (filtros: FiltrosCasosReporte) => {
    setCargando(true)
    try {
      const res = await ReportesS2iService.listar(filtros)
      if (res?.finalizado) {
        setCasos(res.datos ?? [])
        setBuscado(true)
      }
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }, [Alerta])

  return (
    <div className="space-y-6">
      <div className="panel flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Reportes de Casos Investigados
        </h2>
        <Link href="/analisis/reportes/vinculos">
          <Button variant="outline-primary" size="sm">
            <IconShare className="mr-1 h-4 w-4" /> Diagrama de Vínculos
          </Button>
        </Link>
      </div>

      <FiltrosCasos onBuscar={buscar} cargando={cargando} />

      {buscado && (
        <ReporteCasosListado casos={casos} cargando={cargando} />
      )}

      {!buscado && (
        <div className="panel">
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
            Use los filtros para buscar casos y generar reportes.
          </div>
        </div>
      )}
    </div>
  )
}
