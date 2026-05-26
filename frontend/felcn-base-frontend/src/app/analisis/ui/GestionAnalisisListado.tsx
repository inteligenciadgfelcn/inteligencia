'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { CasosS2iService } from '@/services/analisis'
import type { CasoS2i } from '@/services/analisis'
import IconEye from '@/components/Icon/IconEye'
import IconTrash from '@/components/Icon/IconTrash'
import { useConfirmDialog } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'

export interface GestionAnalisisListadoProps {
  idEtapa?: number
}

const formatFecha = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function GestionAnalisisListado({ idEtapa }: GestionAnalisisListadoProps) {
  const router = useRouter()
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['gestion-analisis-listado', idEtapa],
    queryFn: () => CasosS2iService.listar(idEtapa),
  })

  const filas: CasoS2i[] = useMemo(() => data?.datos ?? [], [data])

  const filasFiltradas = useMemo(() => {
    if (!search.trim()) return filas
    const q = search.toLowerCase()
    return filas.filter(
      (f) =>
        f.nombreCaso?.toLowerCase().includes(q) ||
        f.nroCasoCer?.toLowerCase().includes(q) ||
        f.descripcionPais?.toLowerCase().includes(q) ||
        f.lugar?.toLowerCase().includes(q) ||
        f.descripcionEstadoCaso?.toLowerCase().includes(q) ||
        f.descripcionEtapa?.toLowerCase().includes(q)
    )
  }, [filas, search])

  const total = filasFiltradas.length
  const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

  const eliminar = (c: CasoS2i) => {
    confirm({
      texto: `¿Eliminar el caso "${c.nombreCaso}"?`,
      onConfirm: async () => {
        try {
          // El backend no expone DELETE caso en esta versión — placeholder
          Alerta({ mensaje: 'Operación no disponible', variant: 'warning' })
        } catch (e) {
          Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
        }
      },
    })
  }

  const columns: Column<CasoS2i>[] = useMemo(() => [
    {
      accessor: 'nroCasoCer',
      title: 'Nro. Caso',
      sortable: true,
      render: (row) => (
        <span className="badge badge-outline-primary text-xs font-semibold">
          {row.nroCasoCer || '-'}
        </span>
      ),
    },
    {
      accessor: 'descripcionPais',
      title: 'País',
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-dark dark:text-white">
          {row.pais?.descripcion || '-'}
        </span>
      ),
    },
    {
      accessor: 'lugar',
      title: 'Lugar',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {row.lugar || '-'}
        </span>
      ),
    },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del Caso',
      sortable: true,
      render: (row) => (
        <button
          type="button"
          className="text-left text-primary hover:underline font-semibold"
          onClick={() => router.push(`/analisis/casos/${row.idCaso}`)}
        >
          {row.nombreCaso}
        </button>
      ),
    },
    {
      accessor: 'estadoCaso',
      title: 'Estado',
      sortable: true,
      render: (row) => (
        <span className="badge badge-outline-secondary text-xs">
          {row.estadoCaso?.descripcion || '-'}
        </span>
      ),
    },
    {
      accessor: 'etapaInvestigacion',
      title: 'Etapa',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-400">
          {row.etapaInvestigacion.descripcion || '-'}
        </span>
      ),
    },
    {
      accessor: 'fechaInicio',
      title: 'Fecha Inicio',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {formatFecha(row.fechaInicio)}
        </span>
      ),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      className:
        'sticky right-0 bg-white dark:bg-[#0e1726] z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] border-l border-white-light dark:border-[#191e3a]',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            className="text-primary hover:text-primary/70 transition-colors"
            onClick={() => router.push(`/analisis/casos/${row.idCaso}`)}
            title="Seleccionar"
          >
            <IconEye className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-danger hover:text-danger/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              eliminar(row)
            }}
            title="Eliminar"
          >
            <IconTrash className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ], [router])

  return (
    <div className="space-y-4">
      <ConfirmDialog />
      <div className="panel p-0">
        <VristoDataTable<CasoS2i>
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
