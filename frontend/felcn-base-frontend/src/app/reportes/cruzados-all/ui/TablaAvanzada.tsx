'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type { ResultadoAvanzado } from '@/services/reportes/CruzadosAllService'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Constantes } from '@/config/Constantes'
import IconPrinter from '@/components/Icon/IconPrinter'
import IconEye from '@/components/Icon/IconEye'
import IconFile from '@/components/Icon/IconFile'
import { exportToCSV, exportToExcel, exportToPrint } from '@/utils/tableExport'
import { MapaFullModal } from '../../components/MapaFullModal'
import type { CoordenadaOp } from '@/services/reportes/CuadrosService'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { ReportesOperativoService } from '@/services/reportes/ReportesOperativoService'
import type { PreviewOperativoData } from '@/services/reportes/ReportesOperativoService'
import { VistaPreviaOperativo } from '../../components/VistaPreviaOperativo'
import { descargarArchivoAutenticado } from '@/utils/peticion'
import { OperativoCardAvanzado } from './OperativoCardAvanzado'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parsearItems(campo: string | null | undefined): string[] {
  if (!campo?.trim()) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

function CeldaPills({ campo }: { campo: string | null | undefined }) {
  const items = parsearItems(campo)
  if (!items.length) return <span className="text-gray-300 dark:text-gray-700 select-none text-xs">—</span>
  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <span key={i} className="text-xs leading-relaxed whitespace-pre-wrap text-left text-gray-700 dark:text-gray-300">
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

// ─── Paginación (vista de tarjetas) ──────────────────────────────────────────

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
      <span className="text-gray-500 dark:text-gray-400">
        Mostrando{' '}
        <strong className="text-dark dark:text-white-light">{desde}</strong>–
        <strong className="text-dark dark:text-white-light">{hasta}</strong>{' '}
        de{' '}
        <strong className="text-dark dark:text-white-light">{total}</strong>{' '}
        resultado{total !== 1 ? 's' : ''}
      </span>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onPage(1)}
          disabled={page === 1}
          className={`${btnBase} ${page === 1 ? btnDisabled : btnNormal}`}
          title="Primera página"
        >
          «
        </button>
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

        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} ${page === totalPages ? btnDisabled : btnNormal}`}
          title="Página siguiente"
        >
          ›
        </button>
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

      <select
        value={limit}
        onChange={e => { onLimit(Number(e.target.value)); onPage(1) }}
        className="form-select text-xs py-1 px-2 h-7 w-auto rounded border-[#e0e6ed] dark:border-[#1b2e4b]
          bg-white dark:bg-[#1b2e4b] text-gray-700 dark:text-gray-300"
      >
        {[10, 20, 30, 50].map(l => (
          <option key={l} value={l}>{l} / pág.</option>
        ))}
      </select>
    </div>
  )
}

// ─── Componente principal exportado ──────────────────────────────────────────

type Vista = 'tabla' | 'tarjetas'

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
  const { Alerta } = useAlerts()
  const [vista, setVista] = useState<Vista>('tabla')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [activeMapModal, setActiveMapModal] = useState<'mapa' | 'calor' | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewOperativoData | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const abrirPreview = async (numeroOperativo: string) => {
    setPreviewData(null)
    setPreviewUrl(`${Constantes.baseUrl}/reportes/general/pdf?numero=${encodeURIComponent(numeroOperativo)}`)
    setModalOpen(true)
    try {
      const res = await ReportesOperativoService.verPreviewGeneral(numeroOperativo)
      if (res?.finalizado) setPreviewData(res.datos)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      setModalOpen(false)
    }
  }

  const descargarPdfGeneral = async (numeroOperativo: string) => {
    try {
      await descargarArchivoAutenticado(
        `${Constantes.baseUrl}/reportes/general/pdf?numero=${encodeURIComponent(numeroOperativo)}`,
        `reporte-general-${numeroOperativo}.pdf`,
      )
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    }
  }

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

  // Reset page when new rows arrive or view changes
  useEffect(() => {
    setPage(1)
  }, [rows])
  useEffect(() => {
    setPage(1)
  }, [vista])

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
              className="text-info hover:text-info/75 transition-colors p-0.5 rounded hover:bg-info/5"
              onClick={() => row.numeroOperativo && void abrirPreview(row.numeroOperativo)}
              title="Vista Previa del Reporte General"
            >
              <IconEye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="text-success hover:text-success/75 transition-colors p-0.5 rounded hover:bg-success/5"
              onClick={() => row.numeroOperativo && void descargarPdfGeneral(row.numeroOperativo)}
              title="Descargar PDF Reporte General"
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
          <div className="flex flex-wrap gap-2 pt-0.5 text-[9px] text-gray-500 dark:text-gray-400">
            {row.tipoOperativo && <span>{row.tipoOperativo}</span>}
            {row.tipoRelevancia && <span>{row.tipoRelevancia}</span>}
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
    <>
      <VistaPreviaOperativo
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={previewData}
        tipo="general"
        urlPdf={previewUrl}
      />
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

      {/* Tabla/Tarjetas paginada y Botones de Mapa */}
      {hayResultados && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            {/* Botones de exportación (vista de tarjetas) */}
            <div className="flex items-center gap-1">
              {vista === 'tarjetas' && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm flex items-center gap-1"
                    onClick={() => exportToCSV(rows, EXPORT_HEADERS, EXPORT_KEYS, 'operativos-avanzado')}
                  >
                    <IconFile className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm flex items-center gap-1"
                    onClick={() => exportToExcel(rows, EXPORT_HEADERS, EXPORT_KEYS, 'operativos-avanzado')}
                  >
                    <IconFile className="w-4 h-4" />
                    EXCEL
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm flex items-center gap-1"
                    onClick={() => exportToPrint(rows, EXPORT_HEADERS, EXPORT_KEYS, 'Búsqueda Avanzada de Operativos')}
                  >
                    <IconPrinter className="w-4 h-4" />
                    PRINT
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Selector de vista (tabla / tarjetas) */}
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

          {vista === 'tabla' && (
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
          )}

          {vista === 'tarjetas' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pagedRows.map((row, idx) => (
                  <OperativoCardAvanzado key={`${row.idOperativo}-${idx}`} row={row} />
                ))}
              </div>
              <PaginacionBar
                total={rows.length}
                page={safePage}
                limit={limit}
                onPage={setPage}
                onLimit={setLimit}
              />
            </>
          )}
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
    </>
  )
}
