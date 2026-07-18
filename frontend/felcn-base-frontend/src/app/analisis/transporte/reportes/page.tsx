'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesFlujoTransporteService } from '@/services/analisis'
import type {
  FiltroFlujoTransporteReporte,
  FlujoTransporteReporteFila,
} from '@/services/analisis'
import { FiltrosFlujoTransporte } from './ui/FiltrosFlujoTransporte'
import { ReporteFlujoTransporteListado } from './ui/ReporteFlujoTransporteListado'

export default function ReportesFlujoTransportePage() {
  const router = useRouter()
  const { Alerta } = useAlerts()

  const [filas, setFilas] = useState<FlujoTransporteReporteFila[]>([])
  const [filtro, setFiltro] = useState<FiltroFlujoTransporteReporte>({})
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado] = useState(false)

  const buscar = useCallback(
    async (f: FiltroFlujoTransporteReporte) => {
      setCargando(true)
      setFiltro(f)
      try {
        const res = await ReportesFlujoTransporteService.listar(f)
        if (res?.finalizado) {
          setFilas(res.datos ?? [])
          setBuscado(true)
        }
      } catch (e) {
        Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      } finally {
        setCargando(false)
      }
    },
    [Alerta],
  )

  return (
    <div className="space-y-4">
      <div className="panel flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Reporte de Flujo de Transporte
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Busque por documento del conductor, placa del transporte o rango de fechas, y
            descargue el listado en PDF con los colores correspondientes.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={() => router.back()}>
          ← Volver
        </Button>
      </div>

      <FiltrosFlujoTransporte onBuscar={buscar} cargando={cargando} />

      {buscado && (
        <ReporteFlujoTransporteListado filas={filas} filtro={filtro} cargando={cargando} />
      )}

      {!buscado && (
        <div className="panel">
          <div className="flex items-center justify-center py-10 text-sm text-gray-400">
            Use los filtros para buscar registros y generar el reporte.
          </div>
        </div>
      )}
    </div>
  )
}
