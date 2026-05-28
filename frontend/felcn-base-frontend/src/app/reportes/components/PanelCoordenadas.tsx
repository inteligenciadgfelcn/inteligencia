'use client'

import React, { useState, useMemo } from 'react'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { CoordenadaBase } from './MapaFullModal'

export function PanelCoordenadas({ coordenadas }: { coordenadas: CoordenadaBase[] }) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  if (coordenadas.length === 0)
    return <p className="text-xs text-gray-400 dark:text-gray-600 italic py-2">Sin coordenadas GPS registradas</p>

  const totalPages = Math.max(1, Math.ceil(coordenadas.length / limit))
  const safePage = Math.min(page, totalPages)
  const pagedCoords = coordenadas.slice((safePage - 1) * limit, safePage * limit)

  const columns: Column<CoordenadaBase>[] = useMemo(() => [
    {
      accessor: 'numeroCaso',
      title: 'Nro. Caso',
      render: (row) => <span className="badge badge-outline-primary text-xs font-semibold">{row.numeroCaso || '—'}</span>
    },
    {
      accessor: 'numeroOperativo',
      title: 'Nro. Operativo',
      render: (row) => <span className="text-gray-700 dark:text-gray-300 font-medium">{row.numeroOperativo || '—'}</span>
    },
    {
      accessor: 'coordenadas',
      title: 'Coordenadas (Lat, Lng)',
      render: (row) => <span className="font-mono text-xs text-gray-600 dark:text-gray-400">{row.coordX}, {row.coordY}</span>
    },
    {
      accessor: 'ver',
      title: 'Acciones',
      className: 'text-right',
      render: (row) => (
        <a
          href={`https://maps.google.com/?q=${row.coordX},${row.coordY}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-xs font-bold"
        >
          📍 Ver ubicación
        </a>
      )
    }
  ], [])

  return (
    <div className="panel p-0 overflow-hidden border border-[#e0e6ed] dark:border-[#1b2e4b]">
      <VristoDataTable<CoordenadaBase>
        rows={pagedCoords}
        total={coordenadas.length}
        page={safePage}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        columns={columns}
      />
    </div>
  )
}
