'use client'

import { useRouter } from 'next/navigation'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import type { AsignacionIngresoItem } from '@/services/seguimiento/AsignacionesIngresoService'

interface TablaSinRegistrarProps {
  rows: AsignacionIngresoItem[]
  total: number
  loading: boolean
  page: number
  limit: number
  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void
}

export function TablaSinRegistrar({
  rows,
  total,
  loading,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: TablaSinRegistrarProps) {
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
        {
          accessor: 'fechaOperativo',
          title: 'Fecha y Hora Op.',
          render: (row) =>
            row.fechaOperativo
              ? new Date(row.fechaOperativo).toLocaleString('es-BO')
              : '—',
        },
        { accessor: 'asignadoCaso', title: 'Asignado al Caso' },
        { accessor: 'fiscalAsignadoCaso', title: 'Fiscal Asignado' },
        {
          accessor: 'acciones',
          title: 'Acciones',
          render: (row) => (
            <div className="flex gap-3">
              <button
                type="button"
                className="text-primary hover:text-primary/70 transition-colors"
                onClick={() => router.push(`/seguimiento/${row.idCaso}?tab=casos`)}
                title="Casos"
              >
                <Icono className="w-5 h-5">folder_open</Icono>
              </button>
              <button
                type="button"
                className="text-info hover:text-info/70 transition-colors"
                onClick={() => router.push(`/seguimiento/${row.idCaso}?tab=personas`)}
                title="Personas"
              >
                <Icono className="w-5 h-5">people</Icono>
              </button>
              <button
                type="button"
                className="text-success hover:text-success/70 transition-colors"
                onClick={() => router.push(`/seguimiento/${row.idCaso}?tab=bienes`)}
                title="Bienes"
              >
                <Icono className="w-5 h-5">home</Icono>
              </button>
            </div>
          ),
        },
      ]}
    />
  )
}
