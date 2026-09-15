'use client'

import { useMemo } from 'react'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import IconEye from '@/components/Icon/IconEye'
import type { FilaResultado } from '../types/personasReporte.types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nombreCompleto(row: FilaResultado): string {
  return [
    row.nombres_auxiliar,
    row.apellido_paterno_auxiliar,
    row.apellido_materno_auxiliar,
    row.apellido_esposo_auxiliar,
  ]
    .filter(Boolean)
    .join(' ')
    .trim()
}

function BadgeFiliacion({ filiado }: { filiado: boolean }) {
  return filiado ? (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full
      bg-green-100 text-green-700 border border-green-200
      dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
      Filiado
    </span>
  ) : (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full
      bg-gray-100 text-gray-500 border border-gray-200
      dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
      Sin filiar
    </span>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface TablaPersonasProps {
  rows: FilaResultado[]
  total: number
  page: number
  limit: number
  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void
  loading: boolean
  buscado: boolean
  onVer: (row: FilaResultado) => void
}

export function TablaPersonas({
  rows,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  loading,
  buscado,
  onVer,
}: TablaPersonasProps) {

  const columns: Column<FilaResultado>[] = useMemo(() => [
    {
      accessor: 'numero_caso',
      title: 'Caso',
      render: (row) => (
        <div className="space-y-0.5">
          <span className="font-semibold text-dark dark:text-white-light">{row.numero_caso || '—'}</span>
          {row.nombre_caso && (
            <span className="block text-xs text-gray-500 dark:text-gray-400 line-clamp-2" title={row.nombre_caso}>
              {row.nombre_caso}
            </span>
          )}
        </div>
      ),
    },
    {
      accessor: 'cud',
      title: 'CUD',
      render: (row) => <span>{row.cud || '—'}</span>,
    },
    {
      accessor: 'numero_operativo_asignacion',
      title: 'Operativo',
      render: (row) => (
        <div className="space-y-0.5">
          <span>{row.numero_operativo_asignacion || '—'}</span>
          {row.fecha_operativo && (
            <span className="block text-[10px] text-gray-400">{row.fecha_operativo}</span>
          )}
        </div>
      ),
    },
    {
      accessor: 'persona',
      title: 'Persona',
      render: (row) => {
        const nombre = nombreCompleto(row)
        return (
          <div className="space-y-0.5 min-w-[140px]">
            <span className="font-medium">{nombre || '—'}</span>
            {row.edad != null && row.edad > 0 && (
              <span className="block text-[10px] text-gray-400">{row.edad} años</span>
            )}
          </div>
        )
      },
    },
    {
      accessor: 'documento_auxiliar',
      title: 'Documento',
      render: (row) => <span>{row.documento_auxiliar || '—'}</span>,
    },
    {
      accessor: 'pais',
      title: 'País',
      render: (row) => <span>{row.datos_sii?.pais || '—'}</span>,
    },
    {
      accessor: 'genero_auxiliar',
      title: 'Género',
      render: (row) => <span>{row.genero_auxiliar || '—'}</span>,
    },
    {
      accessor: 'estado_persona',
      title: 'Estado',
      render: (row) => <span>{row.estado_persona || '—'}</span>,
    },
    {
      accessor: 'filiacion',
      title: 'Filiación',
      render: (row) => <BadgeFiliacion filiado={row.datos_sii != null} />,
    },
    {
      accessor: 'acciones',
      title: 'Ver',
      className: 'text-center',
      render: (row) => (
        <button
          type="button"
          className="text-primary hover:text-primary/80 disabled:opacity-30 disabled:pointer-events-none"
          onClick={() => onVer(row)}
          disabled={row.id_detenido == null}
          title={row.id_detenido != null ? 'Ver detalle de la persona' : 'Sin detalle disponible'}
        >
          <IconEye className="h-5 w-5" />
        </button>
      ),
    },
  ], [onVer])

  return (
    <div>
      {/* Sin resultados */}
      {!loading && buscado && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
          <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">Sin resultados para los filtros indicados</p>
          <p className="text-xs mt-1 opacity-70">Intente ampliar los criterios de búsqueda</p>
        </div>
      )}

      {/* Estado inicial */}
      {!loading && !buscado && (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
          <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm font-medium">Configure los filtros y presione «Buscar Personas»</p>
        </div>
      )}

      {/* Tabla de resultados */}
      {buscado && (loading || rows.length > 0) && (
        <VristoDataTable<FilaResultado>
          rows={rows}
          total={total}
          page={page}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={(l) => {
            onLimitChange(l)
            onPageChange(1)
          }}
          columns={columns}
          loading={loading}
        />
      )}
    </div>
  )
}