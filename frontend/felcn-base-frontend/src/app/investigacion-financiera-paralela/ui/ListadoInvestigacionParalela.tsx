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
  const [resultado, setResultado] = useState<boolean>(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['investigacion-paralela-listado', abreviaturaUnidad, resultado],
    queryFn: () =>
      InvestigacionParalelaService.buscarPorUnidadYResultado(
        abreviaturaUnidad || '',
        resultado,
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
      title: 'Resultado',
      render: (row) => (
        <span
          className={`badge ${
            row.resultado ? 'badge-outline-success' : 'badge-outline-warning'
          }`}
        >
          {row.resultado ? 'Positivo' : 'En proceso'}
        </span>
      ),
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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={!resultado ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setResultado(false)}
          >
            En Proceso
          </Button>
          <Button
            variant={resultado ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => setResultado(true)}
          >
            Finalizados
          </Button>
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
