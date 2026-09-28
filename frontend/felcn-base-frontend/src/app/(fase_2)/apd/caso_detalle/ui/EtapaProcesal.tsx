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

import { EtapaProcesalApi } from '../api/etapa-procesal.api'
import type {
  EstadoEtapa,
  EtapaCatalogo,
  EtapaProcesalRow,
} from '../types/etapa-procesal.types'

type Props = {
  casoId: number
  isLectura?: boolean
}

export function EtapaProcesal({ casoId, isLectura = false }: Props) {
  const queryClient = useQueryClient()

  const [modalOpen, setModalOpen] = useState(false)
  const [etapaId, setEtapaId] = useState('')
  const [idEstado, setIdEstado] = useState('')
  const [fechaRecepcion, setFechaRecepcion] = useState('')
  const [diasOtorgados, setDiasOtorgados] = useState('')
  const [descripcionDocumento, setDescripcionDocumento] = useState('')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [guardando, setGuardando] = useState(false)

  const { data: etapas = [] } = useQuery<EtapaCatalogo[]>({
    queryKey: ['apd-etapa-procesal', 'etapas'],
    queryFn: () => EtapaProcesalApi.listarEtapas(),
  })

  const { data: estadosEtapa = [] } = useQuery<EstadoEtapa[]>({
    queryKey: ['apd-etapa-procesal', 'estados', etapaId],
    enabled: Boolean(etapaId),
    queryFn: () => EtapaProcesalApi.listarEstadosEtapa(Number(etapaId)),
  })

  const { data: historial = [], isLoading } = useQuery<EtapaProcesalRow[]>({
    queryKey: ['apd-etapa-procesal', 'historial', casoId],
    enabled: Boolean(casoId),
    queryFn: () => EtapaProcesalApi.listarEtapasCaso(casoId),
  })

  const abrirModal = () => {
    setEtapaId('')
    setIdEstado('')
    setFechaRecepcion('')
    setDiasOtorgados('')
    setDescripcionDocumento('')
    setArchivo(null)
    setModalOpen(true)
  }

  const isFormValid =
    etapaId && fechaRecepcion && diasOtorgados && (!archivo || descripcionDocumento)

  const onSubmit = async () => {
    if (!etapaId || !fechaRecepcion || !diasOtorgados) return
    setGuardando(true)
    try {
      await EtapaProcesalApi.registrarEtapa(
        casoId,
        {
          etapaId: Number(etapaId),
          idEstado: idEstado ? Number(idEstado) : undefined,
          fechaRecepcionFiscalia: fechaRecepcion,
          diasOtorgados: Number(diasOtorgados),
          descripcionDocumento: descripcionDocumento || undefined,
        },
        archivo ?? undefined
      )
      setModalOpen(false)
      queryClient.invalidateQueries({
        queryKey: ['apd-etapa-procesal', 'historial', casoId],
      })
    } finally {
      setGuardando(false)
    }
  }

  const abrirDocumento = (row: EtapaProcesalRow) => {
    if (row.dataUrl) {
      window.open(row.dataUrl, '_blank')
    }
  }

  const columns: Column<EtapaProcesalRow>[] = [
    {
      accessor: 'docCasoId',
      title: 'ID documento',
      sortable: true,
    },
    {
      accessor: 'descripcion',
      title: 'Descripción',
      render: (row) => <span className="font-medium">{row.descripcion}</span>,
    },
    { accessor: 'nombreArchivo', title: 'Archivo' },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) =>
        row.dataUrl ? (
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="!p-1.5"
            title="Ver documento"
            onClick={() => abrirDocumento(row)}
          >
            <IconDownload className="h-4 w-4" />
          </Button>
        ) : (
          '-'
        ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h6 className="text-sm font-semibold text-dark dark:text-white-light">
            Etapa procesal del caso
          </h6>
          <p className="text-xs text-gray-500">
            Registre la etapa procesal y adjunte la resolución (PDF).
          </p>
        </div>
        {!isLectura && (
          <Button
            type="button"
            variant="primary"
            className="gap-2"
            onClick={abrirModal}
          >
            <IconPlus className="h-4 w-4" />
            Registrar etapa procesal
          </Button>
        )}
      </div>

      <VristoDataTable<EtapaProcesalRow>
        title="Documentos de la etapa procesal"
        rows={historial}
        total={historial.length}
        page={1}
        limit={10}
        onPageChange={() => undefined}
        onLimitChange={() => undefined}
        columns={columns}
        loading={isLoading}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
              <h3 className="text-lg font-bold text-dark dark:text-white-light">
                Registrar etapa procesal
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
                    Etapa
                  </label>
                  <Select
                    options={etapas.map((e) => ({
                      value: String(e.etId),
                      label: e.descripcion,
                    }))}
                    placeholder="Seleccione etapa"
                    value={etapaId}
                    onChange={(e) => {
                      setEtapaId(e.target.value)
                      setIdEstado('')
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Estado del caso (opcional)
                  </label>
                  <Select
                    options={estadosEtapa.map((d) => ({
                      value: String(d.estId),
                      label: d.descripcion,
                    }))}
                    placeholder="Seleccione estado"
                    value={idEstado}
                    disabled={!etapaId}
                    onChange={(e) => setIdEstado(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Fecha recepción fiscalía
                  </label>
                  <Input
                    type="date"
                    value={fechaRecepcion}
                    onChange={(e) => setFechaRecepcion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Días otorgados
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={diasOtorgados}
                    onChange={(e) => setDiasOtorgados(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Descripción del documento
                  </label>
                  <Input
                    value={descripcionDocumento}
                    onChange={(e) => setDescripcionDocumento(e.target.value)}
                    placeholder="Obligatoria cuando se adjunta un PDF"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                    Documento de respaldo (PDF, max 10MB)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      id="file-etapa-procesal"
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
                      htmlFor="file-etapa-procesal"
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-primary hover:bg-primary/5 dark:border-[#1b2e4b] dark:text-gray-400"
                    >
                      <IconFile className="h-4 w-4" />
                      {archivo ? archivo.name : 'Seleccionar archivo PDF...'}
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