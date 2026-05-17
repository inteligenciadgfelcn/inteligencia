'use client'

import { useState } from 'react'
import { useAlerts } from '@/hooks/useAlerts'
import { CuadrosService, type RespuestaCuadro } from '@/services/reportes/CuadrosService'
import { FiltrosCuadros, type BusquedaCuadro } from './FiltrosCuadros'
import { ResultadosCuadros } from './ResultadosCuadros'
import { Icono } from '@/components/Icono'

export default function CuadrosPage() {
  const { Alerta } = useAlerts()
  const [datos, setDatos]             = useState<RespuestaCuadro | null>(null)
  const [cargando, setCargando]       = useState(false)
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null)

  const handleBuscar = async (busqueda: BusquedaCuadro) => {
    setCargando(true)
    setFiltroActivo(busqueda.tipo)
    try {
      let res
      switch (busqueda.tipo) {
        case 'servicio':
          res = await CuadrosService.porServicio({ codServicio: busqueda.codServicio })
          break
        case 'fecha':
          res = await CuadrosService.porFecha({ fechaInicio: busqueda.fechaInicio, fechaFin: busqueda.fechaFin })
          break
        case 'tipo-droga':
          res = await CuadrosService.porTipoDroga({
            idTipoDroga:  busqueda.idTipoDroga,
            fechaInicio:  busqueda.fechaInicio,
            fechaFin:     busqueda.fechaFin,
          })
          break
        case 'tipo-operativo':
          res = await CuadrosService.porTipoOperativo({
            idTipoOperacion: busqueda.idTipoOperacion,
            fechaInicio:     busqueda.fechaInicio,
            fechaFin:        busqueda.fechaFin,
          })
          break
        case 'relevancia':
          res = await CuadrosService.porRelevancia({
            idTipoRelevancia: busqueda.idTipoRelevancia,
            fechaInicio:      busqueda.fechaInicio,
            fechaFin:         busqueda.fechaFin,
          })
          break
      }
      setDatos(res.datos)
    } catch {
      Alerta({ mensaje: 'Error al realizar la búsqueda. Intente nuevamente.', variant: 'error' })
      setDatos(null)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="panel">
        <div className="flex items-center gap-3">
          <Icono nombre="IconClipboardList" className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Registro de Operaciones con Resultados a Nivel Nacional</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cuadro estadístico de operativos — SIII
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosCuadros onBuscar={handleBuscar} cargando={cargando} />

      {/* Resultados: filas + resumen + fábricas + coordenadas */}
      <ResultadosCuadros datos={datos} cargando={cargando} filtroActivo={filtroActivo} />
    </div>
  )
}
