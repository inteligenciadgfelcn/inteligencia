'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { InvestigacionParalelaService } from '@/services/operativos/InvestigacionParalelaService'
import { useAuth } from '@/context/AuthProvider'
import IconPencil from '@/components/Icon/IconPencil'
import dayjs from 'dayjs'

export function ListadoInvestigacionParalela() {
  const { abreviaturaUnidad } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'1' | '2' | '3'>('1')

  const tabConfig = {
    '1': { resultado: false, respInvParalela: undefined, label: 'Casos Paralelos en Analisis' },
    '2': { resultado: true, respInvParalela: true, label: 'Casos Paralelos Judicializados' },
    '3': { resultado: true, respInvParalela: false, label: 'Casos Paralelos Desestimados' },
  }

  const { resultado, respInvParalela } = tabConfig[activeTab]

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['investigacion-paralela-listado', abreviaturaUnidad, activeTab],
    queryFn: () =>
      InvestigacionParalelaService.buscarPorUnidadYResultado(
        abreviaturaUnidad || '',
        resultado,
        respInvParalela,
        { pagina: page, limite: limit }
      ),
    enabled: !!abreviaturaUnidad,
  })

  const [filas, total] = useMemo(() => {
    return [data?.datos?.[0] ?? [], data?.datos?.[1] ?? 0]
  }, [data])

  const columns: Column<any>[] = [
    {
      accessor: 'numeroCaso',
      title: 'Nro. Caso',
      sortable: true,
      render: (row) => <span className="font-semibold">{row.numeroCaso}</span>,
    },
    {
      accessor: 'idOperativo',
      title: 'Nro. Operativo',
      render: (row) => (
        <span className="badge badge-outline-primary">{row.idOperativo}</span>
      ),
    },
    {
      accessor: 'delito',
      title: 'Delito',
    },
    {
      accessor: 'fechaEnvioInvestigacionParalela',
      title: 'Fecha Envío',
      render: (row) =>
        dayjs(row.fechaEnvioInvestigacionParalela).format('DD/MM/YYYY'),
    },
    {
      accessor: 'resultado',
      title: 'Estado',
      render: (row) => {
        if (!row.resultado) {
          return <span className="badge badge-outline-warning">En proceso</span>
        }
        if (row.respInvParalela === '1' || row.respInvParalela === true || row.respInvParalela === 1) {
          return <span className="badge badge-outline-success">Positivo</span>
        }
        return <span className="badge badge-outline-danger">Negativo</span>
      },
    },
    {
      accessor: 'id',
      title: 'Acciones',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="text-primary hover:text-primary/70 transition-colors"
            onClick={() => alert('Editar ID: ' + row.id)}
            title="Editar"
          >
            <IconPencil className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {(Object.keys(tabConfig) as Array<keyof typeof tabConfig>).map(
            (key) => (
              <Button
                key={key}
                variant={activeTab === key ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => {
                  setActiveTab(key)
                  setPage(1)
                }}
              >
                {tabConfig[key].label}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => void refetch()}
        >
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
        search={search}
        onSearchChange={setSearch}
        columns={columns}
        loading={isLoading}
      />
    </div>
  )
}
