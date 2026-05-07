'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { InvestigacionService } from '@/services/investigacion/InvestigacionService'
import type {
  AsignacionItem,
  BuscarAsignacionParams,
  OperativoItem,
} from '@/services/investigacion/InvestigacionService'
import { ExpansionOperativos } from './ExpansionOperativos'

interface TablaAsignacionProps {
  queryParams: BuscarAsignacionParams
  expandedIds: (string | number)[]
  onExpandChange: (ids: (string | number)[]) => void
  onSelectOperativo: (asignacion: AsignacionItem, operativo: OperativoItem) => void
}

const columns: Column<AsignacionItem>[] = [
  {
    accessor: 'nroOperativo',
    title: 'Nro. Operativo',
    render: (row) => (
      <span className="badge badge-outline-primary">{row.nroOperativo}</span>
    ),
  },
  {
    accessor: 'numeroCaso',
    title: 'Nro. Caso',
    sortable: true,
    render: (row) => <span className="font-semibold">{row.numeroCaso}</span>,
  },
  {
    accessor: 'nombreCaso',
    title: 'Nombre del Caso',
  },
  {
    accessor: 'unidad',
    title: 'Unidad',
  },
  {
    accessor: 'distrital',
    title: 'Distrital',
  },
  {
    accessor: 'asignadoCaso',
    title: 'Asignado',
  },
  {
    accessor: 'fiscalAsignadoCaso',
    title: 'Fiscal',
  },
]

export function TablaAsignacion({
  queryParams,
  expandedIds,
  onExpandChange,
  onSelectOperativo,
}: TablaAsignacionProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading } = useQuery({
    queryKey: ['asignacion', queryParams],
    queryFn: () => InvestigacionService.buscarAsignacion(queryParams),
    enabled: Object.keys(queryParams).length > 0,
  })

  const filas = data?.datos ?? []

  return (
    <VristoDataTable
      rows={filas}
      total={filas.length}
      page={page}
      limit={limit}
      onPageChange={setPage}
      onLimitChange={setLimit}
      columns={columns}
      loading={isLoading}
      rowExpansion={{
        idField: 'id',
        expandedIds,
        onExpandChange,
        renderContent: (row) => (
          <ExpansionOperativos asignacion={row} onSelect={onSelectOperativo} />
        ),
      }}
    />
  )
}
