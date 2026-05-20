'use client'

import { useState, useEffect } from 'react'
import type { ResultadoAvanzado } from '@/services/reportes/CruzadosAllService'
import { Constantes } from '@/config/Constantes'
import IconFile from '@/components/Icon/IconFile'
import IconPrinter from '@/components/Icon/IconPrinter'
import { exportToCSV, exportToExcel, exportToPrint } from '@/utils/tableExport'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsearItems(campo: string | null | undefined): string[] {
  if (!campo?.trim()) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

function CeldaPills({ campo, colorClase }: { campo: string; colorClase: string }) {
  const items = parsearItems(campo)
  if (!items.length) return <span className="text-gray-300 dark:text-gray-700 select-none text-xs">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, i) => (
        <span key={i} className={`inline-block text-xs font-semibold leading-relaxed px-2.5 py-0.5 rounded whitespace-pre-wrap text-left ${colorClase}`}>
          {item}
        </span>
      ))}
    </div>
  )
}

function BadgeBool({ valor, etiqueta }: { valor: boolean; etiqueta: string }) {
  if (!valor) return null
  return (
    <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full
      bg-green-100 text-green-700 border border-green-200
      dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
      {etiqueta}
    </span>
  )
}

// ─── Paginación ───────────────────────────────────────────────────────────────

const OPCIONES_LIMITE = [10, 25, 50, 100] as const

