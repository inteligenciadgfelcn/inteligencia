'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { LgiService } from '@/services/lgi/LgiService'
import type {
  AsignacionLgiItem,
  BuscarMisCasosLgiParams,
  OperativoLgiItem,
} from '@/services/lgi/LgiService'
import { ExpansionOperativosLgi } from './ExpansionOperativosLgi'
import dayjs from 'dayjs'

interface TablaMisCasosOperativosProps {
  queryParams: BuscarMisCasosLgiParams
  expandedIds: (string | number)[]
  onExpandChange: (ids: (string | number)[]) => void
  onSelectOperativo?: (asignacion: AsignacionLgiItem, operativo: OperativoLgiItem) => void
}

const columns: Column<AsignacionLgiItem>[] = [
  { accessor: 'distrital', title: 'Regional' },
  { accessor: 'nombreCaso', title: 'Nombre del Caso' },
  { accessor: 'nroCasoGiaef', title: 'Nro. Caso GIAEF' },
  {
    accessor: 'nroCaso',
    title: 'Nro. Caso FELCN',
    render: (row) => (
      <span className="badge badge-outline-primary">{row.nroCaso}</span>
    ),
  },
  { accessor: 'nroCasoFis', title: 'Nro. Caso Fiscalía' },
  { accessor: 'nroCasoPerDom', title: 'Nro. Pérd. Dominio' },
  { accessor: 'ianus', title: 'IANUS' },
  { accessor: 'remiteFiscal', title: 'Fiscal que Remite' },
  {
    accessor: 'remiteFecha',
    title: 'Fecha Remisión',
    render: (row) => (
      <span>{row.remiteFecha ? dayjs(row.remiteFecha).format('DD/MM/YYYY') : '—'}</span>
    ),
  },
  { accessor: 'conformeA', title: 'Conforme A' },
]

export function TablaMisCasosOperativos({
  queryParams,
  expandedIds,
  onExpandChange,
  onSelectOperativo,
}: TablaMisCasosOperativosProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading } = useQuery({
    queryKey: ['lgi-mis-casos-operativos', queryParams, page, limit],
    queryFn: () => LgiService.buscarMisCasos({ ...queryParams, pagina: page, limite: limit }),
    enabled: queryParams !== null,
  })

  const filas = data?.datos?.filas ?? []
  const total = data?.datos?.page?.totalElements ?? 0

  return (
    <VristoDataTable
      rows={filas}
      total={total}
      page={page}
      limit={limit}
      onPageChange={setPage}
      onLimitChange={setLimit}
      columns={columns}
      loading={isLoading}
      rowExpansion={{
        idField: 'casosId',
        expandedIds,
        onExpandChange,
        renderContent: (row) => (
          <ExpansionOperativosLgi asignacion={row} onSelect={onSelectOperativo} />
        ),
      }}
    />
  )
}
