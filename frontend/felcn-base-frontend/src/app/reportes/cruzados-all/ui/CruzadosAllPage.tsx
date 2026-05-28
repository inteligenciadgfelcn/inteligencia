'use client'

import { useState, useMemo } from 'react'
import { useAlerts } from '@/hooks/useAlerts'
import {
  CruzadosAllService,
  extraerFilasAvanzadas,
  extraerResumen,
  extraerFabricas,
  type ResultadoAvanzado,
  type FiltrosAvanzadosParams,
  type ResumenEstadistico,
  type ResumenFabrica,
} from '@/services/reportes/CruzadosAllService'
import { FiltrosAvanzados } from './FiltrosAvanzados'
import { TablaAvanzada } from './TablaAvanzada'
import { Icono } from '@/components/Icono'
import { PanelCoordenadas } from '../../components/PanelCoordenadas'
import { PanelResumen } from '../../components/PanelResumen'
import type { CoordenadaOp } from '@/services/reportes/CuadrosService'

// ─── Componente principal ─────────────────────────────────────────────────────

type Tab = 'resultados' | 'resumen' | 'coordenadas'

export default function CruzadosAllPage() {
  const { Alerta } = useAlerts()
  const [rows, setRows]         = useState<ResultadoAvanzado[]>([])
  const [resumen, setResumen]   = useState<ResumenEstadistico | null>(null)
  const [fabricas, setFabricas] = useState<ResumenFabrica[]>([])
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado]   = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('resultados')

  const coordenadas: CoordenadaOp[] = useMemo(() =>
    rows
      .filter(r => r.coordX != null && r.coordY != null)
      .map(r => ({
        idOperativo: r.idOperativo,
        numeroCaso: r.numeroCaso,
        numeroOperativo: r.numeroOperativo,
        coordX: r.coordX as number,
        coordY: r.coordY as number,
      })),
    [rows]
  )

  const handleBuscar = async (filtros: FiltrosAvanzadosParams) => {
    setCargando(true)
    setBuscado(true)
    setActiveTab('resultados')
    try {
      const res = await CruzadosAllService.avanzado(filtros)
      setRows(extraerFilasAvanzadas(res))
      setResumen(extraerResumen(res))
      setFabricas(extraerFabricas(res))
    } catch {
      Alerta({ mensaje: 'Error al realizar la búsqueda. Intente nuevamente.', variant: 'error' })
      setRows([])
      setResumen(null)
      setFabricas([])
    } finally {
      setCargando(false)
    }
  }

  const handleLimpiar = () => {
    setRows([])
    setResumen(null)
    setFabricas([])
    setBuscado(false)
    setActiveTab('resultados')
  }

  const hayResultados = !cargando && rows.length > 0

  const TABS: { id: Tab; label: string; icono: string }[] = [
    { id: 'resultados',  label: 'Cuadro de Resultados',  icono: 'list_alt' },
    { id: 'resumen',     label: 'Resumen Estadístico',   icono: 'analytics' },
    { id: 'coordenadas', label: 'Coordenadas (Lista)',    icono: 'location_on' },
  ]

  return (
    <div className="space-y-4">

      {/* Encabezado */}
      <div className="panel">
        <div className="flex items-center gap-3">
          <Icono className="w-6 h-6 text-primary">manage_search</Icono>
          <div>
            <h1 className="text-lg font-semibold">Búsqueda Avanzada de Operativos</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Filtra operativos combinando hasta 42 criterios simultáneos — todos son opcionales
            </p>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      <FiltrosAvanzados onBuscar={handleBuscar} onLimpiar={handleLimpiar} cargando={cargando} />

      {/* Panel de resultados con tabs */}
      <div className="panel">

        {/* ── Tabs Header ──────────────────────────────────────────────────── */}
        {(hayResultados || cargando || buscado) && (
          <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b] mb-4 -mx-[1.25rem] px-[1.25rem]">
            {TABS.map(tab => {
              const activo = activeTab === tab.id
              const deshabilitado = tab.id !== 'resultados' && !hayResultados
              return (
                <button
                  key={tab.id}
                  type="button"
                  disabled={deshabilitado}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold border-b-2 transition-all
                    ${activo
                      ? 'border-primary text-primary bg-primary/5'
                      : deshabilitado
                        ? 'border-transparent text-gray-300 dark:text-gray-700 cursor-not-allowed'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <Icono className={`w-4 h-4 ${activo ? 'text-primary' : ''}`}>{tab.icono}</Icono>
                  {tab.label}
                  {tab.id === 'coordenadas' && hayResultados && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {coordenadas.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Tab: Cuadro de Resultados ─────────────────────────────────────── */}
        {activeTab === 'resultados' && (
          <>
            <div className="mb-3 flex items-center gap-2">
              <Icono className="w-4 h-4 text-gray-500">table_chart</Icono>
              <h2 className="text-sm font-semibold">Resultados</h2>
              {hayResultados && (
                <span className="badge badge-outline-info text-xs ml-auto">{rows.length} registros</span>
              )}
            </div>
            <TablaAvanzada rows={rows} loading={cargando} buscado={buscado} />
          </>
        )}

        {/* ── Tab: Resumen Estadístico ──────────────────────────────────────── */}
        {activeTab === 'resumen' && hayResultados && resumen && (
          <div>
            <div className="mb-3 flex items-center gap-2 border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
              <Icono className="w-4 h-4 text-gray-500">analytics</Icono>
              <h2 className="text-sm font-semibold text-dark dark:text-white-light">Resumen Estadístico (Total Secuestrado)</h2>
              <span className="badge badge-outline-info text-xs ml-auto">{rows.length} operativos</span>
            </div>
            <PanelResumen resumen={resumen} fabricas={fabricas} />
          </div>
        )}

        {/* ── Tab: Coordenadas ─────────────────────────────────────────────── */}
        {activeTab === 'coordenadas' && hayResultados && (
          <div>
            <div className="mb-3 flex items-center gap-2 border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
              <Icono className="w-4 h-4 text-gray-500">location_on</Icono>
              <h2 className="text-sm font-semibold text-dark dark:text-white-light">Ubicación (Lista de Coordenadas)</h2>
              <span className="badge badge-outline-info text-xs ml-auto">{coordenadas.length} puntos</span>
            </div>
            <PanelCoordenadas coordenadas={coordenadas} />
          </div>
        )}

      </div>
    </div>
  )
}
