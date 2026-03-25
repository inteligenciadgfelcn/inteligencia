'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { GestionOperativoService } from '@/services/operativos'
import IconPencil from '@/components/Icon/IconPencil'
import type { GestionOperativoItem } from '../types'

export interface GestionOperativoListadoProps {
  tipo?: 'aprobado' | 'no-aprobado'
  titulo?: string
}

export function GestionOperativoListado({
  tipo = 'no-aprobado',
  titulo = 'Gestión de Operativos - Listado',
}: GestionOperativoListadoProps) {
  const router = useRouter()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['gestion-operativo-listado', tipo],
    queryFn: () =>
      tipo === 'aprobado'
        ? GestionOperativoService.listarAprobadosPorUsuario('admin')
        : GestionOperativoService.listarNoAprobadosPorUsuario('admin'),
  })

  const filas: GestionOperativoItem[] = useMemo(() => data?.datos ?? [], [data])

  const filasFiltradas = useMemo(() => {
    if (!search.trim()) return filas
    const q = search.toLowerCase()
    return filas.filter(
      (f) =>
        f.nombreCaso?.toLowerCase().includes(q) ||
        f.numeroOperativo?.toLowerCase().includes(q) ||
        f.numeroCaso?.toLowerCase().includes(q) ||
        f.asignadoCaso?.toLowerCase().includes(q) ||
        f.fiscalAsignadoCaso?.toLowerCase().includes(q) ||
        f.unidadDescripcion?.toLowerCase().includes(q)
    )
  }, [filas, search])

  const total = filasFiltradas.length
  const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

  const columns: Column<GestionOperativoItem>[] = [
    {
      accessor: 'numeroOperativo',
      title: 'Nro. Operativo',
      sortable: true,
      render: (row) => (
        <span className="badge badge-outline-primary text-xs font-semibold">
          {row.numeroOperativo || '-'}
        </span>
      ),
    },
    {
      accessor: 'numeroCaso',
      title: 'Nro. Caso',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-dark dark:text-white">
          {row.numeroCaso?.trim() || '-'}
        </span>
      ),
    },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del Caso',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {row.nombreCaso?.trim() || '-'}
        </span>
      ),
    },
    {
      accessor: 'unidadDescripcion',
      title: 'Unidad',
      render: (row) => (
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {row.unidadDescripcion || '-'}
        </span>
      ),
    },
    {
      accessor: 'distritaleDescripcion',
      title: 'Distrital',
      render: (row) => (
        <span className="badge badge-outline-secondary text-xs">
          {row.distritaleDescripcion || '-'}
        </span>
      ),
    },
    {
      accessor: 'grupoDescripcion',
      title: 'Grupo',
      render: (row) => (
        <span className="text-xs text-gray-400">
          {row.grupoDescripcion || '-'}
        </span>
      ),
    },
    {
      accessor: 'asignadoCaso',
      title: 'Asignado al Caso',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.asignadoCaso?.trim() || '-'}
        </span>
      ),
    },
    {
      accessor: 'fiscalAsignadoCaso',
      title: 'Fiscal Asignado',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.fiscalAsignadoCaso?.trim() || '-'}
        </span>
      ),
    },
    {
      accessor: 'idCaso',
      title: 'Acciones',
      className:
        'sticky right-0 bg-white dark:bg-[#0e1726] z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] border-l border-white-light dark:border-[#191e3a]',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            className="text-primary hover:text-primary/70 transition-colors"
            onClick={() =>
              router.push(
                `/operaciones/operativo/gestion-operativo/registro?id=${row.idCaso}`
              )
            }
            title="Ver / Editar"
          >
            <IconPencil className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="panel">
        <h2 className="text-lg font-semibold">{titulo}</h2>
      </div>

      <div className="panel p-0 mt-4">
        <VristoDataTable<GestionOperativoItem>
          rows={filasPagina}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l)
            setPage(1)
          }}
          search={search}
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          columns={columns}
          loading={isLoading}
          extraButtons={
            <Button
              variant="outline-secondary"
              size="sm"
              className="m-1"
              onClick={() => void refetch()}
            >
              Actualizar
            </Button>
          }
        />
      </div>
    </div>
  )
}
