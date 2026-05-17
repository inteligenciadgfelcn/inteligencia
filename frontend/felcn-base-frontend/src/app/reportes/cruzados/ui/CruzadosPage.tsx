'use client'

import { useState } from 'react'
import { useAlerts } from '@/hooks/useAlerts'
import { CruzadasService, extraerFilas, type ResultadoCruzada } from '@/services/reportes/CruzadosService'
import { FiltrosCruzadas, type BusquedaCruzada } from './FiltrosCruzadas'
import { TablaCruzadas } from './TablaCruzadas'
import { Icono } from '@/components/Icono'

export default function CruzadasPage() {
  const { Alerta } = useAlerts()
  const [rows, setRows] = useState<ResultadoCruzada[]>([])
  const [cargando, setCargando] = useState(false)
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null)

  const handleBuscar = async (busqueda: BusquedaCruzada) => {
    setCargando(true)
    setFiltroActivo(busqueda.tipo)
    try {
      let res
      switch (busqueda.tipo) {
        case 'fecha':
          res = await CruzadasService.porFecha({ fechaInicio: busqueda.fechaInicio, fechaFin: busqueda.fechaFin })
          break
        case 'caso':
          res = await CruzadasService.porCaso({ numeroCaso: busqueda.numeroCaso })
          break
        case 'tipo-droga':
          res = await CruzadasService.porTipoDroga({ idTipoDroga: busqueda.idTipoDroga, fechaInicio: busqueda.fechaInicio, fechaFin: busqueda.fechaFin })
          break
        case 'estado-droga':
          res = await CruzadasService.porEstadoDroga({ idEstadoDroga: busqueda.idEstadoDroga, fechaInicio: busqueda.fechaInicio, fechaFin: busqueda.fechaFin })
          break
        case 'tipo-operativo':
          res = await CruzadasService.porTipoOperativo({ idTipoOperacion: busqueda.idTipoOperacion, fechaInicio: busqueda.fechaInicio, fechaFin: busqueda.fechaFin })
          break
        case 'relevancia':
          res = await CruzadasService.porRelevancia({ idTipoRelevancia: busqueda.idTipoRelevancia, fechaInicio: busqueda.fechaInicio, fechaFin: busqueda.fechaFin })
          break
        case 'aprehendido':
          res = await CruzadasService.porAprehendido({ nombres: busqueda.nombres, apellidoPaterno: busqueda.apellidoPaterno, apellidoMaterno: busqueda.apellidoMaterno, apellidoEsposo: busqueda.apellidoEsposo })
          break
        case 'arrestado':
          res = await CruzadasService.porArrestado({ nombres: busqueda.nombres, apellidoPaterno: busqueda.apellidoPaterno, apellidoMaterno: busqueda.apellidoMaterno, apellidoEsposo: busqueda.apellidoEsposo })
          break
      }
      setRows(extraerFilas(res))
    } catch {
      Alerta({ mensaje: 'Error al realizar la búsqueda. Intente nuevamente.', variant: 'error' })
      setRows([])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="panel">
        <div className="flex items-center gap-3">
          <Icono nombre="IconSearch" className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Búsqueda Cruzada</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Consulta operativos por múltiples criterios de filtrado
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosCruzadas onBuscar={handleBuscar} cargando={cargando} />

      {/* Resultados */}
      <div className="panel">
        <div className="mb-3 flex items-center gap-2">
          <Icono nombre="IconTable" className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold">Resultados</h2>
        </div>
        <TablaCruzadas rows={rows} loading={cargando} filtroActivo={filtroActivo} />
      </div>
    </div>
  )
}
