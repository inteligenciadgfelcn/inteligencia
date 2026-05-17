'use client'

import { useState, useEffect } from 'react'
import type {
  RespuestaCuadro,
  FilaCuadro,
  ResumenEstadistico,
  ResumenFabrica,
  CoordenadaOp,
} from '@/services/reportes/CuadrosService'

// ─── Etiquetas de filtro ──────────────────────────────────────────────────────

const ETIQUETAS_FILTRO: Record<string, string> = {
  servicio: 'Por Código de Servicio',
  fecha: 'Por Rango de Fechas',
  'tipo-droga': 'Por Tipo de Droga',
  'tipo-operativo': 'Por Tipo de Operativo',
  relevancia: 'Por Tipo de Relevancia',
}

const OPCIONES_LIMITE = [10, 25, 50, 100] as const

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsearItems(campo: string): string[] {
  if (!campo) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

// ─── Pills ────────────────────────────────────────────────────────────────────

function CeldaPills({ valor, color }: { valor: string; color: string }) {
  const items = parsearItems(valor)
  if (items.length === 0)
    return <span className="text-gray-300 dark:text-gray-700 text-[10px]">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((it, i) => (
        <span
          key={i}
          title={it}
          className={`inline-block max-w-[220px] truncate rounded-full px-2 py-0.5 text-[10px] font-medium ${color}`}
        >
          {it}
        </span>
      ))}
    </div>
  )
}

// ─── Card de operativo ────────────────────────────────────────────────────────

