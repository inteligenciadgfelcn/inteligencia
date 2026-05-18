'use client'

import { useState, useEffect } from 'react'
import type { ResultadoCruzada } from '@/services/reportes/cruzadas/CruzadasService'
import { OperativoCard } from './OperativoCard'
import { TablaPlana } from './TablaPlana'

const ETIQUETAS_FILTRO: Record<string, string> = {
  fecha: 'Por Rango de Fechas',
  caso: 'Por Número de Caso',
  'tipo-droga': 'Por Tipo de Droga',
  'estado-droga': 'Por Estado de Droga',
  'tipo-operativo': 'Por Tipo de Operativo',
  relevancia: 'Por Tipo de Relevancia',
  aprehendido: 'Por Aprehendido',
  arrestado: 'Por Arrestado',
}

const OPCIONES_LIMITE = [10, 25, 50, 100] as const

interface TablaCruzadasProps {
  rows: ResultadoCruzada[]
  loading: boolean
  filtroActivo: string | null
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden animate-pulse">
      <div className="h-24 bg-gray-100 dark:bg-[#1b2e4b]/60" />
      {[1, 2, 3].map(i => (
        <div key={i} className="border-t border-[#e0e6ed] dark:border-[#1b2e4b] h-8 bg-gray-50 dark:bg-[#1b2e4b]/30" />
      ))}
    </div>
  )
}

function TablaSkeleton() {
  return (
    <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden animate-pulse">
      <div className="h-9 bg-gray-100 dark:bg-[#1b2e4b]/60 border-b border-[#e0e6ed] dark:border-[#1b2e4b]" />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] h-14 bg-white dark:bg-transparent" />
      ))}
    </div>
  )
}

// ─── Paginación ───────────────────────────────────────────────────────────────

