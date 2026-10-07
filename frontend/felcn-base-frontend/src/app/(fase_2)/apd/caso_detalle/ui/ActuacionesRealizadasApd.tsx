'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconPlus from '@/components/Icon/IconPlus'
import IconFile from '@/components/Icon/IconFile'
import IconDownload from '@/components/Icon/IconDownload'
import IconUsers from '@/components/Icon/IconUsers'
import IconCashBanknotes from '@/components/Icon/IconCashBanknotes'

import { Constantes } from '@/config/Constantes'
import { abrirPdfEnNuevaPestana } from '@/utils/peticion'
import { ActuacionesApi } from '../api/actuaciones-apd.api'
import type { ActuacionRow, TipoInforme } from '../types/actuaciones-apd.types'
import type { MenuOption } from './MenuVerticalApd'
import { formatFecha } from '../../utils/fechas-apd'

type Props = {
  casoId: number
  onSelect?: (option: MenuOption) => void
}

function DetalleCampo({
  label,
  value,
  full,
}: {
  label: string
  value: string | null | undefined
  full?: boolean
}) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm text-dark dark:text-white-light">
        {value || '-'}
      </p>
    </div>
  )
}

export function ActuacionesRealizadas({ casoId, onSelect }: Props) {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [modalOpen, setModalOpen] = useState(false)
  const [detalleModal, setDetalleModal] = useState<ActuacionRow | null>(null)

  const [nroInforme, setNroInforme] = useState('')
  const [tipoInformeId, setTipoInformeId] = useState<string>('')
  const [opLugar, setOpLugar] = useState('')
  const [sintesis, setSintesis] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [guardando, setGuardando] = useState(false)

  const { data: actuacionesData, isLoading } = useQuery({
    queryKey: ['lgi-actuaciones', casoId, page, limit],
    enabled: Boolean(casoId),
    queryFn: () =>
      ActuacionesApi.listarActuaciones(casoId, { pagina: page, limite: limit }),
  })

  const { data: tiposInforme = [] } = useQuery<TipoInforme[]>({
    queryKey: ['lgi-actuaciones', 'tipos-informe'],
    queryFn: () => ActuacionesApi.listarTiposInforme(),
  })

  const abrirModal = () => {
    setNroInforme('')
    setTipoInformeId('')
    setOpLugar('')
    setSintesis('')
    setArchivo(null)
    setModalOpen(true)
  }

  const onSubmit = async () => {
    if (!nroInforme || !tipoInformeId || !opLugar || !sintesis || !archivo)
      return

    setGuardando(true)
    try {
      await ActuacionesApi.crearActuacion({
        casosId: casoId,
        opNrooper: nroInforme,
        idTipoInforme: Number(tipoInformeId),
        opLugar,
        opDescripcion: sintesis,
        archivo,
      })
      setModalOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['lgi-actuaciones', casoId],
      })
    } finally {
      setGuardando(false)
    }
  }

  const abrirArchivo = (ruta: string) => {
    const url = ruta.startsWith('http')
      ? ruta
      : `${Constantes.baseUrl.replace('/api', '')}/${ruta}`
    window.open(url, '_blank')
  }

  const columns: Column<ActuacionRow>[] = [
    {
      accessor: 'opNrooper',
      title: 'Nro Informe',
      render: (row) => (
        <button
          type="button"
          className="text-primary underline hover:text-primary/80"
          onClick={() => setDetalleModal(row)}
        >
          {row.opNrooper}
        </button>
      ),
    },
    {
      accessor: 'opFechainf',
      title: 'Fecha informe',
      render: (row) => formatFecha(row.opFechainf, 'dd/MM/yyyy'),
    },
    {
      accessor: 'idTipoInforme',
      title: 'Tipo informe',
      render: (row) =>
        tiposInforme.find((t) => t.id === row.idTipoInforme)?.descripcion ??
        String(row.idTipoInforme),
    },
    {
      accessor: 'opLugar',
      title: 'Lugar',
      render: (row) => row.opLugar || '-',
    },
    {
      accessor: 'rutaArchivo',
      title: 'Archivo',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.rutaArchivo ? (
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              className="!p-1.5"
              title="Ver archivo"
              onClick={() => abrirArchivo(row.rutaArchivo!)}
            >
              <IconDownload className="h-4 w-4" />
            </Button>
          ) : (
            '-'
          )}
          <Button
            type="button"
            variant="outline-primary"
            size="sm"
            className="!p-1.5"
            title="Ver reporte PDF"
            onClick={() => {
              void abrirPdfEnNuevaPestana(() =>
                ActuacionesApi.exportarActuacionPdf(Number(row.opId))
              )
            }}
          >
            <IconFile className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const isFormValid =
    nroInforme &&
    tipoInformeId &&
    opLugar &&
    sintesis &&
    archivo

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h6 className="text-sm font-semibold text-dark dark:text-white-light">
            Actuaciones realizadas
          </h6>
          <p className="text-xs text-gray-500">
            Historial de actuaciones del caso.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          className="gap-2"
          onClick={abrirModal}
        >
          <IconPlus className="h-4 w-4" />
          Nueva actuación
        </Button>
      </div>

      <VristoDataTable<ActuacionRow>
        title="Actuaciones"
        rows={actuacionesData?.filas ?? []}
        total={actuacionesData?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        columns={columns}
        loading={isLoading}
      />

      {detalleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Detalle de Actuación
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setDetalleModal(null)}
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetalleCampo
                  label="Nro Informe"
                  value={detalleModal.opNrooper}
                />
                <DetalleCampo
                  label="Fecha Informe"
                  value={formatFecha(detalleModal.opFechainf)}
                />
                <DetalleCampo
                  label="Tipo Informe"
                  value={
                    tiposInforme.find(
                      (t) => t.id === detalleModal.idTipoInforme
                    )?.descripcion ?? String(detalleModal.idTipoInforme)
                  }
                />
                <DetalleCampo label="Estado" value={detalleModal.estado} />
                <DetalleCampo label="Lugar" value={detalleModal.opLugar} />
                <DetalleCampo
                  label="Fecha Ingreso"
                  value={formatFecha(detalleModal.fechaHoraIng)}
                />
                <DetalleCampo label="Usuario" value={detalleModal.usuario} />
                <DetalleCampo
                  label="Usuario Actualización"
                  value={detalleModal.usuarioActualizacion}
                />
                <DetalleCampo
                  label="Fecha Actualización"
                  value={formatFecha(detalleModal.fechaActualizacion)}
                />
                <div className="md:col-span-2">
                  <DetalleCampo
                    label="Síntesis"
                    value={detalleModal.opDescripcion}
                    full
                  />
                </div>
              </div>
              {detalleModal.rutaArchivo && (
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    className="gap-2"
                    onClick={() => abrirArchivo(detalleModal.rutaArchivo!)}
                  >
                    <IconDownload className="h-4 w-4" />
                    Ver documento adjunto
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setDetalleModal(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Nueva actuación
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Nro Informe
                  </label>
                  <Input
                    value={nroInforme}
                    onChange={(e) => setNroInforme(e.target.value)}
                    placeholder="INF-001-2026"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Tipo de informe
                  </label>
                  <Select
                    options={tiposInforme.map((t) => ({
                      value: String(t.id),
                      label: t.descripcion,
                    }))}
                    placeholder="Seleccione tipo"
                    value={tipoInformeId}
                    onChange={(e) => setTipoInformeId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Lugar
                  </label>
                  <Input
                    value={opLugar}
                    onChange={(e) => setOpLugar(e.target.value)}
                    placeholder="Lugar del operativo"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Síntesis del informe
                  </label>
                  <textarea
                    className="form-textarea w-full"
                    rows={3}
                    value={sintesis}
                    onChange={(e) => setSintesis(e.target.value)}
                    placeholder="Descripción detallada de la actuación..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Documento de respaldo (PDF, DOC o DOCX, max 10MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="file-actuacion"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file && file.size > 10 * 1024 * 1024) {
                          alert('El archivo no debe superar 10MB')
                          return
                        }
                        setArchivo(file ?? null)
                      }}
                    />
                    <label
                      htmlFor="file-actuacion"
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-primary hover:bg-primary/5 dark:border-[#1b2e4b] dark:text-gray-400"
                    >
                      <IconFile className="h-4 w-4" />
                      {archivo ? archivo.name : 'Seleccionar archivo...'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <Button
                type="button"
                variant="outline-secondary"
                disabled={guardando}
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                loading={guardando}
                disabled={!isFormValid}
                onClick={onSubmit}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
