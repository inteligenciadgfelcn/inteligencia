'use client'

import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { DataTableSortStatus } from 'mantine-datatable'

import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import IconEye from '@/components/Icon/IconEye'

import { getOperativos } from '../services/listado.service'
import { OperativoListadoItem } from '../types/listado.types'
import { CasoOperativoDetalleDialog } from './CasoOperativoDetalleDialog'

const formatDate = (value?: string | null) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export const CasosXListadoPage = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<OperativoListadoItem | null>(null)
  const [openDetail, setOpenDetail] = useState(false)

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'fechaOperativo',
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

  const fetchOperativos = async () => {
    const response = await getOperativos(params)
    return response.datos
  }

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['casos_x_operativos', page, limit, search, sortStatus],
    queryFn: fetchOperativos,
    placeholderData: keepPreviousData,
  })

  const filas = data?.filas ?? []
  const total = data?.total ?? 0

  const columns: Column<OperativoListadoItem>[] = [
    {
      accessor: 'numeroCaso',
      title: 'Nro. caso',
      sortable: true,
      render: (row) => (
        <span className="font-semibold">{row.numeroCaso?.trim() || '-'}</span>
      ),
    },
    {
      accessor: 'numeroOperativo',
      title: 'Nro. operativo',
      sortable: true,
      render: (row) => <span>{row.numeroOperativo?.trim() || '-'}</span>,
    },
    {
      accessor: 'fechaOperativo',
      title: 'Fecha operativo',
      sortable: true,
      render: (row) => <span>{formatDate(row.fechaOperativo)}</span>,
    },
    {
      accessor: 'departamento',
      title: 'Ubicacion',
      render: (row) => (
        <span>
          {row.departamento?.descripcion || '-'} /{' '}
          {row.provincia?.descripcion || '-'} /{' '}
          {row.municipio?.descripcion || '-'}
        </span>
      ),
    },
    {
      accessor: 'unidad',
      title: 'Unidad',
      render: (row) => <span>{row.unidad?.descripcion || '-'}</span>,
    },
    {
      accessor: 'distrito',
      title: 'Distrito',
      render: (row) => <span>{row.distrito?.descripcion || '-'}</span>,
    },
    {
      accessor: 'grupo',
      title: 'Grupo',
      render: (row) => <span>{row.grupo?.descripcion || '-'}</span>,
    },
    {
      accessor: 'mando',
      title: 'Mando',
      render: (row) => <span>{row.mando || '-'}</span>,
    },
    {
      accessor: 'acciones',
      title: 'Detalle',
      render: (row) => (
        <button
          type="button"
          className="text-primary hover:text-primary/80"
          onClick={() => {
            setSelected(row)
            setOpenDetail(true)
          }}
        >
          <IconEye className="h-5 w-5" />
        </button>
      ),
    },
  ]

  return (
    <div>
      {/* Breadcumb */}
      <div className="mb-5">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
              Inicio
            </button>
          </li>
          <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
            <button className="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
              Listado de Casos X
            </button>
          </li>
        </ol>
      </div>
      {/* End breadcum */}
      <div className="panel flex items-center p-3 text-primary mb-5">
        <span className="text-lg font-semibold">Listado de Casos X</span>
      </div>

      <VristoDataTable<OperativoListadoItem>
        rows={filas}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit)
          setPage(1)
        }}
        search={search}
        onSearchChange={(newSearch) => {
          setSearch(newSearch)
          setPage(1)
        }}
        columns={columns}
        loading={isFetching}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        extraButtons={
          <button
            type="button"
            className="btn btn-outline-primary btn-sm m-1"
            onClick={() => refetch()}
          >
            Actualizar
          </button>
        }
      />

      <CasoOperativoDetalleDialog
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        operativo={selected}
      />
    </div>
  )
}
