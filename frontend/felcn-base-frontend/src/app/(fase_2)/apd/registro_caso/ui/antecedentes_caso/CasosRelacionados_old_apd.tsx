'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconTrash from '@/components/Icon/IconTrash'

import { PresedenciaApi } from '../../../inicio_investigacion/api/presedencia.api'
import type { PresedenciaCasoRow } from '../../../inicio_investigacion/api/presedencia.api'

type Props = {
  casoId?: number | null
  isLectura?: boolean
}

type CasoRelacionado = {
  id: string
  preseId: string
  nrocasopre: string
  nombreCaso: string
  fechaOperativo: string
  numeroOperativo: string
  numeroInforme: string
  ubicacionInstitucional: string
  ubicacionGeografica: string
  fiscalSolicitud: string
  asignadoFiscal: string
  tipoOperativo: string
  categoriaOperativo: string
  planOperacion: string
}

const SIN_DATO = '-'

type Mensaje = {
  tipo: 'success' | 'error'
  texto: string
}

const aFilaOperativo = (
  fila: PresedenciaCasoRow,
  operativo?: PresedenciaCasoRow['operativosSiii'][number]
): CasoRelacionado => ({
  id: `${fila.preseId}-${operativo?.idOperativo ?? 'sin-operativo'}`,
  preseId: fila.preseId,
  nrocasopre: fila.nrocasopre,
  nombreCaso: operativo?.nombreCaso || SIN_DATO,
  fechaOperativo: operativo?.fechaOperativo || SIN_DATO,
  numeroOperativo: operativo?.numeroOperativo || SIN_DATO,
  numeroInforme: operativo?.numeroInforme || SIN_DATO,
  ubicacionInstitucional: operativo?.ubicacionInstitucional || SIN_DATO,
  ubicacionGeografica: operativo?.ubicacionGeografica || SIN_DATO,
  fiscalSolicitud: operativo?.fiscalSolicitud || SIN_DATO,
  asignadoFiscal: operativo?.asignadoFiscal || SIN_DATO,
  tipoOperativo: operativo?.tipoOperativo || SIN_DATO,
  categoriaOperativo: operativo?.categoriaOperativo || SIN_DATO,
  planOperacion: operativo?.planOperacion || SIN_DATO,
})

const aplanar = (filas: PresedenciaCasoRow[]): CasoRelacionado[] =>
  filas.flatMap((fila) => {
    const operativos = fila.operativosSiii ?? []
    if (!operativos.length) return [aFilaOperativo(fila)]
    return operativos.map((operativo) => aFilaOperativo(fila, operativo))
  })

const mensajeDeError = (err: unknown): string => {
  if (err && typeof err === 'object' && 'mensaje' in err) {
    return String((err as { mensaje: unknown }).mensaje)
  }
  if (typeof err === 'string' && err) return err
  return 'Ocurrió un error inesperado'
}

