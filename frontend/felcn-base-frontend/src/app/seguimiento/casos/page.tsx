'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icono } from '@/components/Icono'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { InvestigacionService } from '@/services/investigacion/InvestigacionService'
import type { AsignacionItem, BuscarAsignacionParams } from '@/services/investigacion/InvestigacionService'
import { useAlerts } from '@/hooks/useAlerts'
import { BusquedaCasos } from '../../investigacion/ui/BusquedaCasos'
import { Button } from '@/components/ui/Button'

export default function SeguimientoCasosPage() {
  const router = useRouter()
  const { Alerta } = useAlerts()
  const [queryParams, setQueryParams] = useState<BuscarAsignacionParams | null>(null)
  const [resultados, setResultados] = useState<AsignacionItem[]>([])
  const [cargando, setCargando] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const handleSearch = async (params: BuscarAsignacionParams) => {
    try {
      setCargando(true)
      setQueryParams(params)
      setPage(1)

      const { abreviaturaUnidad = '', ...filtros } = params
      const res = await InvestigacionService.buscarAsignacion(abreviaturaUnidad, filtros)

      if (res.finalizado) {
        const filas = Array.isArray(res.datos) ? res.datos : (res.datos as any)?.filas || []
        setResultados(filas)
      }
    } catch {
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
        <div className="panel p-4">
          <VristoDataTable
            rows={resultados}
            total={resultados.length}
            loading={cargando}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            columns={[
              { accessor: 'numeroCaso', title: 'Nro. Caso' },
              { accessor: 'nombreCaso', title: 'Nombre del Caso' },
              { accessor: 'nroOperativo', title: 'Nro. Operativo' },
              { accessor: 'asignadoCaso', title: 'Investigador' },
              { accessor: 'fiscalAsignadoCaso', title: 'Fiscal Asignado' },
              {
                accessor: 'acciones',
                title: 'Acciones',
                render: (row: AsignacionItem) => (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => router.push(`/seguimiento/${row.id}?tab=casos`)}
                  >
                    <Icono className="w-4 h-4 mr-1">visibility</Icono>
                    Casos
                  </Button>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  )
}
