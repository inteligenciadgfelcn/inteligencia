'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { InvestigacionService } from '@/services/investigacion/InvestigacionService'
import type { CasoParaleloItem } from '@/services/investigacion/InvestigacionService'
import { useAuth } from '@/context/AuthProvider'
import dayjs from 'dayjs'
import { Icono } from '@/components/Icono'

type TabKey = 'en-analisis' | 'judicializados' | 'desestimados'

const TAB_CONFIG: Record<TabKey, { label: string; icon: string }> = {
  'en-analisis': { label: 'En Análisis', icon: 'search' },
  judicializados: { label: 'Judicializados', icon: 'gavel' },
  desestimados: { label: 'Desestimados', icon: 'cancel' },
}

const ESTADO_BADGE: Record<string, string> = {
  'SIN RESPUESTA': 'badge-outline-warning',
  JUDICIALIZADO: 'badge-outline-success',
  DESESTIMADO: 'badge-outline-danger',
}

const columns: Column<CasoParaleloItem>[] = [
  {
    accessor: 'estado',
    title: 'Estado',
    render: (row) => (
      <span className={`badge ${ESTADO_BADGE[row.estado] ?? 'badge-outline-secondary'}`}>
        {row.estado}
      </span>
    ),
  },
  {
    accessor: 'departamento',
    title: 'Departamento',
  },
  {
    accessor: 'unidad',
    title: 'Unidad',
  },
  {
    accessor: 'distrital',
    title: 'Distrital',
  },
  {
    accessor: 'grupo',
    title: 'Grupo',
  },
  {
    accessor: 'delito',
    title: 'Delito',
  },
  {
    accessor: 'numeroCaso',
    title: 'Nro. de Caso',
    sortable: true,
    render: (row) => <span className="font-semibold">{row.numeroCaso}</span>,
  },
  {
    accessor: 'asignadoCaso',
    title: 'Investigador Asignado',
  },
  {
    accessor: 'fiscalAsignadoCaso',
    title: 'Fiscal Asignado',
  },
  {
    accessor: 'delitoPrecedente',
    title: 'Delito Precedente',
    render: (row) =>
      row.delitoPrecedente ? (
        <span className="line-clamp-2 max-w-xs text-xs">{row.delitoPrecedente}</span>
      ) : (
        '-'
      ),
  },
  {
    accessor: 'informe',
    title: 'Informe de Inv. Paralela',
    render: (row) =>
      row.informe ? (
        <span className="line-clamp-2 max-w-xs text-xs">{row.informe}</span>
      ) : (
        '-'
      ),
  },
  {
    accessor: 'fechaEnvio',
    title: 'Fecha de Envío',
    render: (row) =>
      row.fechaEnvio ? dayjs(row.fechaEnvio).format('DD/MM/YYYY') : '-',
  },
  {
    accessor: 'fechaRespuesta',
    title: 'Fecha Respuesta',
    render: (row) =>
      row.fechaRespuesta ? dayjs(row.fechaRespuesta).format('DD/MM/YYYY') : '-',
  },
]

export function ListadoCasosParalelos() {
  const { abreviaturaUnidad } = useAuth()
  const [activeTab, setActiveTab] = useState<TabKey>('en-analisis')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const queryFnMap: Record<TabKey, () => Promise<any>> = {
    'en-analisis': () =>
      InvestigacionService.listarEnAnalisis(abreviaturaUnidad ?? '', page, limit),
    judicializados: () =>
      InvestigacionService.listarJudicializados(abreviaturaUnidad ?? '', page, limit),
    desestimados: () =>
      InvestigacionService.listarDesestimados(abreviaturaUnidad ?? '', page, limit),
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['casos-paralelos', activeTab, abreviaturaUnidad, page, limit],
    queryFn: queryFnMap[activeTab],
    enabled: !!abreviaturaUnidad,
  })

  const filas: CasoParaleloItem[] = data?.datos?.filas ?? []
  const total: number = data?.datos?.page?.totalElements ?? 0

  return (
    <div className="panel p-0 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
        <div className="flex overflow-x-auto">
          {(Object.keys(TAB_CONFIG) as TabKey[]).map((key) => {
            const active = activeTab === key
            return (
              <button
                key={key}
                type="button"
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold border-b-2 transition-all ${active
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                onClick={() => {
                  setActiveTab(key)
                  setPage(1)
                }}
              >
                <Icono className={`w-4 h-4 ${active ? 'text-primary' : ''}`}>
                  {TAB_CONFIG[key].icon}
                </Icono>
                {TAB_CONFIG[key].label}
              </button>
            )
          })}
        </div>
        <div className="px-4">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => void refetch()}
            className="h-9"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="p-4">
        <VristoDataTable
          rows={filas}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          columns={columns}
          loading={isLoading}
        />
      </div>
    </div>
  )
}