const CARD_SECCIONES = [
  { label: 'Personas - Estado', key: 'personasImplicadas' as keyof FilaCuadro, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { label: 'Droga', key: 'drogas' as keyof FilaCuadro, color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { label: 'Sustancias Sólidas', key: 'sustanciasSolidas' as keyof FilaCuadro, color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { label: 'Sustancias Líquidas', key: 'sustanciasLiquidas' as keyof FilaCuadro, color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { label: 'Laboratorio y Fábricas', key: 'laboratoriosFabricas' as keyof FilaCuadro, color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { label: 'Bienes Secuestrados', key: 'bienesIncautados' as keyof FilaCuadro, color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
]

function CuadroCard({ row }: { row: FilaCuadro }) {
  const seccionesConDatos = CARD_SECCIONES.filter(s => parsearItems(row[s.key] as string).length > 0)

  return (
    <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden text-xs">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3e5f8a] to-[#5a7ba8] px-4 py-3 text-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-sm">{row.numeroCaso}</p>
            <p className="opacity-80 text-xs mt-0.5">{row.fechaOperativo}</p>
          </div>
          <div className="text-right text-xs opacity-90">
            {row.tipoOperativo && <p>{row.tipoOperativo}</p>}
            {row.tipoRelevancia && <p className="opacity-75">{row.tipoRelevancia}</p>}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] opacity-85">
          {row.ubicacionGeografica && <span>📍 {row.ubicacionGeografica}</span>}
          {row.ubicacionInstitucional && <span>🏢 {row.ubicacionInstitucional}</span>}
        </div>
        {row.asignadoFiscal && (
          <p className="mt-1 text-[11px] opacity-75">👤 {row.asignadoFiscal}</p>
        )}
        {row.totalCosto && row.totalCosto !== '0.00' && (
          <p className="mt-1 text-[11px] font-semibold">💰 Bs {row.totalCosto}</p>
        )}
      </div>

      {/* Secciones */}
      {seccionesConDatos.length === 0 ? (
        <div className="px-3 py-3 text-center text-[11px] text-gray-400">
          Sin elementos registrados
        </div>
      ) : (
        seccionesConDatos.map(sec => {
          const items = parsearItems(row[sec.key] as string)
          return (
            <div key={sec.key} className="border-t border-[#e0e6ed] dark:border-[#1b2e4b] px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
                {sec.label} ({items.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {items.map((it, i) => (
                  <span key={i} className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${sec.color}`}>
                    {it}
                  </span>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// ─── Tabla plana de filas ─────────────────────────────────────────────────────

type ColDef = {
  header: string
  key: keyof FilaCuadro
  width: string
  sticky?: boolean
  pills?: boolean
  color?: string
}

const COLS: ColDef[] = [
  { header: 'Fecha y Hora del Operativo', key: 'fechaOperativo', width: '160px', sticky: true },
  { header: 'Número de Caso', key: 'numeroCaso', width: '140px' },
  { header: 'Unidad', key: 'ubicacionInstitucional', width: '180px' },
  { header: 'Lugar del Operativo', key: 'ubicacionGeografica', width: '200px' },
  { header: 'Asignados al Caso', key: 'asignadoFiscal', width: '160px' },
  { header: 'Personas - Estado', key: 'personasImplicadas', width: '210px', pills: true, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { header: 'Droga', key: 'drogas', width: '230px', pills: true, color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { header: 'Sustancias Sólidas', key: 'sustanciasSolidas', width: '200px', pills: true, color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { header: 'Sustancias Líquidas', key: 'sustanciasLiquidas', width: '200px', pills: true, color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { header: 'Laboratorio y Fábricas', key: 'laboratoriosFabricas', width: '200px', pills: true, color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { header: 'Bienes Secuestrados', key: 'bienesIncautados', width: '190px', pills: true, color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { header: 'Tipo del Operativo', key: 'tipoOperativo', width: '140px' },
  { header: 'Relevancia', key: 'tipoRelevancia', width: '120px' },
  { header: 'Costos en Bs', key: 'totalCosto', width: '100px' },
]

function TablaFilas({ rows }: { rows: FilaCuadro[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b]">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr>
            {COLS.map(col => (
              <th
                key={col.key}
                style={{ minWidth: col.width }}
                className={`px-3 py-2 text-left text-[11px] font-semibold text-white
                  bg-[#3e5f8a] border border-[#2d4a6f] whitespace-nowrap
                  ${col.sticky ? 'sticky left-0 z-10' : ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const isEven = idx % 2 === 0
            return (
              <tr key={row.idOperativo} className={isEven ? 'bg-white dark:bg-transparent' : 'bg-gray-50 dark:bg-[#0c1528]/40'}>
                {COLS.map(col => {
                  const val = row[col.key] as string
                  const stickyBg = col.sticky
                    ? (isEven ? 'bg-white dark:bg-[#0e1726]' : 'bg-gray-50 dark:bg-[#0c1528]')
                    : ''
                  return (
                    <td
                      key={col.key}
                      className={`px-3 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] align-top
                        ${col.sticky ? `sticky left-0 z-[1] ${stickyBg} shadow-[2px_0_4px_-2px_rgba(0,0,0,.08)]` : ''}`}
                    >
                      {col.pills ? (
                        <CeldaPills valor={val} color={col.color!} />
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300">{val || '—'}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
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

function PaginacionBar({ total, page, limit, onPage, onLimit }: {
  total: number; page: number; limit: number
  onPage: (p: number) => void; onLimit: (l: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const desde = Math.min((page - 1) * limit + 1, total)
  const hasta = Math.min(page * limit, total)
  const paginas = generarPaginas(page, totalPages)

  const btnBase = 'inline-flex items-center justify-center w-7 h-7 rounded text-xs font-medium transition-colors'
  const btnNormal = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1b2e4b]/60'
  const btnActivo = 'bg-primary text-white shadow-sm pointer-events-none'
  const btnDisabled = 'text-gray-300 dark:text-gray-700 cursor-not-allowed'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1
      border-t border-[#e0e6ed] dark:border-[#1b2e4b] text-xs">
      <span className="text-gray-500 dark:text-gray-400">
        Mostrando{' '}
        <strong className="text-dark dark:text-white-light">{desde}</strong>–
        <strong className="text-dark dark:text-white-light">{hasta}</strong>{' '}
        de <strong className="text-dark dark:text-white-light">{total}</strong>{' '}
        resultado{total !== 1 ? 's' : ''}
      </span>
      <div className="flex items-center gap-0.5">
        <button type="button" onClick={() => onPage(1)} disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnNormal}`} title="Primera página">«</button>
        <button type="button" onClick={() => onPage(page - 1)} disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnNormal}`} title="Página anterior">‹</button>
        {paginas.map((p, i) =>
          p === '...' ? (
            <span key={`e-${i}`} className="w-7 text-center text-gray-400 select-none">…</span>
          ) : (
            <button key={p} type="button" onClick={() => onPage(p as number)}
              className={`${btnBase} ${p === page ? btnActivo : btnNormal}`}>{p}</button>
          )
        )}
        <button type="button" onClick={() => onPage(page + 1)} disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnNormal}`} title="Página siguiente">›</button>
        <button type="button" onClick={() => onPage(totalPages)} disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnNormal}`} title="Última página">»</button>
      </div>
      <select
        value={limit}
        onChange={e => { onLimit(Number(e.target.value)); onPage(1) }}
        className="form-select text-xs py-1 px-2 h-7 w-auto rounded border-[#e0e6ed] dark:border-[#1b2e4b]
          bg-white dark:bg-[#1b2e4b] text-gray-700 dark:text-gray-300"
      >
        {OPCIONES_LIMITE.map(l => <option key={l} value={l}>{l} / pág.</option>)}
      </select>
    </div>
  )
}

// ─── Sección: Resumen Estadístico ─────────────────────────────────────────────

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1 bg-[#e0e6ed] dark:bg-[#1b2e4b]" />
      <span className="text-xs font-bold uppercase tracking-wide text-[#3e5f8a] dark:text-[#5a7ba8] px-2 whitespace-nowrap">
        {title}{count !== undefined ? ` (${count})` : ''}
      </span>
      <div className="h-px flex-1 bg-[#e0e6ed] dark:bg-[#1b2e4b]" />
    </div>
  )
}

function PanelResumen({ resumen, fabricas }: { resumen: ResumenEstadistico; fabricas: ResumenFabrica[] }) {
  return (
    <div className="space-y-4">
      <table className="w-full text-xs border-collapse rounded-lg overflow-hidden border border-[#e0e6ed] dark:border-[#1b2e4b]">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-white bg-[#3e5f8a] border border-[#2d4a6f] font-semibold w-1/2">Descripción</th>
            <th className="px-4 py-2 text-left text-white bg-[#3e5f8a] border border-[#2d4a6f] font-semibold">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Clorhidrato de Cocaína</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.clorhidratoCocaina} Gramos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Pasta Base de Cocaína</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.cocainaBasePasta} Gramos</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Agua Rica a Cocaína Base</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.drogasLiquidasLitros} Litros = {resumen.drogasLiquidasGramos} Gramos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Cocaína Líquida a Clorhidrato</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.cocainaLiquidaLitros} Litros = {resumen.cocainaLiquidaGramos} Gramos</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Marihuana</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.marihuanaGramos} Gramos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Marihuana Líquida</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.marihuanaLitros} Litros</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300 align-top">Estupefacientes y Psicotrópicos</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">
              {resumen.otrasDrogas.length > 0 ? (
                <table className="w-full text-xs border-collapse rounded overflow-hidden">
                  <thead>
                    <tr>
                      {['Tipo Droga', 'Cantidad', 'Unidad de Medida', 'Estado de la Droga'].map(h => (
                        <th key={h} className="px-3 py-1.5 text-left text-white bg-[#5a7ba8] border border-[#4a6a98] font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {resumen.otrasDrogas.map((d, i) => (
                      <tr key={i} className="bg-white dark:bg-[#0c1528]">
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-700 dark:text-gray-300">{d.descripcionTipo}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{d.cantidad}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{d.medida}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{d.descripcionEstado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span className="text-gray-400 italic">Sin registros</span>
              )}
            </td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Químicas Sólidas</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasSolidasKg} Kilos</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Sólidas a Determinar</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasSolidasSinDet} Kilos</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Químicas Líquidas</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasLiquidasLt} Litros</td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Sustancias Líquidas a Determinar</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.sustanciasLiquidasSinDet} Litros</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300 align-top">Laboratorios - Fábricas</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">
              {fabricas.length > 0 ? (
                <table className="w-full max-w-md text-xs border-collapse rounded overflow-hidden">
                  <thead>
                    <tr>
                      <th className="px-3 py-1.5 text-left text-white bg-[#5a7ba8] border border-[#4a6a98] font-medium">Fab./Poz</th>
                      <th className="px-3 py-1.5 text-center text-white bg-[#5a7ba8] border border-[#4a6a98] font-medium w-24">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fabricas.map((f, i) => (
                      <tr key={f.idTipoFabrica} className="bg-white dark:bg-[#0c1528]">
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-700 dark:text-gray-300">{f.descripcion}</td>
                        <td className="px-3 py-1.5 border border-[#e0e6ed] dark:border-[#1b2e4b] text-center font-bold text-gray-700 dark:text-gray-300">{f.totalCantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span className="text-gray-400 italic">Sin registros</span>
              )}
            </td>
          </tr>
          <tr className="bg-white dark:bg-transparent">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Aprehendido(s)</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.totalAprehendidos}</td>
          </tr>
          <tr className="bg-gray-50 dark:bg-[#0c1528]/40">
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-medium text-gray-700 dark:text-gray-300">Arrestado(s)</td>
            <td className="px-4 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{resumen.totalArrestados}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── Sección: Coordenadas ─────────────────────────────────────────────────────

function PanelCoordenadas({ coordenadas }: { coordenadas: CoordenadaOp[] }) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  if (coordenadas.length === 0)
    return <p className="text-xs text-gray-400 dark:text-gray-600 italic py-2">Sin coordenadas GPS registradas</p>

  const totalPages = Math.max(1, Math.ceil(coordenadas.length / limit))
  const safePage = Math.min(page, totalPages)
  const pagedCoords = coordenadas.slice((safePage - 1) * limit, safePage * limit)

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b]">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              {['Nro. Caso', 'Nro. Operativo', 'Coordenadas', 'Ver en Mapa'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-white bg-[#3e5f8a] border border-[#2d4a6f] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagedCoords.map((c, i) => (
              <tr key={c.idOperativo} className={i % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-gray-50 dark:bg-[#0c1528]/40'}>
                <td className="px-3 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-700 dark:text-gray-300">{c.numeroCaso}</td>
                <td className="px-3 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] text-gray-600 dark:text-gray-400">{c.numeroOperativo}</td>
                <td className="px-3 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b] font-mono text-gray-600 dark:text-gray-400">
                  {c.coordX}, {c.coordY}
                </td>
                <td className="px-3 py-2 border border-[#e0e6ed] dark:border-[#1b2e4b]">
                  <a
                    href={`https://maps.google.com/?q=${c.coordX},${c.coordY}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs font-medium"
                  >
                    📍 Ver ubicación
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginacionBar total={coordenadas.length} page={safePage} limit={limit} onPage={setPage} onLimit={setLimit} />
    </div>
  )
}

// ─── Generación de Documentos HTML para Leaflet ────────────────────────────────

function generateMapaOperativosSrcDoc(coordenadas: CoordenadaOp[]) {
  const coordFiltradas = coordenadas.filter(c => c.coordX && c.coordY && !isNaN(parseFloat(c.coordX)) && !isNaN(parseFloat(c.coordY)))
  const markersJson = JSON.stringify(
    coordFiltradas.map(c => ({
      lat: parseFloat(c.coordX),
      lng: parseFloat(c.coordY),
      caso: c.numeroCaso,
      operativo: c.numeroOperativo,
    }))
  )
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #0f172a;
          color: #f8fafc;
          border-radius: 8px;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: #0f172a;
        }
        .leaflet-tooltip-own {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #3b82f6 !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
          font-family: 'Nunito', sans-serif !important;
          padding: 4px 8px !important;
        }
        .leaflet-tooltip-own::before {
          border-top-color: #3b82f6 !important;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const markersData = ${markersJson};
        const map = L.map('map').setView([0, 0], 2);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        if (markersData.length > 0) {
          const bounds = [];
          markersData.forEach(m => {
            const marker = L.marker([m.lat, m.lng]).addTo(map);
            
            // Tooltip que se muestra al pasar el puntero (hover)
            marker.bindTooltip(\`
              <div style="font-size: 11px; line-height: 1.3;">
                <strong style="color: #38bdf8; font-weight: 700;">Caso: \${m.caso}</strong><br/>
                <span style="color: #cbd5e1; font-weight: 500;">Op: \${m.operativo}</span>
              </div>
            \`, {
              direction: 'top',
              className: 'leaflet-tooltip-own',
              opacity: 0.95
            });

            // Popup al hacer clic
            marker.bindPopup(\`
              <div class="custom-popup" style="font-size: 12px; line-height: 1.4;">
                <strong style="color: #38bdf8; font-size: 13px;">Caso: \${m.caso}</strong><br/>
                <span style="color: #cbd5e1;">Operativo: \${m.operativo}</span><br/>
                <span style="color: #94a3b8; font-family: monospace; font-size: 10px;">Coordenadas: \${m.lat}, \${m.lng}</span>
              </div>
            \`);
            bounds.push([m.lat, m.lng]);
          });
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      </script>
    </body>
    </html>
  `
}

function generateMapaCalorSrcDoc(coordenadas: CoordenadaOp[]) {
  const coordFiltradas = coordenadas.filter(c => c.coordX && c.coordY && !isNaN(parseFloat(c.coordX)) && !isNaN(parseFloat(c.coordY)))
  const pointsJson = JSON.stringify(
    coordFiltradas.map(c => [parseFloat(c.coordX), parseFloat(c.coordY), 1.0])
  )
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
      <script src="https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const pointsData = ${pointsJson};
        const map = L.map('map').setView([0, 0], 2);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        if (pointsData.length > 0) {
          const heat = L.heatLayer(pointsData, {
            radius: 35,
            blur: 20,
            maxZoom: 10,
            max: 1.0,
            gradient: {
              0.4: 'blue',
              0.6: 'cyan',
              0.7: 'lime',
              0.8: 'yellow',
              1.0: 'red'
            }
          }).addTo(map);
          
          const bounds = pointsData.map(p => [p[0], p[1]]);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      </script>
    </body>
    </html>
  `
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

// ─── Componente principal ─────────────────────────────────────────────────────

interface ResultadosCuadrosProps {
  datos: RespuestaCuadro | null
  cargando: boolean
  filtroActivo: string | null
}

type Vista = 'tabla' | 'tarjetas'

export function ResultadosCuadros({ datos, cargando, filtroActivo }: ResultadosCuadrosProps) {
  const [vista, setVista] = useState<Vista>('tabla')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [activeTab, setActiveTab] = useState<'resultados' | 'resumen' | 'ubicacion'>('resultados')
  const [activeMapModal, setActiveMapModal] = useState<'mapa' | 'calor' | null>(null)

  const filas = datos?.filas ?? []

  useEffect(() => {
    setPage(1)
    setActiveTab('resultados')
  }, [filas])
  useEffect(() => { setPage(1) }, [vista])
  useEffect(() => {
    if (!activeMapModal) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveMapModal(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activeMapModal])

  const totalPages = Math.max(1, Math.ceil(filas.length / limit))
  const safePage = Math.min(page, totalPages)
  const pagedRows = filas.slice((safePage - 1) * limit, safePage * limit)

  const hayResultados = !cargando && filas.length > 0

  return (
    <div className="space-y-4">

      {/* ── Tabs Header ──────────────────────────────────────────────────── */}
      {(hayResultados || cargando || filtroActivo) && (
        <div className="flex flex-wrap gap-2 border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
          <button
            type="button"
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'resultados'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-500 hover:text-primary dark:bg-[#1b2e4b] dark:text-gray-400 dark:hover:text-primary'
              }`}
            onClick={() => setActiveTab('resultados')}
          >
            Cuadro de Resultados
          </button>
          {hayResultados && (
            <>
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'resumen'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-500 hover:text-primary dark:bg-[#1b2e4b] dark:text-gray-400 dark:hover:text-primary'
                  }`}
                onClick={() => setActiveTab('resumen')}
              >
                Resumen Estadístico
              </button>
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTab === 'ubicacion'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-500 hover:text-primary dark:bg-[#1b2e4b] dark:text-gray-400 dark:hover:text-primary'
                  }`}
                onClick={() => setActiveTab('ubicacion')}
              >
                Coordenadas (Lista)
              </button>
            </>
          )}
        </div>
      )}

      <div className="pt-2">
        {/* ── Cuadro de Resultados ─────────────────────────────────────────── */}
        {activeTab === 'resultados' && (
          <div className="panel space-y-3">
            <SectionHeader title="Cuadro de Resultados" count={hayResultados ? filas.length : undefined} />

            {/* Barra: filtro activo + tabs de vista */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                {filtroActivo && (
                  <>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Filtro:
                      <span className="ml-1 font-semibold text-primary">
                        {ETIQUETAS_FILTRO[filtroActivo] ?? filtroActivo}
                      </span>
                    </span>
                    {!cargando && (
                      <span className="badge badge-outline-info text-xs">
                        {filas.length} registro{filas.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 p-0.5 rounded-lg bg-gray-100 dark:bg-[#1b2e4b]/60">
                  <button
                    type="button" onClick={() => setVista('tabla')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${vista === 'tabla'
                        ? 'bg-white dark:bg-[#1a2941] text-primary shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" />
                    </svg>
                    Tabla
                  </button>
                  <button
                    type="button" onClick={() => setVista('tarjetas')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${vista === 'tarjetas'
                        ? 'bg-white dark:bg-[#1a2941] text-primary shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 4a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1V4zM2 11a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm9 0a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1h-5a1 1 0 01-1-1v-5z" />
                    </svg>
                    Tarjetas
                  </button>
                </div>

                {hayResultados && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveMapModal('mapa')}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                      title="Abrir mapa de distribución en ventana emergente (Popup)"
                    >
                      🗺️ Ver Mapa
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMapModal('calor')}
                      className="px-3 py-1.5 bg-[#805dca]/10 hover:bg-[#805dca]/20 text-[#805dca] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                      title="Abrir mapa de calor en ventana emergente (Popup)"
                    >
                      🔥 Ver Calor
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Skeletons */}
            {cargando && vista === 'tabla' && <TablaSkeleton />}
            {cargando && vista === 'tarjetas' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
              </div>
            )}

            {/* Sin resultados */}
            {!cargando && filtroActivo && filas.length === 0 && (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
                <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">Sin resultados para este criterio</p>
                <p className="text-xs mt-1 opacity-70">Intente con otros parámetros de búsqueda</p>
              </div>
            )}

            {/* Estado inicial */}
            {!cargando && !filtroActivo && (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
                <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm font-medium">Seleccione un filtro para iniciar la búsqueda</p>
              </div>
            )}

            {/* Vista tabla */}
            {hayResultados && vista === 'tabla' && (
              <>
                <TablaFilas rows={pagedRows} />
                <PaginacionBar total={filas.length} page={safePage} limit={limit} onPage={setPage} onLimit={setLimit} />
              </>
            )}

            {/* Vista tarjetas */}
            {hayResultados && vista === 'tarjetas' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pagedRows.map(row => <CuadroCard key={row.idOperativo} row={row} />)}
                </div>
                <PaginacionBar total={filas.length} page={safePage} limit={limit} onPage={setPage} onLimit={setLimit} />
              </>
            )}
          </div>
        )}

        {/* ── Resumen Estadístico ──────────────────────────────────────────── */}
        {activeTab === 'resumen' && hayResultados && datos?.resumen && (
          <div className="panel">
            <SectionHeader title="Total de Sustancia Secuestrada" />
            <PanelResumen resumen={datos.resumen} fabricas={datos.fabricas ?? []} />
          </div>
        )}

        {/* ── Coordenadas GPS ──────────────────────────────────────────────── */}
        {activeTab === 'ubicacion' && hayResultados && (
          <div className="panel animate-fade-in-down">
            <SectionHeader title="Ubicación (Lista de Coordenadas)" count={datos?.coordenadas.length} />
            <PanelCoordenadas coordenadas={datos?.coordenadas ?? []} />
          </div>
        )}

      </div>

      {/* ── Modal pantalla completa ──────────────────────────────────────── */}
      {activeMapModal && (() => {
        const coordenadas = datos?.coordenadas ?? []
        const validas = coordenadas.filter(c => c.coordX && c.coordY && !isNaN(parseFloat(c.coordX)) && !isNaN(parseFloat(c.coordY)))
        return (
          <div className="fixed inset-0 z-[99999] bg-white dark:bg-[#0e1726] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-gray-50 dark:bg-[#0c1528]/90 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg shrink-0">{activeMapModal === 'mapa' ? '🗺️' : '🔥'}</span>
                <h3 className="text-sm font-bold text-[#3e5f8a] dark:text-[#5a7ba8] truncate">
                  {activeMapModal === 'mapa'
                    ? 'Mapa de Distribución Geográfica de Operativos'
                    : 'Mapa de Calor y Densidad de Operativos'}
                </h3>
                <span className="badge badge-outline-primary text-xs shrink-0">
                  {validas.length} punto{validas.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-600">ESC para cerrar</span>
                <button
                  type="button"
                  onClick={() => setActiveMapModal(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
                    text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white
                    hover:bg-gray-100 dark:hover:bg-[#1b2e4b] transition-colors"
                  title="Cerrar (ESC)"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cerrar
                </button>
              </div>
            </div>

            {/* Mapa de borde a borde */}
            <div className="flex-1 min-h-0">
              <iframe
                srcDoc={activeMapModal === 'mapa'
                  ? generateMapaOperativosSrcDoc(coordenadas)
                  : generateMapaCalorSrcDoc(coordenadas)}
                title={activeMapModal === 'mapa' ? 'Mapa de Operativos' : 'Mapa de Calor'}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )
      })()}
    </div>
  )
}
