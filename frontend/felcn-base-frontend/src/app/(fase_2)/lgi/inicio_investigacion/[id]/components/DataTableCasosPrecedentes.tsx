'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconTrash from '@/components/Icon/IconTrash'
import { AlertDialog } from '@/components/modales/AlertDialog'

import { PresedenciaApi } from '../../api/presedencia.api'
import { formatFecha } from '../../../utils/fechas'

type Props = {
  casosId: string
}

type CasoPrecedenteDisplay = {
  preseId: string
  nrocasopre: string
  nombreCaso: string
  fechaOperativo: string
  lugarOperativo: string
  unidad: string
  nroInforme: string
}

export function DataTableCasosPrecedentes({ casosId }: Props) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [nroCasoPre, setNroCasoPre] = useState('')
  const [registrando, setRegistrando] = useState(false)
  const [casoAEliminar, setCasoAEliminar] =
    useState<CasoPrecedenteDisplay | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['lgi-casos-precedentes', casosId, page, limit],
    enabled: Boolean(casosId),
    queryFn: () =>
      PresedenciaApi.listarPorCaso(casosId, { pagina: page, limite: limit }),
  })

  const rows: CasoPrecedenteDisplay[] = (data?.filas ?? []).map((row) => {
    const operativo = row.operativosSiii?.[0]
    return {
      preseId: row.preseId,
      nrocasopre: row.nrocasopre,
      nombreCaso: operativo?.nombreCaso ?? '-',
      fechaOperativo: operativo?.fechaOperativo ?? '-',
      lugarOperativo: operativo?.ubicacionGeografica ?? '-',
      unidad: operativo?.ubicacionInstitucional ?? '-',
      nroInforme: operativo?.numeroInforme ?? '-',
    }
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['lgi-casos-precedentes', casosId] })

  const handleRegistrar = async () => {
    const numero = nroCasoPre.trim()
    if (!numero) return
    setRegistrando(true)
    try {
      await PresedenciaApi.registrar(casosId, numero)
      setNroCasoPre('')
      setIsDialogOpen(false)
      invalidate()
    } finally {
      setRegistrando(false)
    }
  }

  const handleEliminar = async () => {
    if (!casoAEliminar) return
    setEliminando(true)
    try {
      await PresedenciaApi.eliminar(casoAEliminar.preseId)
      setCasoAEliminar(null)
      invalidate()
    } finally {
      setEliminando(false)
    }
  }

  const columns: Column<CasoPrecedenteDisplay>[] = [
    { accessor: 'nrocasopre', title: 'Nro caso precedente' },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del Caso',
      render: (row) => <span className="font-medium">{row.nombreCaso}</span>,
    },
    {
      accessor: 'fechaOperativo',
      title: 'Fecha operativo',
      render: (row) => formatFecha(row.fechaOperativo, 'dd/MM/yyyy'),
    },
    { accessor: 'lugarOperativo', title: 'Lugar operativo' },
    { accessor: 'unidad', title: 'Unidad' },
    { accessor: 'nroInforme', title: 'Nro informe' },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) => (
        <Button
          type="button"
          variant="outline-danger"
          size="sm"
          className="!p-1.5"
          title="Eliminar caso precedente"
          onClick={() => setCasoAEliminar(row)}
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <>
      <VristoDataTable<CasoPrecedenteDisplay>
        title="Casos precedentes"
        rows={rows}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        columns={columns}
        loading={isLoading || isFetching}
        extraButtons={
          <Button
            type="button"
            variant="primary"
            className="btn-sm m-1"
            onClick={() => {
              setNroCasoPre('')
              setIsDialogOpen(true)
            }}
          >
            Agregar caso precedente
          </Button>
        }
      />

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="panel w-full max-w-md p-0 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#e0e6ed] px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Agregar caso precedente
              </h3>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setIsDialogOpen(false)}
              >
                Cerrar
              </Button>
            </div>
            <div className="p-5">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Nro caso precedente
              </label>
              <Input
                value={nroCasoPre}
                onChange={(e) => setNroCasoPre(e.target.value)}
                placeholder="EJ. LP-LB-2/26"
              />
              <p className="mt-2 text-xs text-gray-500">
                Se buscará el caso precedente en el SIII y se vinculará a este
                caso.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e0e6ed] px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                disabled={registrando}
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                loading={registrando}
                disabled={!nroCasoPre.trim()}
                onClick={handleRegistrar}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        isOpen={!!casoAEliminar}
        titulo="Eliminar caso precedente"
        texto={`¿Seguro que desea eliminar el caso precedente "${casoAEliminar?.nrocasopre}"?`}
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
          onClick={handleEliminar}
        >
          Eliminar
        </Button>
      </AlertDialog>
    </>
  )
}