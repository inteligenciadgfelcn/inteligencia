'use client'

import type { ResultadoCruzada } from '@/services/reportes/CruzadasService'

function parsearItems(campo: string | null | undefined): string[] {
  if (!campo?.trim()) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

interface CeldaPillsProps {
  campo: string
  colorClase: string
}

function CeldaPills({ campo, colorClase }: CeldaPillsProps) {
  const items = parsearItems(campo)
  if (items.length === 0) {
    return <span className="text-gray-300 dark:text-gray-700 select-none">—</span>
  }
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-block text-[10px] leading-relaxed px-1.5 py-0.5 rounded whitespace-pre-wrap text-left ${colorClase}`}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

const TH = 'sticky top-0 z-10 px-3 py-2 text-left text-[11px] font-semibold whitespace-nowrap ' +
  'bg-gray-50 dark:bg-[#1b2e4b] text-gray-600 dark:text-gray-400 ' +
  'border-b border-[#e0e6ed] dark:border-[#1b2e4b]'

const TD = 'px-3 py-2 align-top border-b border-[#e0e6ed] dark:border-[#1b2e4b] text-xs'

export function TablaPlana({ rows }: { rows: ResultadoCruzada[] }) {
  if (rows.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b]">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {/* Columna de identidad — sticky izquierda */}
            <th
              className={`${TH} min-w-[210px] left-0 z-20`}
              style={{ boxShadow: '2px 0 4px -2px rgba(0,0,0,.08)' }}
            >
              Operativo
            </th>
            <th className={`${TH} min-w-[240px]`}>Coca</th>
            <th className={`${TH} min-w-[240px]`}>Drogas Decomisadas</th>
            <th className={`${TH} min-w-[200px]`}>Sust. Precursoras Sólidas</th>
            <th className={`${TH} min-w-[200px]`}>Sust. Precursoras Líquidas</th>
            <th className={`${TH} min-w-[180px]`}>Laboratorios y Fábricas</th>
            <th className={`${TH} min-w-[220px]`}>Arrestados</th>
            <th className={`${TH} min-w-[220px]`}>Personas Implicadas</th>
            <th className={`${TH} min-w-[180px]`}>Bienes Incautados</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const bgRow = idx % 2 === 0
              ? 'bg-white dark:bg-[#0e1726]'
              : 'bg-gray-50/60 dark:bg-[#0c1528]'
            return (
              <tr key={row.idOperativo} className={bgRow}>

                {/* ── Identidad del operativo (sticky) ─────────────────── */}
                <td
                  className={`${TD} min-w-[210px] ${bgRow}`}
                  style={{ position: 'sticky', left: 0, zIndex: 10, boxShadow: '2px 0 4px -2px rgba(0,0,0,.08)' }}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {row.numeroOperativo}
                      </span>
                      <span className="font-semibold text-dark dark:text-white-light truncate max-w-[130px]" title={row.numeroCaso}>
                        {row.numeroCaso}
                      </span>
                    </div>
                    {row.nombreCaso && (
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2" title={row.nombreCaso}>
                        {row.nombreCaso}
                      </p>
                    )}
                    {row.asignadoCaso && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5 truncate" title={row.asignadoCaso}>
                        Asig.: {row.asignadoCaso}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400">{row.fechaOperativo}</p>
                    {row.ubicacionGeografica && (
                      <div className="flex items-start text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 mt-[3px] shrink-0 text-gray-400">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="whitespace-pre-line">{row.ubicacionGeografica}</span>
                      </div>
                    )}
                    {row.ubicacionInstitucional?.replace(/-/g, '').trim() && (
                      <div className="flex items-start text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 mt-[3px] shrink-0 text-gray-400">
                          <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
                          <path d="M9 22v-4h6v4"></path>
                          <path d="M8 6h.01"></path>
                          <path d="M16 6h.01"></path>
                          <path d="M12 6h.01"></path>
                          <path d="M12 10h.01"></path>
                          <path d="M12 14h.01"></path>
                          <path d="M16 10h.01"></path>
                          <path d="M16 14h.01"></path>
                          <path d="M8 10h.01"></path>
                          <path d="M8 14h.01"></path>
                        </svg>
                        <span className="whitespace-pre-line">{row.ubicacionInstitucional}</span>
                      </div>
                    )}
                    {row.totalHojaCoca && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full
                        bg-green-100 text-green-700 border border-green-200
                        dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        🌿 {row.totalHojaCoca} kg
                      </span>
                    )}
                  </div>
                </td>

                {/* ── Coca ──────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.totalHojaCoca}
                    colorClase="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                  />
                </td>

                {/* ── Drogas Decomisadas ──────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.drogasDecomisadas}
                    colorClase="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                  />
                </td>

                {/* ── Sustancias Precursoras Sólidas ──────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.sustanciasSolidas}
                    colorClase="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                  />
                </td>

                {/* ── Sustancias Precursoras Líquidas ─────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.sustanciasLiquidas}
                    colorClase="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                  />
                </td>

                {/* ── Laboratorios y Fábricas ─────────────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.laboratoriosFabricas}
                    colorClase="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  />
                </td>

                {/* ── Arrestados ──────────────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.arrestados}
                    colorClase="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"
                  />
                </td>

                {/* ── Personas Implicadas ─────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.personasImplicadas}
                    colorClase="bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
                  />
                </td>

                {/* ── Bienes Incautados ───────────────────────────────── */}
                <td className={TD}>
                  <CeldaPills
                    campo={row.bienesIncautados}
                    colorClase="bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800"
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
