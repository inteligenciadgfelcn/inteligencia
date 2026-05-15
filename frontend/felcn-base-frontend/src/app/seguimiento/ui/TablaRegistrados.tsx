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
          accessor: 'idCaso',
          title: 'Acciones',
          render: (row) => (
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="text-primary hover:text-primary/70 transition-colors"
                onClick={() => router.push(`/seguimiento/${row.idCaso}`)}
                title="Ingresar al Seguimiento"
              >
                <Icono className="w-5 h-5">login</Icono>
              </button>
            </div>
          ),
        },
      ]}
    />
  )
}
