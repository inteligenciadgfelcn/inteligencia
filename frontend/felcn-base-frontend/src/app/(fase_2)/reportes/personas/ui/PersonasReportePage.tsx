'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAlerts } from '@/hooks/useAlerts'
import { Icono } from '@/components/Icono'
import { InterpreteMensajes } from '@/utils'
import { PersonasReporteService } from '../services/personasReporte.service'
import type {
  FilaResultado,
  FiltrosVariablesCruzadas,
  FormatoExportacion,
} from '../types/personasReporte.types'
import { FiltrosPersonas } from './FiltrosPersonas'
import { TablaPersonas } from './TablaPersonas'

export function PersonasReportePage() {
  const { Alerta } = useAlerts()
  const router = useRouter()

  const [filtros, setFiltros] = useState<FiltrosVariablesCruzadas | null>(null)
  const [rows, setRows] = useState<FilaResultado[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado] = useState(false)
  const [exportando, setExportando] = useState<FormatoExportacion | null>(null)

  const handleBuscar = (nuevosFiltros: FiltrosVariablesCruzadas) => {
    setFiltros(nuevosFiltros)
    setPage(1)
    setBuscado(true)
  }

  const handleLimpiar = useCallback(() => {
    setFiltros(null)
    setRows([])
    setTotal(0)
    setBuscado(false)
    setPage(1)
  }, [])

  useEffect(() => {
    if (!filtros) return

    let activo = true
    setCargando(true)

    PersonasReporteService.buscar(filtros, page, limit)
      .then(res => {
        if (!activo) return
        if (res?.finalizado) {
          setRows(res.datos?.filas ?? [])
          setTotal(res.datos?.total ?? 0)
        } else {
          Alerta({ mensaje: res?.mensaje || 'Error al realizar la búsqueda.', variant: 'error' })
          setRows([])
          setTotal(0)
        }
      })
      .catch(() => {
        if (!activo) return
        Alerta({ mensaje: 'Error al realizar la búsqueda. Intente nuevamente.', variant: 'error' })
        setRows([])
        setTotal(0)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => { activo = false }
  }, [filtros, page, limit, Alerta])

  const handleExportar = async (formato: FormatoExportacion, filtrosActuales: FiltrosVariablesCruzadas) => {
    setExportando(formato)
    try {
      await PersonasReporteService.exportar(formato, filtrosActuales)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setExportando(null)
    }
  }

  const handleVer = (row: FilaResultado) => {
    if (row.id_detenido == null) return
    router.push(`/reportes/personas/detalle/${row.id_detenido}`)
  }

  const hayResultados = !cargando && rows.length > 0

  return (
    <div className="space-y-4">

      {/* Encabezado */}
      <div className="panel">
        <div className="flex items-center gap-3">
          <Icono className="w-6 h-6 text-primary">manage_accounts</Icono>
          <div>
            <h1 className="text-lg font-semibold">Búsqueda de Personas — Variables Cruzadas</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Filtra personas combinando criterios de caso, datos personales y filiación
            </p>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      <FiltrosPersonas
        onBuscar={handleBuscar}
        onLimpiar={handleLimpiar}
        onExportar={handleExportar}
        cargando={cargando}
        exportando={exportando}
      />

      {/* Panel de resultados */}
      <div className="panel">
        <div className="mb-3 flex items-center gap-2 border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-2">
          <Icono className="w-4 h-4 text-gray-500">table_chart</Icono>
          <h2 className="text-sm font-semibold">Personas Encontradas</h2>
          {hayResultados && (
            <span className="badge badge-outline-info text-xs ml-auto">{total} registros</span>
          )}
        </div>
        <TablaPersonas
          rows={rows}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          loading={cargando}
          buscado={buscado}
          onVer={handleVer}
        />
      </div>

    </div>
  )
}