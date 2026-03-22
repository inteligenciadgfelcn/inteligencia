'use client'

import React from 'react'
import { DataTableSortStatus } from 'mantine-datatable'

import IconFile from '@/components/Icon/IconFile'
import IconPrinter from '@/components/Icon/IconPrinter'

/* TIPOS */

export interface Column<T> {
  accessor: string | keyof T
  title: string
  render?: (row: T) => React.ReactNode
  sortable?: boolean
}

interface Props<T> {
  title?: string
  titleBreadcrumb?: string

  rows: T[]
  total: number

  page: number
  limit: number

  onPageChange: (p: number) => void
  onLimitChange: (l: number) => void

  search: string
  onSearchChange: (v: string) => void

  onExportCSV?: () => void
  onExportExcel?: () => void
  onExportPrint?: () => void

  extraButtons?: React.ReactNode

  columns: Column<T>[]
  loading?: boolean
  rowClassName?: (row: T) => string

  sortStatus?: DataTableSortStatus
  onSortStatusChange?: (v: DataTableSortStatus) => void
}

/* COMPONENTE */

export function VristoDataTable<T>({
  title,
  titleBreadcrumb,
  rows,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  search,
  onSearchChange,
  onExportCSV,
  onExportExcel,
  onExportPrint,
  columns,
  loading,
  extraButtons,
  rowClassName,
  sortStatus,
  onSortStatusChange,
}: Props<T>) {
  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      {/* HEADER */}
      {title && (
        <div className="panel flex items-center p-3 text-primary mb-3">
          <span className="text-lg font-semibold">{title}</span>
        </div>
      )}

      <div className="panel mt-3">
        {titleBreadcrumb && (
          <button className="mb-4 bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
            {titleBreadcrumb}
          </button>
        )}
        {/* TOOLBAR */}
        <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center">
            {onExportCSV && (
              <button
                type="button"
                className="btn btn-primary btn-sm m-1"
                onClick={onExportCSV}
              >
                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                CSV
              </button>
            )}

            {onExportExcel && (
              <button
                type="button"
                className="btn btn-primary btn-sm m-1"
                onClick={onExportExcel}
              >
                <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                EXCEL
              </button>
            )}

            {onExportPrint && (
              <button
                type="button"
                className="btn btn-primary btn-sm m-1"
                onClick={onExportPrint}
              >
                <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                PRINT
              </button>
            )}

            {extraButtons}
          </div>

          <input
            type="text"
            className="form-input w-auto"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value)
              onPageChange(1)
            }}
          />
        </div>

        {/* TABLA */}
        <div className="table-responsive">
          <table className="table-hover whitespace-nowrap">
            <thead>
              <tr>
                {columns.map((c) => {
                  const active = sortStatus?.columnAccessor === c.accessor

                  return (
                    <th
                      key={String(c.accessor)}
                      onClick={() =>
                        c.sortable &&
                        onSortStatusChange &&
                        onSortStatusChange({
                          columnAccessor: c.accessor as string,
                          direction:
                            active && sortStatus?.direction === 'asc'
                              ? 'desc'
                              : 'asc',
                        })
                      }
                      className={c.sortable ? 'cursor-pointer select-none' : ''}
                    >
                      <div className="flex items-center gap-1">
                        {c.title}

                        {c.sortable && (
                          <span className="text-xs">
                            {active
                              ? sortStatus?.direction === 'asc'
                                ? '▲'
                                : '▼'
                              : '⇅'}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length}>Cargando...</td>
                </tr>
              )}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length}>Sin registros</td>
                </tr>
              )}

              {!loading &&
                rows.map((row, i) => (
                  <tr key={i} className={rowClassName?.(row) ?? ''}>
                    {columns.map((c) => (
                      <td key={String(c.accessor)}>
                        {c.render
                          ? c.render(row)
                          : String((row as any)[c.accessor] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PAGINADOR */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span>
              Mostrando del {(page - 1) * limit + 1} al{' '}
              {Math.min(page * limit, total)} de {total}
            </span>

            <select
              className="form-select w-20"
              value={limit}
              onChange={(e) => {
                onLimitChange(Number(e.target.value))
                onPageChange(1)
              }}
            >
              {[10, 20, 30, 50].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <ul className="inline-flex items-center gap-1">
            <li>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-gray-600 hover:bg-primary hover:text-white disabled:opacity-50"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
              >
                ‹
              </button>
            </li>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1

              return (
                <li key={p}>
                  <button
                    className={`flex h-9 w-9 items-center justify-center rounded-full
                    ${
                      page === p
                        ? 'bg-primary text-white'
                        : 'bg-[#f3f4f6] text-gray-600 hover:bg-primary hover:text-white'
                    }`}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                </li>
              )
            })}

            <li>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f4f6] text-gray-600 hover:bg-primary hover:text-white disabled:opacity-50"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                ›
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
