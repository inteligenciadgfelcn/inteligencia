'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { GestionOperativoService } from '@/services/operativos'
import IconPencil from '@/components/Icon/IconPencil'
import IconPrinter from '@/components/Icon/IconPrinter'
import IconSend from '@/components/Icon/IconSend'
import { useAuth } from '@/context/AuthProvider'
import type { GestionOperativoItem } from '../types'
import { Constantes } from '@/config/Constantes'

export interface GestionOperativoListadoProps {
  tipo?: 'aprobado' | 'no-aprobado' | 'con-cud' | 'todos' | 'mi-unidad'
  renderAcciones?: (row: GestionOperativoItem) => React.ReactNode
}

export function GestionOperativoListado({
  tipo = 'no-aprobado',
  renderAcciones,
}: GestionOperativoListadoProps) {
  const router = useRouter()
  const { usuario, abreviaturaUnidad } = useAuth()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['gestion-operativo-listado', tipo],
    queryFn: () => {
      if (tipo === 'aprobado')
        return GestionOperativoService.listarAprobadosPorUsuario()
      if (tipo === 'con-cud')
        return GestionOperativoService.listarConCudPorUsuario()
      if (tipo === 'todos') return GestionOperativoService.listarPorUsuario()
      if (tipo === 'mi-unidad') {
        return GestionOperativoService.listarPorUnidad(abreviaturaUnidad || '')
      }
      return GestionOperativoService.listarNoAprobadosPorUsuario()
    },
    enabled: !!usuario && (tipo !== 'mi-unidad' || !!abreviaturaUnidad),
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
        f.unidadDescripcion?.toLowerCase().includes(q) ||
        f.ianus?.toLowerCase().includes(q)
    )
  }, [filas, search])

  const total = filasFiltradas.length
  const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

  const columns: Column<GestionOperativoItem>[] = useMemo(() => {
    const cols: Column<GestionOperativoItem>[] = [
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
    ]

    if (tipo === 'con-cud') {
      cols.push({
        accessor: 'ianus',
        title: 'IANUS',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-semibold text-primary">
            {row.ianus || '-'}
          </span>
        ),
      })
    }

    cols.push(
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
            {tipo === 'no-aprobado' && (
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
            )}
            {(tipo === 'aprobado' || tipo === 'con-cud' || tipo === 'todos') && (
              <button
                type="button"
                className="text-success hover:text-success/70 transition-colors"
                onClick={() => {
                  const numeroOperativo = row.numeroOperativo
                  if (numeroOperativo) {
                    window.open(
                      `${Constantes.baseUrl}/reportes/operativos/${encodeURIComponent(numeroOperativo)}/pdf`,
                      '_blank'
                    )
                  }
                }}
                title="Imprimir Reporte"
              >
                <IconPrinter className="h-5 w-5" />
              </button>
            )}
            {tipo === 'aprobado' && (
              <button
                type="button"
                className="text-info hover:text-info/70 transition-colors"
                onClick={() => alert('Enviando a Fiscalía...')}
                title="Enviar a Fiscalía"
              >
                <IconSend className="h-5 w-5" />
              </button>
            )}
            {renderAcciones && renderAcciones(row)}
          </div>
        ),
      },
    )

    return cols
  }, [tipo])

  return (
    <div className="space-y-4">
      <div className="panel p-0">
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