function generarPaginas(actual: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (actual <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (actual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', actual - 1, actual, actual + 1, '...', total]
}

interface PaginacionBarProps {
  total: number
  page: number
  limit: number
  onPage: (p: number) => void
  onLimit: (l: number) => void
}

function PaginacionBar({ total, page, limit, onPage, onLimit }: PaginacionBarProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const desde = Math.min((page - 1) * limit + 1, total)
  const hasta = Math.min(page * limit, total)
  const paginas = generarPaginas(page, totalPages)

  const btnBase =
    'inline-flex items-center justify-center w-7 h-7 rounded text-xs font-medium transition-colors'
  const btnNormal =
    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1b2e4b]/60'
  const btnActivo =
    'bg-primary text-white shadow-sm pointer-events-none'
  const btnDisabled =
    'text-gray-300 dark:text-gray-700 cursor-not-allowed'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1
      border-t border-[#e0e6ed] dark:border-[#1b2e4b] text-xs">

      {/* Resumen */}
      <span className="text-gray-500 dark:text-gray-400">
        Mostrando{' '}
        <strong className="text-dark dark:text-white-light">{desde}</strong>–
        <strong className="text-dark dark:text-white-light">{hasta}</strong>{' '}
        de{' '}
        <strong className="text-dark dark:text-white-light">{total}</strong>{' '}
        resultado{total !== 1 ? 's' : ''}
      </span>

      {/* Botones de página */}
      <div className="flex items-center gap-0.5">
        {/* Primera */}
        <button
          type="button"
          onClick={() => onPage(1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnNormal}`}
          title="Primera página"
        >
          «
        </button>
        {/* Anterior */}
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnNormal}`}
          title="Página anterior"
        >
          ‹
        </button>

        {paginas.map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="w-7 text-center text-gray-400 select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p as number)}
              className={`${btnBase} ${p === page ? btnActivo : btnNormal}`}
            >
              {p}
            </button>
          )
        )}

        {/* Siguiente */}
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnNormal}`}
          title="Página siguiente"
        >
          ›
        </button>
        {/* Última */}
        <button
          type="button"
          onClick={() => onPage(totalPages)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnNormal}`}
          title="Última página"
        >
          »
        </button>
      </div>

      {/* Selector de filas por página */}
      <select
        value={limit}
        onChange={e => { onLimit(Number(e.target.value)); onPage(1) }}
        className="form-select text-xs py-1 px-2 h-7 w-auto rounded border-[#e0e6ed] dark:border-[#1b2e4b]
          bg-white dark:bg-[#1b2e4b] text-gray-700 dark:text-gray-300"
      >
        {OPCIONES_LIMITE.map(l => (
          <option key={l} value={l}>{l} / pág.</option>
        ))}
      </select>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Vista = 'tabla' | 'tarjetas'

export function TablaCruzadas({ rows, loading, filtroActivo }: TablaCruzadasProps) {
  const [vista, setVista] = useState<Vista>('tabla')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(25)

  // Resetea la paginación al recibir nuevos resultados o cambiar de vista
  useEffect(() => { setPage(1) }, [rows])
  useEffect(() => { setPage(1) }, [vista])

  const totalPages = Math.max(1, Math.ceil(rows.length / limit))
  const safeePage = Math.min(page, totalPages)
  const pagedRows = rows.slice((safeePage - 1) * limit, safeePage * limit)

  const hayResultados = !loading && rows.length > 0

  return (
    <div className="space-y-3">

      {/* ── Barra superior: filtro activo + tabs ─────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">

        {/* Filtro activo + conteo total */}
        <div className="flex items-center gap-3">
          {filtroActivo && (
            <>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Filtro:
                <span className="ml-1 font-semibold text-primary">
                  {ETIQUETAS_FILTRO[filtroActivo] ?? filtroActivo}
                </span>
              </span>
              {!loading && (
                <span className="badge badge-outline-info text-xs">
                  {rows.length} resultado{rows.length !== 1 ? 's' : ''}
                </span>
              )}
            </>
          )}
        </div>

        {/* Selector de vista (tabs pill) */}
        <div className="flex gap-0.5 p-0.5 rounded-lg bg-gray-100 dark:bg-[#1b2e4b]/60">
          <button
            type="button"
            onClick={() => setVista('tabla')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
              ${vista === 'tabla'
                ? 'bg-white dark:bg-[#1a2941] text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" />
            </svg>
            Tabla
          </button>
          <button
            type="button"
            onClick={() => setVista('tarjetas')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
              ${vista === 'tarjetas'
                ? 'bg-white dark:bg-[#1a2941] text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 4a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1V4zM2 11a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5z" />
            </svg>
            Tarjetas
          </button>
        </div>
      </div>

      {/* ── Skeleton de carga ────────────────────────────────────────────── */}
      {loading && vista === 'tabla' && <TablaSkeleton />}
      {loading && vista === 'tarjetas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* ── Sin resultados ───────────────────────────────────────────────── */}
      {!loading && filtroActivo && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
          <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">Sin resultados para este criterio</p>
          <p className="text-xs mt-1 opacity-70">Intente con otros parámetros de búsqueda</p>
        </div>
      )}

      {/* ── Estado inicial ───────────────────────────────────────────────── */}
      {!loading && !filtroActivo && (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
          <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm font-medium">Seleccione un filtro para iniciar la búsqueda</p>
        </div>
      )}

      {/* ── Tab 1: Tabla con pills inline (paginada) ─────────────────────── */}
      {hayResultados && vista === 'tabla' && (
        <>
          <TablaPlana rows={pagedRows} />
          <PaginacionBar
            total={rows.length}
            page={safeePage}
            limit={limit}
            onPage={setPage}
            onLimit={setLimit}
          />
        </>
      )}

      {/* ── Tab 2: Grilla de tarjetas (paginada) ─────────────────────────── */}
      {hayResultados && vista === 'tarjetas' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pagedRows.map((row, idx) => (
              <OperativoCard key={`${row.idOperativo}-${idx}`} row={row} />
            ))}
          </div>
          <PaginacionBar
            total={rows.length}
            page={safeePage}
            limit={limit}
            onPage={setPage}
            onLimit={setLimit}
          />
        </>
      )}
    </div>
  )
}
