'use client'

import { useState } from 'react'
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

export default function CruzadosAllPage() {
  const { Alerta } = useAlerts()
  const [rows, setRows]       = useState<ResultadoAvanzado[]>([])
  const [cargando, setCargando] = useState(false)
  const [buscado, setBuscado]   = useState(false)

  const handleBuscar = async (filtros: FiltrosAvanzadosParams) => {
    setCargando(true)
    setBuscado(true)
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
  }

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

      {/* Panel de resultados */}
      <div className="panel">
        <div className="mb-3 flex items-center gap-2">
          <Icono className="w-4 h-4 text-gray-500">table_chart</Icono>
          <h2 className="text-sm font-semibold">Resultados</h2>
        </div>
        <TablaAvanzada rows={rows} loading={cargando} buscado={buscado} />
      </div>

    </div>
  )
}