export function CasosRelacionadosOld({ casoId, isLectura = false }: Props) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [casoAEliminar, setCasoAEliminar] = useState<CasoRelacionado | null>(
    null
  )
  const [eliminando, setEliminando] = useState(false)
  const [mensaje, setMensaje] = useState<Mensaje | null>(null)

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['lgi-registro-caso', 'presedencias', casoId, page, limit],
    enabled: Boolean(casoId),
    queryFn: () =>
      PresedenciaApi.listarPorCaso(casoId!, { pagina: page, limite: limit }),
  })

  const filas = aplanar(data?.filas ?? [])

  const invalidar = () =>
    queryClient.invalidateQueries({
      queryKey: ['lgi-registro-caso', 'presedencias', casoId],
    })

  const handleEliminar = async () => {
    if (!casoAEliminar) return
    setEliminando(true)
    setMensaje(null)
    try {
      await PresedenciaApi.eliminar(casoAEliminar.preseId)
      setMensaje({
        tipo: 'success',
        texto: `Se inactivó el caso precedente ${casoAEliminar.nrocasopre}.`,
      })
      setCasoAEliminar(null)
      invalidar()
    } catch (err) {
      setMensaje({ tipo: 'error', texto: mensajeDeError(err) })
    } finally {
      setEliminando(false)
    }
  }

  const columnasAcciones: Column<CasoRelacionado>[] = isLectura
    ? []
    : [
      {
        accessor: 'acciones',
        title: 'Acciones',
        render: (row) => (
          <Button
            type="button"
            variant="outline-danger"
            size="sm"
            className="!p-1.5"
            title="Inactivar caso precedente"
            onClick={() => setCasoAEliminar(row)}
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        ),
      },
    ]

  const columns: Column<CasoRelacionado>[] = [
    {
      accessor: 'nrocasopre',
      title: 'Nro caso precedente',
      render: (row) => (
        <div className="whitespace-normal space-y-0.5 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white">
            {row.nrocasopre}
          </p>
          <p className="text-xs text-gray-500">{row.nombreCaso}</p>
        </div>
      ),
    },
    {
      accessor: 'fechaOperativo',
      title: 'Fecha operativo',
      render: (row) => <span className="text-sm">{row.fechaOperativo}</span>,
    },
    {
      accessor: 'numeroOperativo',
      title: 'Nro. operativo',
      render: (row) => <span className="text-sm">{row.numeroOperativo}</span>,
    },
    {
      accessor: 'numeroInforme',
      title: 'Nro. informe',
      render: (row) => <span className="text-sm">{row.numeroInforme}</span>,
    },
    {
      accessor: 'ubicacionInstitucional',
      title: 'Ubicación',
      render: (row) => (
        <div className="whitespace-normal space-y-0.5 text-sm">
          <p className="text-gray-900 dark:text-white">
            {row.ubicacionInstitucional}
          </p>
          <p className="text-xs text-gray-500">{row.ubicacionGeografica}</p>
        </div>
      ),
    },
    {
      accessor: 'fiscalSolicitud',
      title: 'Fiscal',
      render: (row) => (
        <div className="whitespace-normal space-y-0.5 text-sm">
          <p className="text-gray-900 dark:text-white">{row.asignadoFiscal}</p>
          <p className="text-xs text-gray-500">
            Solicitud: {row.fiscalSolicitud}
          </p>
        </div>
      ),
    },
    {
      accessor: 'tipoOperativo',
      title: 'Tipo de operativo',
      render: (row) => (
        <div className="whitespace-normal space-y-0.5 text-sm">
          <p className="text-gray-900 dark:text-white">{row.tipoOperativo}</p>
          <p className="text-xs text-gray-500">{row.categoriaOperativo}</p>
          <p className="text-xs text-gray-500">{row.planOperacion}</p>
        </div>
      ),
    },
    ...columnasAcciones,
  ]

  const operativosDeLaPrecedencia = casoAEliminar
    ? filas.filter((f) => f.preseId === casoAEliminar.preseId).length
    : 0

  if (!casoId) {
    return (
      <div className="rounded-md border border-[#e0e6ed] bg-white p-4 text-sm text-gray-500 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] dark:text-gray-400">
        Registre primero los datos generales del caso para ver los casos
        relacionados.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {isError ? (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          Ocurrió un error al consultar los casos relacionados.
        </div>
      ) : null}

      {mensaje && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${mensaje.tipo === 'success'
            ? 'border-success/30 bg-success/5 text-success'
            : 'border-danger/30 bg-danger/5 text-danger'
            }`}
        >
          {mensaje.texto}
        </div>
      )}

      <VristoDataTable<CasoRelacionado>
        title="Casos relacionados"
        rows={filas}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        columns={columns}
        loading={isLoading || isFetching}
      />

      <AlertDialog
        isOpen={casoAEliminar !== null}
        titulo="Inactivar caso precedente"
        texto={
          casoAEliminar
            ? `¿Desea inactivar el caso precedente "${casoAEliminar.nrocasopre}" de este caso?${operativosDeLaPrecedencia > 1
              ? ` Se quitarán sus ${operativosDeLaPrecedencia} operativos relacionados.`
              : ''
            }`
            : ''
        }
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
          Inactivar
        </Button>
      </AlertDialog>
    </div>
  )
}
