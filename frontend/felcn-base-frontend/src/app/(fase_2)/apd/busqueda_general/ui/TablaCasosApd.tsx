'use client'

import { useMemo } from 'react'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'

import type {
  FilaCasoApd,
  PersonaResumenApd,
} from '../types/busqueda-general-apd.types'
import { textoOguion } from '../utils/formatoBolivia'

/** Cuántos nombres se muestran antes de resumir con "+N". */
const MAX_BADGES_PERSONAS = 3

/* ─── Badges de personas ──────────────────────────────────────────────────── */

function BadgesPersonas({ personas }: { personas: PersonaResumenApd[] }) {
  if (!personas || personas.length === 0) {
    return <span className="text-gray-400">—</span>
  }

  const visibles = personas.slice(0, MAX_BADGES_PERSONAS)
  const restantes = personas.length - visibles.length

  return (
    <div className="flex max-w-[260px] flex-wrap gap-1">
      {visibles.map((p) => (
        <span
          key={p.deId}
          title={`${textoOguion(p.nombreCompleto)} · ${textoOguion(p.numeroDocumento)}`}
          className="inline-flex max-w-[150px] truncate rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
        >
          {textoOguion(p.nombreCompleto)}
        </span>
      ))}
      {restantes > 0 && (
        <span
          title={`${restantes} persona(s) más`}
          className="inline-flex items-center rounded-full border border-[#e0e6ed] bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:border-[#1b2e4b] dark:bg-gray-800 dark:text-gray-300"
        >
          +{restantes}
        </span>
      )}
    </div>
  )
}

/* ─── Resumen de bienes y empresas ───────────────────────────────────────── */

function resumenBienesEmpresas(fila: FilaCasoApd): string {
  const registros = fila.totales?.registrosBienes ?? 0
  const empresas = fila.totales?.empresas ?? 0
  if (registros === 0 && empresas === 0) return '—'
  return `${registros} ${registros === 1 ? 'bien' : 'bienes'} · ${empresas} ${
    empresas === 1 ? 'empresa' : 'empresas'
  }`
}

/* ─── Props ───────────────────────────────────────────────────────────────── */

interface TablaCasosApdProps {
  rows: FilaCasoApd[]
  total: number
  page: number
  limit: number
  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void
  loading: boolean
  buscado: boolean
  busqueda: string
  onBusquedaChange: (valor: string) => void
  onVerActuaciones: (fila: FilaCasoApd) => void
}

/* ─── Componente principal ────────────────────────────────────────────────── */

export function TablaCasosApd({
  rows,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  loading,
  buscado,
  busqueda,
  onBusquedaChange,
  onVerActuaciones,
}: TablaCasosApdProps) {
  const columns = useMemo<Column<FilaCasoApd>[]>(
    () => [
      {
        accessor: 'numeroCasoGiaef',
        title: 'Caso / Nombre',
        render: (row) => (
          <div className="min-w-[200px] space-y-0.5">
            <span className="font-semibold text-dark dark:text-white-light">
              {textoOguion(row.numeroCasoGiaef)}
            </span>
            {row.nombreCaso && (
              <span
                className="block max-w-[240px] truncate text-xs text-gray-500 dark:text-gray-400"
                title={row.nombreCaso}
              >
                {row.nombreCaso}
              </span>
            )}
          </div>
        ),
      },
      {
        accessor: 'personasInvestigadas',
        title: 'Personas investigadas',
        render: (row) => (
          <BadgesPersonas personas={row.personasInvestigadas ?? []} />
        ),
      },
      {
        accessor: 'actuaciones',
        title: 'Actuaciones',
        render: (row) => <span>{row.totales?.actuaciones ?? 0}</span>,
      },
      {
        accessor: 'bienesEmpresas',
        title: 'Bienes / Empresas',
        render: (row) => (
          <span className="whitespace-nowrap">
            {resumenBienesEmpresas(row)}
          </span>
        ),
      },
      {
        accessor: 'acciones',
        title: '',
        className: 'text-center',
        render: (row) => (
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            onClick={() => onVerActuaciones(row)}
            disabled={!row.casosId}
            aria-label={`Ver actuaciones del caso ${textoOguion(row.numeroCasoGiaef)}`}
          >
            <Icono className="w-4 h-4 mr-1">visibility</Icono>
            Ver actuaciones
          </Button>
        ),
      },
    ],
    [onVerActuaciones]
  )

  if (!loading && !buscado) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
        <svg
          className="mb-3 h-12 w-12 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-sm font-medium">
          Configure los filtros y presione «Buscar casos»
        </p>
      </div>
    )
  }

  if (!loading && buscado && rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
        <svg
          className="mb-3 h-12 w-12 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm font-medium">
          Sin resultados para los filtros indicados
        </p>
        <p className="mt-1 text-xs opacity-70">
          Intente ampliar los criterios de búsqueda
        </p>
      </div>
    )
  }

  return (
    <VristoDataTable<FilaCasoApd>
      rows={rows}
      total={total}
      page={page}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      search={busqueda}
      onSearchChange={onBusquedaChange}
      columns={columns}
      loading={loading}
    />
  )
}
