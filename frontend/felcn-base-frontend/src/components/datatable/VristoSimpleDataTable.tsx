'use client'

import React from 'react'

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

  extraButtons?: React.ReactNode

  columns: Column<T>[]
  loading?: boolean
  rowClassName?: (row: T) => string
}

/* COMPONENTE */
export function VristoSimpleDataTable<T>({
  title,
  titleBreadcrumb,
  rows,
  columns,
  loading,
  extraButtons,
  rowClassName,
}: Props<T>) {
  return (
    <div>
      {/* HEADER */}
      {title && (
        <div className="panel flex items-center p-3 text-primary mb-5">
          <span className="text-lg font-semibold">{title}</span>
        </div>
      )}

      {titleBreadcrumb && (
        <button className="mb-4 bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
          {titleBreadcrumb}
        </button>
      )}
      {/* TOOLBAR */}
      <div className="mb-4.5 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center">{extraButtons}</div>
      </div>

      {/* TABLA */}
      <div className="table-responsive">
        <table className="table-hover whitespace-nowrap">
          <thead>
            <tr>
              {columns.map((c) => {
                return (
                  <th
                    key={String(c.accessor)}
                    className={c.sortable ? 'cursor-pointer select-none' : ''}
                  >
                    <div className="flex items-center gap-1">{c.title}</div>
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
    </div>
  )
}
