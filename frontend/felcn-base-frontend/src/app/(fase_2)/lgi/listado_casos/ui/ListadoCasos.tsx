'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { AlertDialog } from '@/components/modales/AlertDialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconEdit from '@/components/Icon/IconEdit'
import IconEye from '@/components/Icon/IconEye'
import IconPlus from '@/components/Icon/IconPlus'
import IconSearch from '@/components/Icon/IconSearch'
import IconTrash from '@/components/Icon/IconTrash'

import { ListadoCasosApi } from '../api/listado-casos.api'
import {
  formatFecha,
  mapAsignacionCasoRow,
} from '../mappers/listado-casos.mappers'
import type { AsignacionCasoListadoRow } from '../types/listado-casos.types'
import { guardarCasoEnStorage } from '../../registro_caso/utils/registro-caso.utils'

export function ListadoCasos() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [filtro, setFiltro] = useState('')
  const [filtroAplicado, setFiltroAplicado] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [casoAEliminar, setCasoAEliminar] =
    useState<AsignacionCasoListadoRow | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['lgi-listado-casos', page, limit, filtroAplicado],
    queryFn: () =>
      ListadoCasosApi.listarCasos({
        pagina: page,
        limite: limit,
        filtro: filtroAplicado || undefined,
      }),
  })

  const rows = useMemo(
    () => (data?.filas ?? []).map(mapAsignacionCasoRow),
    [data]
  )

  const irA = (row: AsignacionCasoListadoRow, modo?: 'ver') => {
    guardarCasoEnStorage(row)
    router.push(`/lgi/registro_caso/${row.casosId}${modo ? '?modo=ver' : ''}`)
  }

  const confirmarEliminar = async () => {
    if (!casoAEliminar) return
    setEliminando(true)
    try {
      await ListadoCasosApi.eliminarCaso(casoAEliminar.casosId)
      setCasoAEliminar(null)
      queryClient.invalidateQueries({ queryKey: ['lgi-listado-casos'] })
    } finally {
      setEliminando(false)
    }
  }

  const columns: Column<AsignacionCasoListadoRow>[] = [
    {
      accessor: 'casosId',
      title: 'ID',
      sortable: true,
    },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del caso',
      render: (row) => <span className="font-medium">{row.nombreCaso}</span>,
    },
    { accessor: 'nroCaso', title: 'Nro Caso FELCN' },
    { accessor: 'nroCasoGiaef', title: 'Nro Caso GIAEF' },
    { accessor: 'nroCasoFis', title: 'Nro Caso FIS' },
    { accessor: 'cudIfp', title: 'CUD/IFP' },
    { accessor: 'remiteFiscal', title: 'Fiscal que remite' },
    { accessor: 'regional', title: 'Regional' },
    { accessor: 'etapaInvestigacion', title: 'Etapa investigación' },
    {
      accessor: 'remiteFecha',
      title: 'Fecha remisión',
      render: (row) => formatFecha(row.remiteFecha),
    },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="!p-1.5"
            aria-label={`Ver detalle de ${row.nombreCaso}`}
            title="Ver detalle"
            onClick={() => irA(row, 'ver')}
          >
            <IconEye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="!p-1.5"
            aria-label={`Editar ${row.nombreCaso}`}
            title="Editar"
            onClick={() => irA(row)}
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            className="!p-1.5"
            aria-label={`Eliminar ${row.nombreCaso}`}
            title="Eliminar"
            onClick={() => setCasoAEliminar(row)}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-dark dark:text-white-light">
              Listado de casos LGI
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Casos registrados en el módulo LGI.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="gap-2"
            onClick={() => router.push('/lgi/registro_caso')}
          >
            <IconPlus className="h-4 w-4" />
            Registrar caso
          </Button>
        </div>
      </div>

      <div className="panel space-y-5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-md">
            <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
              Buscar caso
            </label>
            <div className="flex gap-3">
              <Input
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Nombre, nro caso, GIAEF, FIS, CUD/IFP..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setFiltroAplicado(filtro)
                    setPage(1)
                  }
                }}
              />
              <Button
                type="button"
                variant="primary"
                className="gap-2"
                onClick={() => {
                  setFiltroAplicado(filtro)
                  setPage(1)
                }}
              >
                <IconSearch className="h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              setFiltro('')
              setFiltroAplicado('')
              setPage(1)
            }}
          >
            Limpiar filtros
          </Button>
        </div>

        <VristoDataTable<AsignacionCasoListadoRow>
          title="Listado de casos"
          rows={rows}
          total={data?.total ?? 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          columns={columns}
          loading={isLoading || isFetching}
        />
      </div>

      <AlertDialog
        isOpen={!!casoAEliminar}
        titulo="Eliminar caso"
        texto={`¿Seguro que desea eliminar el caso "${casoAEliminar?.nombreCaso}"? Esta acción no se puede deshacer.`}
      >
        <Button
          type="button"
          variant="outline-secondary"
          disabled={eliminando}
          onClick={() => setCasoAEliminar(null)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          loading={eliminando}
          onClick={confirmarEliminar}
        >
          Eliminar
        </Button>
      </AlertDialog>
    </div>
  )
}
