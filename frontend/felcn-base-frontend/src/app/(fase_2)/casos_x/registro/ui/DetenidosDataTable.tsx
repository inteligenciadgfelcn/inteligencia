'use client'

import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DataTableSortStatus } from 'mantine-datatable'

import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { getDetenidos } from '../services/registro.service'
import { Detenido } from '../types/registro.types'

export function DetenidosDataTable() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'fechaCreacion',
    direction: 'desc',
  })

  const params = useMemo(
    () => ({
      pagina: page,
      limite: limit,
      filtro: search || undefined,
      ordenar: String(sortStatus.columnAccessor),
      direccion: sortStatus.direction,
    }),
    [page, limit, search, sortStatus]
  )

  const obtenerDetenidos = async () => {
    const response = await getDetenidos(params)
    return response.datos
  }

  const { data, isFetching } = useQuery({
    queryKey: ['detenidos', page, limit, search, sortStatus],
    queryFn: obtenerDetenidos,
    placeholderData: keepPreviousData,
  })

  const filas = data?.filas ?? []
  const total = data?.total ?? 0

  const columns: Column<Detenido>[] = [
    {
      accessor: 'nombreCompleto',
      title: 'Nombre completo',
      sortable: true,
      render: (row) => (
        <span className="font-medium">{row.nombreCompleto}</span>
      ),
    },
    {
      accessor: 'numeroDocumento',
      title: 'Documento',
      sortable: true,
      render: (row) => <span>{row.numeroDocumento}</span>,
    },
    {
      accessor: 'tipoDocumento',
      title: 'Tipo documento',
      render: (row) => <span>{row.tipoDocumento || '-'}</span>,
    },
    {
      accessor: 'pais',
      title: 'País',
      render: (row) => <span>{row.pais || '-'}</span>,
    },
    {
      accessor: 'genero',
      title: 'Género',
      render: (row) => <span>{row.genero || '-'}</span>,
    },
    {
      accessor: 'estado',
      title: 'Estado',
      render: (row) => <span>{row.estado || '-'}</span>,
    },
    {
      accessor: 'fechaCreacion',
      title: 'Registro',
      sortable: true,
      render: (row) => <span>{row.fechaCreacion || '-'}</span>,
    },
  ]

  return (
    <VristoDataTable<Detenido>
      title="Detenidos registrados"
      rows={filas}
      total={total}
      page={page}
      limit={limit}
      onPageChange={setPage}
      onLimitChange={(value) => {
        setLimit(value)
        setPage(1)
      }}
      search={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      columns={columns}
      loading={isFetching}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  )
}
