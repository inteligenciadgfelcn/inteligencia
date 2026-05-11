'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icono } from '@/components/Icono'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { InvestigacionService } from '@/services/investigacion/InvestigacionService'
import type { AsignacionItem, BuscarAsignacionParams } from '@/services/investigacion/InvestigacionService'
import { useAlerts } from '@/hooks/useAlerts'
import { BusquedaCasos } from '../investigacion/ui/BusquedaCasos'
import { Button } from '@/components/ui/Button'

export default function SeguimientoListPage() {
  const router = useRouter()
  const { Alerta } = useAlerts()
  const [queryParams, setQueryParams] = useState<BuscarAsignacionParams | null>(null)
  const [resultados, setResultados] = useState<AsignacionItem[]>([])
  const [cargando, setCargando] = useState(false)

  const handleSearch = async (params: BuscarAsignacionParams) => {
    try {
      setCargando(true)
      setQueryParams(params)
      
      const { abreviaturaUnidad = '', ...filtros } = params
      const res = await InvestigacionService.buscarAsignacion(abreviaturaUnidad, filtros)
      
      if (res.finalizado) {
        setResultados(res.datos)
      }
    } catch (error) {
      Alerta({ mensaje: 'Error al buscar casos', variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="panel flex items-center justify-between px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Seguimiento de Casos (SIII)
        </h2>
      </div>

      <div className="panel p-6">
        <BusquedaCasos onSearch={handleSearch} />
      </div>

      {queryParams !== null && (
        <div className="panel p-6">
          <div className="datatables">
            <VristoDataTable
              rows={resultados}
              total={resultados.length}
              loading={cargando}
              highlightOnHover
              columns={[
                { accessor: 'numeroCaso', title: 'Número de Caso' },
                { accessor: 'nombreCaso', title: 'Nombre del Caso' },
                { accessor: 'nroOperativo', title: 'Nro Operativo' },
                { accessor: 'asignadoCaso', title: 'Investigador Asignado' },
                { accessor: 'fiscalAsignadoCaso', title: 'Fiscal Asignado' },
                {
                  accessor: 'acciones',
                  title: 'Acciones',
                  textAlign: 'right',
                  render: (row) => (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => router.push(`/seguimiento/${row.id}`)}
                    >
                      <Icono className="w-4 h-4 mr-2">visibility</Icono>
                      Ver Seguimiento
                    </Button>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  )
}