function generarPaginas(actual: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (actual <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (actual >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', actual - 1, actual, actual + 1, '...', total]
}

function PaginacionBar({
  total, page, limit, onPage, onLimit,
}: { total: number; page: number; limit: number; onPage: (p: number) => void; onLimit: (l: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const desde = Math.min((page - 1) * limit + 1, total)
  const hasta = Math.min(page * limit, total)
  const paginas = generarPaginas(page, totalPages)

  const btnBase = 'inline-flex items-center justify-center w-7 h-7 rounded text-xs font-medium transition-colors'
  const btnNormal = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1b2e4b]/60'
  const btnActivo = 'bg-primary text-white shadow-sm pointer-events-none'
  const btnOff = 'text-gray-300 dark:text-gray-700 cursor-not-allowed'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 border-t border-[#e0e6ed] dark:border-[#1b2e4b] text-xs">
      <span className="text-gray-500 dark:text-gray-400">
        Mostrando <strong className="text-dark dark:text-white-light">{desde}</strong>–<strong className="text-dark dark:text-white-light">{hasta}</strong> de <strong className="text-dark dark:text-white-light">{total}</strong> resultado{total !== 1 ? 's' : ''}
      </span>
      <div className="flex items-center gap-0.5">
        {[['«', 1], ['‹', page - 1]].map(([lbl, pg]) => (
          <button key={String(lbl)} type="button" onClick={() => onPage(pg as number)}
            disabled={page === 1} className={`${btnBase} ${page === 1 ? btnOff : btnNormal}`}>{lbl}</button>
        ))}
        {paginas.map((p, i) => p === '...'
          ? <span key={`e${i}`} className="w-7 text-center text-gray-400 select-none">…</span>
          : <button key={p} type="button" onClick={() => onPage(p as number)}
              className={`${btnBase} ${p === page ? btnActivo : btnNormal}`}>{p}</button>
        )}
        {[['›', page + 1], ['»', totalPages]].map(([lbl, pg]) => (
          <button key={String(lbl)} type="button" onClick={() => onPage(pg as number)}
            disabled={page === totalPages} className={`${btnBase} ${page === totalPages ? btnOff : btnNormal}`}>{lbl}</button>
        ))}
      </div>
      <select value={limit} onChange={e => { onLimit(Number(e.target.value)); onPage(1) }}
        className="form-select text-xs py-1 px-2 h-7 w-auto rounded border-[#e0e6ed] dark:border-[#1b2e4b] bg-white dark:bg-[#1b2e4b] text-gray-700 dark:text-gray-300">
        {OPCIONES_LIMITE.map(l => <option key={l} value={l}>{l} / pág.</option>)}
      </select>
    </div>
  )
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function TablaSkeleton() {
  return (
    <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden animate-pulse">
      <div className="h-9 bg-gray-100 dark:bg-[#1b2e4b]/60 border-b border-[#e0e6ed] dark:border-[#1b2e4b]" />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="border-b border-[#e0e6ed] dark:border-[#1b2e4b] h-20 bg-white dark:bg-transparent" />
      ))}
    </div>
  )
}

// ─── Constantes de estilos ────────────────────────────────────────────────────

const TH = 'sticky top-0 z-10 px-3 py-2 text-left text-[11px] font-semibold whitespace-nowrap ' +
  'bg-gray-50 dark:bg-[#1b2e4b] text-gray-600 dark:text-gray-400 ' +
  'border-b border-[#e0e6ed] dark:border-[#1b2e4b]'

const TD = 'px-3 py-2 align-top border-b border-[#e0e6ed] dark:border-[#1b2e4b] text-xs'

// ─── Tabla ────────────────────────────────────────────────────────────────────

function TablaFilas({ rows }: { rows: ResultadoAvanzado[] }) {
  if (!rows.length) return null
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b]">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className={`${TH} min-w-[260px] left-0 z-20`} style={{ boxShadow: '2px 0 4px -2px rgba(0,0,0,.08)' }}>
              Operativo
            </th>
            <th className={`${TH} min-w-[240px]`}>Personas Implicadas</th>
            <th className={`${TH} min-w-[280px]`}>Drogas</th>
            <th className={`${TH} min-w-[200px]`}>Sust. Sólidas</th>
            <th className={`${TH} min-w-[200px]`}>Sust. Líquidas</th>
            <th className={`${TH} min-w-[160px]`}>Laboratorios</th>
            <th className={`${TH} min-w-[180px]`}>Bienes Incautados</th>
            <th className={`${TH} min-w-[110px]`}>Costo Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const bgRow = idx % 2 === 0 ? 'bg-white dark:bg-[#0e1726]' : 'bg-gray-50/60 dark:bg-[#0c1528]'
            return (
              <tr key={`${row.idOperativo}-${idx}`} className={bgRow}>

                {/* ── Identidad (sticky) ────────────────────────────────── */}
                <td className={`${TD} min-w-[260px] ${bgRow}`}
                  style={{ position: 'sticky', left: 0, zIndex: 10, boxShadow: '2px 0 4px -2px rgba(0,0,0,.08)' }}>
                  <div className="space-y-1">

                    {/* Operativo + Caso */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {row.numeroOperativo}
                      </span>
                      <span className="font-semibold text-dark dark:text-white-light truncate max-w-[130px]" title={row.numeroCaso}>
                        {row.numeroCaso}
                      </span>
                      <button type="button"
                        className="text-success hover:text-success/75 transition-colors p-0.5 rounded hover:bg-success/5"
                        onClick={() => row.numeroOperativo && window.open(`${Constantes.baseUrl}/reportes/general/${encodeURIComponent(row.numeroOperativo)}/pdf`, '_blank')}
                        title="Imprimir Reporte General">
                        <IconPrinter className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Nombre caso + informe */}
                    {row.nombreCaso && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2" title={row.nombreCaso}>
                        {row.nombreCaso}
                      </p>
                    )}

                    {/* Fecha */}
                    <p className="text-xs text-gray-400">{row.fechaOperativo}</p>

                    {/* Ubicación geográfica */}
                    {row.ubicacionGeografica && (
                      <div className="flex items-start text-xs text-gray-500 dark:text-gray-400">
                        <svg className="mr-1 mt-[2px] shrink-0 text-gray-400 w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{row.ubicacionGeografica}</span>
                      </div>
                    )}

                    {/* Unidad */}
                    {row.ubicacionInstitucional?.replace(/-/g, '').trim() && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate" title={row.ubicacionInstitucional}>
                        {row.ubicacionInstitucional}
                      </p>
                    )}

                    {/* Asignados */}
                    {row.asignado && (
                      <p className="text-[10px] text-gray-500 truncate" title={row.asignado}>Inv.: {row.asignado}</p>
                    )}
                    {row.asignadoFiscal && (
                      <p className="text-[10px] text-gray-500 truncate" title={row.asignadoFiscal}>Fisc.: {row.asignadoFiscal}</p>
                    )}

                    {/* Tipo / Relevancia / Categoría */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {row.tipoOperativo && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {row.tipoOperativo}
                        </span>
                      )}
                      {row.tipoRelevancia && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                          {row.tipoRelevancia}
                        </span>
                      )}
                    </div>

                    {/* Indicadores booleanos */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      <BadgeBool valor={row.esPositivo}    etiqueta="Positivo" />
                      <BadgeBool valor={row.esAprehendido} etiqueta="Aprehendido" />
                      <BadgeBool valor={row.esArrestado}   etiqueta="Arrestado" />
                      <BadgeBool valor={row.esIcia}        etiqueta="ICIA" />
                      <BadgeBool valor={row.esParteDiario} etiqueta="P.Diario" />
                      <BadgeBool valor={row.esRevisado}    etiqueta="Revisado" />
                    </div>

                  </div>
                </td>

                {/* ── Personas ─────────────────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills campo={row.personasImplicadas}
                    colorClase="bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800" />
                </td>

                {/* ── Drogas ───────────────────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills campo={row.drogas}
                    colorClase="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" />
                </td>

                {/* ── Sust. Sólidas ─────────────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills campo={row.sustanciasSolidas}
                    colorClase="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" />
                </td>

                {/* ── Sust. Líquidas ────────────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills campo={row.sustanciasLiquidas}
                    colorClase="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" />
                </td>

                {/* ── Laboratorios ─────────────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills campo={row.laboratoriosFabricas}
                    colorClase="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" />
                </td>

                {/* ── Bienes Incautados ────────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills campo={row.bienesIncautados}
                    colorClase="bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800" />
                </td>

                {/* ── Costo Total ──────────────────────────────────────── */}
                <td className={TD}>
                  {row.totalCosto && row.totalCosto !== '0'
                    ? <span className="font-semibold text-green-700 dark:text-green-400">Bs {row.totalCosto}</span>
                    : <span className="text-gray-300 dark:text-gray-700">—</span>}
                </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Componente principal exportado ──────────────────────────────────────────

interface TablaAvanzadaProps {
  rows: ResultadoAvanzado[]
  loading: boolean
  buscado: boolean
}

const EXPORT_HEADERS = [
  'Operativo', 'Caso', 'Fecha', 'Tipo Op.', 'Relevancia', 'Categoría',
  'Ubicación Geog.', 'Unidad', 'Asignado', 'Fiscal', 'Personas', 'Drogas',
  'Sust. Sólidas', 'Sust. Líquidas', 'Laboratorios', 'Bienes', 'Costo Total',
]
const EXPORT_KEYS: (keyof ResultadoAvanzado)[] = [
  'numeroOperativo', 'numeroCaso', 'fechaOperativo', 'tipoOperativo', 'tipoRelevancia', 'categoriaOperativo',
  'ubicacionGeografica', 'ubicacionInstitucional', 'asignado', 'asignadoFiscal', 'personasImplicadas', 'drogas',
  'sustanciasSolidas', 'sustanciasLiquidas', 'laboratoriosFabricas', 'bienesIncautados', 'totalCosto',
]

export function TablaAvanzada({ rows, loading, buscado }: TablaAvanzadaProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(25)
  useEffect(() => { setPage(1) }, [rows])

  const totalPages = Math.max(1, Math.ceil(rows.length / limit))
  const safePage = Math.min(page, totalPages)
  const pagedRows = rows.slice((safePage - 1) * limit, safePage * limit)
  const hayResultados = !loading && rows.length > 0

  return (
    <div className="space-y-3">

      {/* Barra superior */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {buscado && !loading && (
            <span className={`badge text-xs ${rows.length > 0 ? 'badge-outline-info' : 'badge-outline-danger'}`}>
              {rows.length} resultado{rows.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {hayResultados && (
          <div className="flex items-center gap-1 mr-2">
            <button type="button" className="btn btn-primary btn-sm flex items-center gap-1"
              onClick={() => exportToCSV(rows, EXPORT_HEADERS, EXPORT_KEYS, 'operativos-avanzado')}>
              <IconFile className="w-4 h-4" /> CSV
            </button>
            <button type="button" className="btn btn-primary btn-sm flex items-center gap-1"
              onClick={() => exportToExcel(rows, EXPORT_HEADERS, EXPORT_KEYS, 'operativos-avanzado')}>
              <IconFile className="w-4 h-4" /> EXCEL
            </button>
            <button type="button" className="btn btn-primary btn-sm flex items-center gap-1"
              onClick={() => exportToPrint(rows, EXPORT_HEADERS, EXPORT_KEYS, 'Búsqueda Avanzada de Operativos')}>
              <IconPrinter className="w-4 h-4" /> PRINT
            </button>
          </div>
        )}
      </div>

      {/* Skeleton */}
      {loading && <TablaSkeleton />}

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
          <p className="text-sm font-medium">Configure los filtros y presione «Buscar Operativos»</p>
        </div>
      )}

      {/* Tabla paginada */}
      {hayResultados && (
        <>
          <TablaFilas rows={pagedRows} />
          <PaginacionBar total={rows.length} page={safePage} limit={limit} onPage={setPage} onLimit={setLimit} />
        </>
      )}
    </div>
  )
}
