'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { S2iLookupsService } from '@/services/analisis'
import type { ColorS2i, FiltroFlujoTransporteReporte } from '@/services/analisis'
import { FiltrosFlujoTransporte } from './ui/FiltrosFlujoTransporte'
import { ReporteFlujoTransporteListado } from './ui/ReporteFlujoTransporteListado'
import { ReporteFlujoTransporteRecientes } from './ui/ReporteFlujoTransporteRecientes'
import { ReporteFlujoTransportePorColor } from './ui/ReporteFlujoTransportePorColor'

type TabFijo = 'recientes' | 'busqueda'
type Tab = TabFijo | number

export default function ReportesFlujoTransportePage() {
  const router = useRouter()

  const [tab, setTab] = useState<Tab>('recientes')
  const [colores, setColores] = useState<ColorS2i[]>([])

  const [filtro, setFiltro] = useState<FiltroFlujoTransporteReporte>({})
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false)
  const [buscado, setBuscado] = useState(false)

  useEffect(() => {
    S2iLookupsService.listarColores()
      .then((res) => {
        if (res?.finalizado) setColores(res.datos ?? [])
      })
      .catch(() => {})
  }, [])

  const buscar = useCallback((f: FiltroFlujoTransporteReporte) => {
    setFiltro(f)
    setBuscado(true)
  }, [])

  return (
    <div className="space-y-4">
      <div className="panel flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Reporte de Flujo de Transporte
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Últimos registros ingresados, búsqueda por documento/placa/fecha y vista por color.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={() => router.back()}>
          ← Volver
        </Button>
      </div>

      <div className="panel">
        <div className="mb-4 flex flex-nowrap gap-2 overflow-x-auto border-b border-[#e0e6ed] dark:border-gray-700">
          <button
            type="button"
            onClick={() => setTab('recientes')}
            className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              tab === 'recientes'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'
            }`}
          >
            Recientes
          </button>
          <button
            type="button"
            onClick={() => setTab('busqueda')}
            className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-all border-b-2 ${
              tab === 'busqueda'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'
            }`}
          >
            Búsqueda
          </button>
          {colores.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setTab(c.id)}
              className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-all border-b-2 ${
                tab === c.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary hover:border-gray-300'
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: c.hexadecimal }}
              />
              {c.descripcion}
            </button>
          ))}
        </div>

        {tab === 'recientes' && <ReporteFlujoTransporteRecientes />}

        {tab === 'busqueda' && (
          <div className="space-y-4">
            <FiltrosFlujoTransporte onBuscar={buscar} cargando={cargandoBusqueda} />

            {buscado && (
              <ReporteFlujoTransporteListado filtro={filtro} onCargandoChange={setCargandoBusqueda} />
            )}

            {!buscado && (
              <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                Use los filtros para buscar registros y generar el reporte.
              </div>
            )}
          </div>
        )}

        {typeof tab === 'number' && <ReporteFlujoTransportePorColor idColor={tab} />}
      </div>
    </div>
  )
}
