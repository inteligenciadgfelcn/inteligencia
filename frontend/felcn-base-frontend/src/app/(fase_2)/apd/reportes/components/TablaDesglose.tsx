'use client'

import { useEffect, useMemo, useState } from 'react'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { exportToCSV, exportToExcel, exportToPrint } from '@/utils/tableExport'

interface Props<T> {
  title: string
  subtitle?: string
  filename: string
  rows: T[]
  columns: Column<T>[]
  exportColumns?: (keyof T)[]
  exportHeaders?: string[]
  emptyMessage?: string
  precio?: 'unidad' | 'costo'
}

const LIMITE_INICIAL = 10

export function TablaDesglose<T extends Record<string, any>>({
  title,
  subtitle,
  filename,
  rows,
  columns,
  exportColumns,
  exportHeaders,
}: Props<T>) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(LIMITE_INICIAL)

  useEffect(() => {
    setPage(1)
  }, [rows])

  const total = rows.length

  const filasPagina = useMemo(() => {
    const desde = (page - 1) * limit
    return rows.slice(desde, desde + limit)
  }, [rows, page, limit])

  const headers = exportHeaders ?? columns.map((c) => c.title)
  const cols = exportColumns ?? columns.filter((c) => typeof c.accessor === 'string').map((c) => c.accessor as keyof T)

  return (
    <div className="panel h-full">
      <div className="mb-4">
        <h5 className="text-base font-semibold text-dark dark:text-white-light">{title}</h5>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <VristoDataTable
        rows={filasPagina}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        columns={columns}
        onExportCSV={() => exportToCSV(rows, headers, cols, filename)}
        onExportExcel={() => exportToExcel(rows, headers, cols, filename)}
        onExportPrint={() => exportToPrint(rows, headers, cols, `${title} - ${filename}`)}
      />
    </div>
  )
}