'use client'

import { useRouter } from 'next/navigation'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import type { AsignacionIngresoItem } from '@/services/seguimiento/AsignacionesIngresoService'

interface TablaRegistradosProps {
  rows: AsignacionIngresoItem[]
  total: number
  loading: boolean
  page: number
  limit: number
  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void
}

export function TablaRegistrados({
  rows,
  total,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: TablaRegistradosProps) {
  const router = useRouter()

  return (
    <VristoDataTable<AsignacionIngresoItem>
      rows={rows}
      total={total}
      loading={loading}
      page={page}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      columns={[
        { accessor: 'idCaso', title: 'Id' },
        { accessor: 'unidad', title: 'Unidad' },
        { accessor: 'distrital', title: 'Distrital' },
        { accessor: 'grupo', title: 'Grupo' },
        { accessor: 'numeroCaso', title: 'Nro. Caso' },
        { accessor: 'numeroCasoPerDom', title: 'Pérdida de Dominio' },
        { accessor: 'nroOperativo', title: 'Nro. Operativo' },
        { accessor: 'nombreCaso', title: 'Nombre Operativo' },
        { accessor: 'asignadoCaso', title: 'Asignado al Caso' },
        { accessor: 'fiscalAsignadoCaso', title: 'Fiscal Asignado' },
        {
          accessor: 'procedimientos',
          title: 'Procedimientos',
          render: (row) => (
            <div className="flex gap-1">
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(`/seguimiento/${row.idCaso}?tab=casos`)}
              >
                <Icono className="w-4 h-4 mr-1">folder_open</Icono>
                Casos
              </Button>
              <Button
                variant="info"
                size="sm"
                onClick={() => router.push(`/seguimiento/${row.idCaso}?tab=personas`)}
              >
                <Icono className="w-4 h-4 mr-1">people</Icono>
                Personas
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => router.push(`/seguimiento/${row.idCaso}?tab=bienes`)}
              >
                <Icono className="w-4 h-4 mr-1">inventory_2</Icono>
                Bienes
              </Button>
            </div>
          ),
        },
      ]}
    />
  )
}
