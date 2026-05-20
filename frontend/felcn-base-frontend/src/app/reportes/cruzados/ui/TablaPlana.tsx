'use client'

import React, { useMemo } from 'react'
import type { ResultadoCruzada } from '@/services/reportes/CruzadosService'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Constantes } from '@/config/Constantes'
import IconPrinter from '@/components/Icon/IconPrinter'
import { exportToCSV, exportToExcel, exportToPrint } from '@/utils/tableExport'

function parsearItems(campo: string | null | undefined): string[] {
  if (!campo?.trim()) return []
  return campo.split(' | ').map(s => s.trim()).filter(Boolean)
}

interface CeldaPillsProps {
  campo: string | null | undefined
  colorClase: string
}

function CeldaPills({ campo, colorClase }: CeldaPillsProps) {
  const items = parsearItems(campo)
  if (items.length === 0) {
    return <span className="text-gray-300 dark:text-gray-700 select-none text-xs">—</span>
  }
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, i) => (
        <span
          key={i}
          className={`inline-block text-xs font-semibold leading-relaxed px-2.5 py-0.5 rounded whitespace-pre-wrap text-left ${colorClase}`}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

interface TablaPlanaProps {
  rows: ResultadoCruzada[]
  total: number
  page: number
  limit: number
  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void
  loading?: boolean
}

export function TablaPlana({
  rows,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  loading,
}: TablaPlanaProps) {

  const columns: Column<ResultadoCruzada>[] = useMemo(() => [
    {
      accessor: 'numeroOperativo',
      title: 'Operativo',
      className: 'sticky left-0 bg-white dark:bg-[#0e1726] z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] border-r border-[#e0e6ed] dark:border-[#191e3a] min-w-[210px] align-top',
      render: (row) => (
        <div className="space-y-1 text-xs">
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
              onClick={() => {
                const num = row.numeroOperativo
                if (num) {
                  window.open(
                    `${Constantes.baseUrl}/reportes/general/${encodeURIComponent(num)}/pdf`,
                    '_blank'
                  )
                }
              }}
              title="Imprimir Reporte General"
            >
              <IconPrinter className="h-4 w-4" />
            </button>
          </div>
          {row.nombreCaso && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2" title={row.nombreCaso}>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 mt-[2px] shrink-0 text-gray-400">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="whitespace-pre-line">{row.ubicacionGeografica}</span>
            </div>
          )}
          {row.ubicacionInstitucional?.replace(/-/g, '').trim() && (
            <div className="flex items-start text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 mt-[2px] shrink-0 text-gray-400">
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
            <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full
              bg-green-100 text-green-700 border border-green-200
              dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              🌿 {row.totalHojaCoca} kg
            </span>
          )}
        </div>
      )
    },
    {
      accessor: 'totalHojaCoca',
      title: 'Coca',
      className: 'align-top min-w-[240px]',
      render: (row) => (
        <CeldaPills
          campo={row.totalHojaCoca}
          colorClase="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
        />
      )
    },
    {
      accessor: 'drogasDecomisadas',
      title: 'Drogas Decomisadas',
      className: 'align-top min-w-[240px]',
      render: (row) => (
        <CeldaPills
          campo={row.drogasDecomisadas}
          colorClase="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
        />
      )
    },
    {
      accessor: 'sustanciasSolidas',
      title: 'Sust. Precursoras Sólidas',
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
      title: 'Sust. Precursoras Líquidas',
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
      title: 'Laboratorios y Fábricas',
      className: 'align-top min-w-[180px]',
      render: (row) => (
        <CeldaPills
          campo={row.laboratoriosFabricas}
          colorClase="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        />
      )
    },
    {
      accessor: 'arrestados',
      title: 'Arrestados',
      className: 'align-top min-w-[220px]',
      render: (row) => (
        <CeldaPills
          campo={row.arrestados}
          colorClase="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"
        />
      )
    },
    {
      accessor: 'personasImplicadas',
      title: 'Personas Implicadas',
      className: 'align-top min-w-[220px]',
      render: (row) => (
        <CeldaPills
          campo={row.personasImplicadas}
          colorClase="bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
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
    }
  ], [])

  const handleExportCSV = () => {
    const headers = ['Operativo', 'Caso', 'Fecha', 'Ubicación', 'Coca', 'Drogas', 'Precursores Sólidos', 'Precursores Líquidos', 'Laboratorios', 'Arrestados', 'Personas Implicadas', 'Bienes']
    const keys: (keyof ResultadoCruzada)[] = [
      'numeroOperativo', 
      'numeroCaso', 
      'fechaOperativo', 
      'ubicacionGeografica', 
      'totalHojaCoca', 
      'drogasDecomisadas', 
      'sustanciasSolidas', 
      'sustanciasLiquidas', 
      'laboratoriosFabricas', 
      'arrestados', 
      'personasImplicadas', 
      'bienesIncautados'
    ]
    exportToCSV(rows, headers, keys, 'cruzados')
  }

  const handleExportExcel = () => {
    const headers = ['Operativo', 'Caso', 'Fecha', 'Ubicación', 'Coca', 'Drogas', 'Precursores Sólidos', 'Precursores Líquidos', 'Laboratorios', 'Arrestados', 'Personas Implicadas', 'Bienes']
    const keys: (keyof ResultadoCruzada)[] = [
      'numeroOperativo', 
      'numeroCaso', 
      'fechaOperativo', 
      'ubicacionGeografica', 
      'totalHojaCoca', 
      'drogasDecomisadas', 
      'sustanciasSolidas', 
      'sustanciasLiquidas', 
      'laboratoriosFabricas', 
      'arrestados', 
      'personasImplicadas', 
      'bienesIncautados'
    ]
    exportToExcel(rows, headers, keys, 'cruzados')
  }

  const handleExportPrint = () => {
    const headers = ['Operativo', 'Caso', 'Fecha', 'Ubicación', 'Coca', 'Drogas', 'Precursores Sólidos', 'Precursores Líquidos', 'Laboratorios', 'Arrestados', 'Personas Implicadas', 'Bienes']
    const keys: (keyof ResultadoCruzada)[] = [
      'numeroOperativo', 
      'numeroCaso', 
      'fechaOperativo', 
      'ubicacionGeografica', 
      'totalHojaCoca', 
      'drogasDecomisadas', 
      'sustanciasSolidas', 
      'sustanciasLiquidas', 
      'laboratoriosFabricas', 
      'arrestados', 
      'personasImplicadas', 
      'bienesIncautados'
    ]
    exportToPrint(rows, headers, keys, 'Búsqueda Cruzada')
  }

  return (
    <VristoDataTable<ResultadoCruzada>
      rows={rows}
      total={total}
      page={page}
      limit={limit}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      columns={columns}
      loading={loading}
      onExportCSV={handleExportCSV}
      onExportExcel={handleExportExcel}
      onExportPrint={handleExportPrint}
    />
  )
}
