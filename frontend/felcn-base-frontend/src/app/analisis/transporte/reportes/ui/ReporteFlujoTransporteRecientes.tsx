'use client'

import { useCallback, useEffect, useState } from 'react'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { Constantes } from '@/config/Constantes'
import { ReportesFlujoTransporteService } from '@/services/analisis'
import type { FlujoTransporteReporteFila } from '@/services/analisis'
import { columnasFlujoTransporte, fondoFilaFlujoTransporte } from './columnasFlujoTransporte'

const CANTIDAD_RECIENTES = 10

/**
 * Tab "Recientes": últimos registros de Flujo de Transporte, refrescado
 * automáticamente cada Constantes.flujoTransporteRefreshMs (parametrizable
 * vía NEXT_PUBLIC_FLUJO_TRANSPORTE_REFRESH_MS).
 */
export function ReporteFlujoTransporteRecientes() {
  const [filas, setFilas] = useState<FlujoTransporteReporteFila[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    try {
      const res = await ReportesFlujoTransporteService.listarRecientes(CANTIDAD_RECIENTES)
      if (res?.finalizado) setFilas(res.datos ?? [])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
    const intervalo = setInterval(() => void cargar(), Constantes.flujoTransporteRefreshMs)
    return () => clearInterval(intervalo)
  }, [cargar])

  return (
    <div className="panel p-0">
      <div className="flex items-center justify-between gap-2 border-b border-white-light p-3 text-xs text-gray-500 dark:border-[#191e3a]">
        <span>Últimos {CANTIDAD_RECIENTES} registros ingresados</span>
        <span>Se actualiza cada {Math.round(Constantes.flujoTransporteRefreshMs / 1000)}s</span>
      </div>
      <VristoDataTable<FlujoTransporteReporteFila>
        rows={filas}
        total={filas.length}
        page={1}
        limit={CANTIDAD_RECIENTES}
        onPageChange={() => {}}
        onLimitChange={() => {}}
        columns={columnasFlujoTransporte}
        loading={cargando}
        rowStyle={(row) => ({ backgroundColor: fondoFilaFlujoTransporte(row.colorHex) })}
      />
    </div>
  )
}
