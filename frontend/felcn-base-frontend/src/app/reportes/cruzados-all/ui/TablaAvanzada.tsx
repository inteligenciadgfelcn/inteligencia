'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type { ResultadoAvanzado } from '@/services/reportes/CruzadosAllService'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Constantes } from '@/config/Constantes'
import IconPrinter from '@/components/Icon/IconPrinter'
import { exportToCSV, exportToExcel, exportToPrint } from '@/utils/tableExport'
import { MapaFullModal } from '../../components/MapaFullModal'
import type { CoordenadaOp } from '@/services/reportes/CuadrosService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsearItems(campo: string | null | undefined): string[] {
  if (!campo?.trim()) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

function CeldaPills({ campo, colorClase }: { campo: string | null | undefined; colorClase: string }) {
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
  const [limit, setLimit] = useState(10)
  const [activeMapModal, setActiveMapModal] = useState<'mapa' | 'calor' | null>(null)

  const coordenadas: CoordenadaOp[] = useMemo(() => {
    return rows
      .filter(r => r.coordX != null && r.coordY != null)
      .map(r => ({
        idOperativo: r.idOperativo,
        numeroCaso: r.numeroCaso,
        numeroOperativo: r.numeroOperativo,
        coordX: r.coordX as number,
        coordY: r.coordY as number,
      }))
  }, [rows])

  // Reset page when new rows arrive
  useEffect(() => {
    setPage(1)
  }, [rows])

  const totalPages = Math.max(1, Math.ceil(rows.length / limit))
  const safePage = Math.min(page, totalPages)
  const pagedRows = useMemo(() => {
    return rows.slice((safePage - 1) * limit, safePage * limit)
  }, [rows, safePage, limit])

  const hayResultados = !loading && rows.length > 0

  const columns: Column<ResultadoAvanzado>[] = useMemo(() => [
    {
      accessor: 'numeroOperativo',
      title: 'Operativo',
      className: 'sticky left-0 bg-white dark:bg-[#0e1726] z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] border-r border-[#e0e6ed] dark:border-[#191e3a] min-w-[260px] align-top',
      render: (row) => (
        <div className="space-y-1 text-xs">
          {/* Operativo + Caso */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
              {row.numeroOperativo}
            </span>
            <span className="font-semibold text-dark dark:text-white-light truncate max-w-[130px]" title={row.numeroCaso}>
              {row.numeroCaso}
            </span>
            <button
              type="button"
              className="text-success hover:text-success/75 transition-colors p-0.5 rounded hover:bg-success/5"
              onClick={() => row.numeroOperativo && window.open(`${Constantes.baseUrl}/reportes/general/pdf?numero=${encodeURIComponent(row.numeroOperativo)}`, '_blank')}
              title="Imprimir Reporte General"
            >
              <IconPrinter className="h-4 w-4" />
            </button>
          </div>

          {/* Nombre caso */}
          {row.nombreCaso && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2" title={row.nombreCaso}>
              {row.nombreCaso}
            </p>
          )}

          {/* Fecha */}
          <p className="text-[10px] text-gray-400">{row.fechaOperativo}</p>

          {/* Ubicación geográfica */}
          {row.ubicacionGeografica && (
            <div className="flex items-start text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              <svg className="mr-1 mt-[2px] shrink-0 text-gray-400 w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span>{row.ubicacionGeografica}</span>
            </div>
          )}

          {/* Unidad */}
          {row.ubicacionInstitucional?.replace(/-/g, '').trim() && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-1" title={row.ubicacionInstitucional}>
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

          {/* Tipo / Relevancia */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {row.tipoOperativo && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {row.tipoOperativo}
              </span>
            )}
            {row.tipoRelevancia && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                {row.tipoRelevancia}
              </span>
            )}
          </div>

          {/* Indicadores booleanos */}
          {/* <div className="flex flex-wrap gap-1 pt-0.5">
            <BadgeBool valor={!!row.esPositivo}    etiqueta="Positivo" />
            <BadgeBool valor={!!row.esAprehendido} etiqueta="Aprehendido" />
            <BadgeBool valor={!!row.esArrestado}   etiqueta="Arrestado" />
            <BadgeBool valor={!!row.esIcia}        etiqueta="ICIA" />
            <BadgeBool valor={!!row.esParteDiario} etiqueta="P.Diario" />
            <BadgeBool valor={!!row.esRevisado}    etiqueta="Revisado" />
          </div> */}
        </div>
      )
    },
    {
      accessor: 'personasImplicadas',
      title: 'Personas Implicadas',
      className: 'align-top min-w-[240px]',
      render: (row) => (
        <CeldaPills
          campo={row.personasImplicadas}
          colorClase="bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
        />
      )
    },
    {
      accessor: 'drogas',
      title: 'Drogas',
      className: 'align-top min-w-[280px]',
      render: (row) => (
        <CeldaPills
          campo={row.drogas}
          colorClase="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
        />
      )
    },
    {
      accessor: 'sustanciasSolidas',
      title: 'Sust. Sólidas',
      className: 'align-top min-w-[200px]',
      render: (row) => (
        <CeldaPills
          campo={row.sustanciasSolidas}
          colorClase="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
        />
      )
    },
    {
      accessor: 'sustanciasLiquidas',
      title: 'Sust. Líquidas',
      className: 'align-top min-w-[200px]',
      render: (row) => (
        <CeldaPills
          campo={row.sustanciasLiquidas}
          colorClase="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        />
      )
    },
    {
      accessor: 'laboratoriosFabricas',
      title: 'Laboratorios',
      className: 'align-top min-w-[160px]',
      render: (row) => (
        <CeldaPills
          campo={row.laboratoriosFabricas}
          colorClase="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        />
      )
    },
    {
      accessor: 'bienesIncautados',
      title: 'Bienes Incautados',
      className: 'align-top min-w-[180px]',
      render: (row) => (
        <CeldaPills
          campo={row.bienesIncautados}
          colorClase="bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800"
        />
      )
    },
    {
      accessor: 'totalCosto',
      title: 'Costo Total',
      className: 'align-top min-w-[110px]',
      render: (row) => (
        row.totalCosto && row.totalCosto !== '0'
          ? <span className="font-semibold text-green-700 dark:text-green-400">Bs {row.totalCosto}</span>
          : <span className="text-gray-300 dark:text-gray-700">—</span>
      )
    }
  ], [])

  return (
    <div className="space-y-3">
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

      {/* Tabla paginada y Botones de Mapa */}
      {hayResultados && (
        <>
          <div className="flex items-center justify-end mb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMapModal('mapa')}
                className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                title="Abrir mapa de distribución en ventana emergente (Popup)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                  <line x1="9" x2="9" y1="3" y2="18"></line>
                  <line x1="15" x2="15" y1="6" y2="21"></line>
                </svg>
                Ver Mapa
              </button>
              <button
                type="button"
                onClick={() => setActiveMapModal('calor')}
                className="px-3 py-1.5 bg-[#805dca]/10 hover:bg-[#805dca]/20 text-[#805dca] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                title="Abrir mapa de calor en ventana emergente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                </svg>
                Mapa de Calor
              </button>
            </div>
          </div>

          <div className="panel p-0 overflow-hidden border border-[#e0e6ed] dark:border-[#1b2e4b]">
            <VristoDataTable<ResultadoAvanzado>
              rows={pagedRows}
              total={rows.length}
              page={safePage}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(l) => {
                setLimit(l)
                setPage(1)
              }}
              columns={columns}
              loading={loading}
              onExportCSV={() => exportToCSV(rows, EXPORT_HEADERS, EXPORT_KEYS, 'operativos-avanzado')}
              onExportExcel={() => exportToExcel(rows, EXPORT_HEADERS, EXPORT_KEYS, 'operativos-avanzado')}
            // onExportPrint={() => exportToPrint(rows, EXPORT_HEADERS, EXPORT_KEYS, 'Búsqueda Avanzada de Operativos')}
            />
          </div>
        </>
      )}

      {/* Modal de Mapa */}
      {activeMapModal && (
        <MapaFullModal
          tipo={activeMapModal}
          coordenadas={coordenadas}
          onClose={() => setActiveMapModal(null)}
        />
      )}
    </div>
  )
}
