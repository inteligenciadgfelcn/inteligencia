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

type TabKey = 'en-analisis' | 'judicializados' | 'desestimados'

const TAB_CONFIG: Record<TabKey, { label: string }> = {
  'en-analisis': { label: 'En Análisis' },
  judicializados: { label: 'Judicializados' },
  desestimados: { label: 'Desestimados' },
}

const ESTADO_BADGE: Record<string, string> = {
  'SIN RESPUESTA': 'badge-outline-warning',
  JUDICIALIZADO: 'badge-outline-success',
  DESESTIMADO: 'badge-outline-danger',
}

const columns: Column<CasoParaleloItem>[] = [
  {
    accessor: 'numeroCaso',
    title: 'Nro. Caso',
    sortable: true,
    render: (row) => <span className="font-semibold">{row.numeroCaso}</span>,
  },
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
    accessor: 'delito',
    title: 'Delito',
  },
  {
    accessor: 'asignadoCaso',
    title: 'Asignado',
  },
  {
    accessor: 'fiscalAsignadoCaso',
    title: 'Fiscal',
  },
  {
    accessor: 'fechaEnvio',
    title: 'Fecha Envío',
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {(Object.keys(TAB_CONFIG) as TabKey[]).map((key) => (
            <Button
              key={key}
              variant={activeTab === key ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => {
                setActiveTab(key)
                setPage(1)
              }}
            >
              {TAB_CONFIG[key].label}
            </Button>
          ))}
        </div>
        <Button variant="outline-secondary" size="sm" onClick={() => void refetch()}>
          Actualizar
        </Button>
      </div>

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
  )
}
