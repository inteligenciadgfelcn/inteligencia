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
import { ExpansionPatrimonio } from './ExpansionPatrimonio'

interface TablaAsignacionPatrimonioProps {
  queryParams: BuscarAsignacionParams
  expandedIds: (string | number)[]
  onExpandChange: (ids: (string | number)[]) => void
  onSelectOperativo: (asignacion: AsignacionItem, operativo: OperativoItem) => void
}

const columns: Column<AsignacionItem>[] = [
  {
    accessor: 'unidad',
    title: 'Unidad',
  },
  {
    accessor: 'distrital',
    title: 'Regional',
  },
  {
    accessor: 'nroOperativo',
    title: 'Nro. de Operativo',
    render: (row) => (
      <span className="badge badge-outline-primary">{row.nroOperativo}</span>
    ),
  },
  {
    accessor: 'nombreCaso',
    title: 'Nombre del Caso',
  },
  {
    accessor: 'numeroCaso',
    title: 'Nro. Caso FELCN',
    sortable: true,
    render: (row) => <span className="font-semibold">{row.numeroCaso}</span>,
  },
  {
    accessor: 'asignadoCaso',
    title: 'Asignado al Caso',
  },
  {
    accessor: 'fiscalAsignadoCaso',
    title: 'Fiscal Asignado',
  },
]

export function TablaAsignacionPatrimonio({
  queryParams,
  expandedIds,
  onExpandChange,
  onSelectOperativo,
}: TablaAsignacionPatrimonioProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading } = useQuery({
    queryKey: ['asignacion-patrimonio', queryParams],
    queryFn: () => {
      const { abreviaturaUnidad = '', ...filtros } = queryParams
      return InvestigacionService.buscarAsignacion(abreviaturaUnidad, filtros)
    },
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
          <ExpansionPatrimonio asignacion={row} onSelect={onSelectOperativo} />
        ),
      }}
    />
  )
}
