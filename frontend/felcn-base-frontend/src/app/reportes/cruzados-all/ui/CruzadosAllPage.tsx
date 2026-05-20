'use client'

import { useState, useMemo } from 'react'
import { useAlerts } from '@/hooks/useAlerts'
import {
  CruzadosAllService,
  extraerFilasAvanzadas,
  type ResultadoAvanzado,
  type FiltrosAvanzadosParams,
} from '@/services/reportes/CruzadosAllService'
import { FiltrosAvanzados } from './FiltrosAvanzados'
import { TablaAvanzada } from './TablaAvanzada'
import { Icono } from '@/components/Icono'
import { PanelCoordenadas } from '../../components/PanelCoordenadas'
import type { CoordenadaOp } from '@/services/reportes/CuadrosService'

// ─── Resumen calculado desde filas avanzadas ──────────────────────────────────

function ResumenAvanzado({ rows }: { rows: ResultadoAvanzado[] }) {
  const resumen = useMemo(() => {
    const porRelevancia: Record<string, number> = {}
    let costoTotal = 0
    let conAprehendidos = 0
    let conArrestados = 0
    let positivos = 0
    let icia = 0

    for (const r of rows) {
      const rel = r.tipoRelevancia || 'Sin relevancia'
      porRelevancia[rel] = (porRelevancia[rel] ?? 0) + 1
      if (r.esAprehendido) conAprehendidos++
      if (r.esArrestado) conArrestados++
      if (r.esPositivo) positivos++
      if (r.esIcia) icia++
      const costo = parseFloat((r.totalCosto ?? '').replace(/,/g, '')) || 0
      costoTotal += costo
    }

    return { porRelevancia, costoTotal, conAprehendidos, conArrestados, positivos, icia }
  }, [rows])

  const tdBase = 'px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b]'
  const tdLabel = `${tdBase} font-medium text-gray-700 dark:text-gray-300`
  const tdVal = `${tdBase} text-gray-600 dark:text-gray-400`
  const trAlt = 'bg-gray-50 dark:bg-[#0c1528]/40'

  return (
    <div className="space-y-6">
      <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-[#e0e6ed] dark:border-[#1b2e4b]">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-white bg-[#3e5f8a] border border-[#2d4a6f] font-semibold w-1/2">Descripción</th>
            <th className="px-4 py-2 text-left text-white bg-[#3e5f8a] border border-[#2d4a6f] font-semibold">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white dark:bg-transparent">
            <td className={tdLabel}>Total de Operativos</td>
            <td className={tdVal}>{rows.length}</td>
          </tr>
          <tr className={trAlt}>
            <td className={tdLabel}>Con Aprehendidos</td>
            <td className={tdVal}>{resumen.conAprehendidos}</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className={tdLabel}>Con Arrestados</td>
            <td className={tdVal}>{resumen.conArrestados}</td>
          </tr>
          <tr className={trAlt}>
            <td className={tdLabel}>Positivos</td>
            <td className={tdVal}>{resumen.positivos}</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className={tdLabel}>ICIA</td>
            <td className={tdVal}>{resumen.icia}</td>
          </tr>
          <tr className={trAlt}>
            <td className={tdLabel}>Costo Total Acumulado (Bs)</td>
            <td className={`${tdVal} font-semibold text-green-700 dark:text-green-400`}>
              {resumen.costoTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className={tdLabel} style={{ verticalAlign: 'top' }}>Por Tipo de Relevancia</td>
            <td className={tdVal}>
              {Object.entries(resumen.porRelevancia).map(([rel, cnt]) => (
                <div key={rel} className="flex justify-between gap-4 py-0.5">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{rel}</span>
                  <span className="font-bold">{cnt}</span>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Tab = 'resultados' | 'resumen' | 'coordenadas'

export default function CruzadosAllPage() {
  const { Alerta } = useAlerts()
  const [rows, setRows]         = useState<ResultadoAvanzado[]>([])
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
    } catch {
      Alerta({ mensaje: 'Error al realizar la búsqueda. Intente nuevamente.', variant: 'error' })
      setRows([])
    } finally {
      setCargando(false)
    }
  }

  const handleLimpiar = () => {
    setRows([])
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
        {activeTab === 'resumen' && hayResultados && (
          <div>
            <div className="mb-3 flex items-center gap-2 border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
              <Icono className="w-4 h-4 text-gray-500">analytics</Icono>
              <h2 className="text-sm font-semibold text-dark dark:text-white-light">Resumen Estadístico</h2>
              <span className="badge badge-outline-info text-xs ml-auto">{rows.length} operativos</span>
            </div>
            <ResumenAvanzado rows={rows} />
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
