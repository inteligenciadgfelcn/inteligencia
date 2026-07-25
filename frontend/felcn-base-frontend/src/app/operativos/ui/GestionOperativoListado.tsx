'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { VristoDataTable, Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CustomDialog } from '@/components/modales/CustomDialog'
import { OperativoService } from '@/services/operativos'
import IconPencil from '@/components/Icon/IconPencil'
import IconPrinter from '@/components/Icon/IconPrinter'
import IconEye from '@/components/Icon/IconEye'
import IconSend from '@/components/Icon/IconSend'
import { useAuth } from '@/context/AuthProvider'
import { useAlerts } from '@/hooks/useAlerts'
import { InterpreteMensajes } from '@/utils'
import { sesionPeticion } from '@/utils/peticion'
import type { GestionOperativoItem } from '../types'
import { Constantes } from '@/config/Constantes'
import { ReportesOperativoService } from '@/services/reportes/ReportesOperativoService'
import type { PreviewOperativoData } from '@/services/reportes/ReportesOperativoService'
import { VistaPreviaOperativo } from '@/app/reportes/components/VistaPreviaOperativo'

export interface GestionOperativoListadoProps {
  tipo?: 'aprobado' | 'no-aprobado' | 'con-cud' | 'todos' | 'impresion' | 'envio-fiscalia'
}

export function GestionOperativoListado({
  tipo = 'no-aprobado',
}: GestionOperativoListadoProps) {
  const router = useRouter()
  const { usuario } = useAuth()
  const { Alerta } = useAlerts()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  // ── Modal vista previa ─────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewOperativoData | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // ── Modal "Enviar a Fiscalía" (registrar CUD / ianus) ──────────────────────
  const [fiscaliaModalOpen, setFiscaliaModalOpen] = useState(false)
  const [casoFiscalia, setCasoFiscalia] = useState<GestionOperativoItem | null>(null)
  const [cudInput, setCudInput] = useState('')
  const [enviandoFiscalia, setEnviandoFiscalia] = useState(false)

  const abrirModalFiscalia = (row: GestionOperativoItem) => {
    setCasoFiscalia(row)
    setCudInput(row.ianus ?? '')
    setFiscaliaModalOpen(true)
  }

  const cerrarModalFiscalia = () => {
    if (enviandoFiscalia) return
    setFiscaliaModalOpen(false)
    setCasoFiscalia(null)
    setCudInput('')
  }

  const confirmarEnvioFiscalia = async () => {
    if (!casoFiscalia?.idCaso || !cudInput.trim()) return
    setEnviandoFiscalia(true)
    try {
      await OperativoService.actualizarIanus(String(casoFiscalia.idCaso), cudInput.trim())
      Alerta({ mensaje: 'CUD registrado correctamente', variant: 'success' })
      setFiscaliaModalOpen(false)
      setCasoFiscalia(null)
      setCudInput('')
      void refetch()
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setEnviandoFiscalia(false)
    }
  }

  const descargarPdfDirecto = async (numeroOperativo: string) => {
    try {
      const url = `${Constantes.baseUrl}/reportes/operativo/pdf?numero=${encodeURIComponent(numeroOperativo)}`
      const blob = await sesionPeticion<Blob>({ url, responseType: 'blob' })
      const objectUrl = URL.createObjectURL(blob)
      const enlace = document.createElement('a')
      enlace.href = objectUrl
      enlace.download = `formulario-operativo-${numeroOperativo}.pdf`
      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    }
  }

  const abrirPreview = async (numeroOperativo: string) => {
    setPreviewData(null)
    setPreviewUrl(`${Constantes.baseUrl}/reportes/operativo/pdf?numero=${encodeURIComponent(numeroOperativo)}`)
    setModalOpen(true)
    try {
      const res = await ReportesOperativoService.verPreviewOperativo(numeroOperativo)
      if (res?.finalizado) setPreviewData(res.datos)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      setModalOpen(false)
    }
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['gestion-operativo-listado', tipo],
    queryFn: () => {
      if (tipo === 'aprobado' || tipo === 'impresion' || tipo === 'envio-fiscalia')
        return OperativoService.listarAprobadosPorUsuario()
      if (tipo === 'con-cud') return OperativoService.listarConCudPorUsuario()
      if (tipo === 'todos') return OperativoService.listarPorUsuario()
      return OperativoService.listarNoAprobadosPorUsuario()
    },
    enabled: !!usuario,
  })

  const filas: GestionOperativoItem[] = useMemo(() => {
    const datos = data?.datos ?? []
    if (tipo === 'envio-fiscalia') return datos.filter((f) => !f.ianus?.trim())
    return datos
  }, [data, tipo])

  const filasFiltradas = useMemo(() => {
    if (!search.trim()) return filas
    const q = search.toLowerCase()
    return filas.filter(
      (f) =>
        f.nombreCaso?.toLowerCase().includes(q) ||
        f.numeroOperativo?.toLowerCase().includes(q) ||
        f.numeroCaso?.toLowerCase().includes(q) ||
        f.asignadoCaso?.toLowerCase().includes(q) ||
        f.fiscalAsignadoCaso?.toLowerCase().includes(q) ||
        f.unidadDescripcion?.toLowerCase().includes(q) ||
        f.ianus?.toLowerCase().includes(q)
    )
  }, [filas, search])

  const total = filasFiltradas.length
  const filasPagina = filasFiltradas.slice((page - 1) * limit, page * limit)

  const columns: Column<GestionOperativoItem>[] = useMemo(() => {
    const cols: Column<GestionOperativoItem>[] = [
      {
        accessor: 'numeroOperativo',
        title: 'Nro. Operativo',
        sortable: true,
        render: (row) => (
          <span className="badge badge-outline-primary text-xs font-semibold">
            {row.numeroOperativo || '-'}
          </span>
        ),
      },
      {
        accessor: 'numeroCaso',
        title: 'Nro. Caso',
        sortable: true,
        render: (row) => (
          <span className="text-sm font-medium text-dark dark:text-white">
            {row.numeroCaso?.trim() || '-'}
          </span>
        ),
      },
    ]

    if (tipo === 'con-cud' || tipo === 'envio-fiscalia') {
      cols.push({
        accessor: 'ianus',
        title: 'CUD',
        sortable: true,
        render: (row) => (
          row.ianus ? (
            <span className="text-sm font-semibold text-primary">{row.ianus}</span>
          ) : (
            <span className="badge badge-outline-warning text-xs">Sin registrar</span>
          )
        ),
      })
    }

    cols.push(
      {
        accessor: 'nombreCaso',
        title: 'Nombre del Caso',
        sortable: true,
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {row.nombreCaso?.trim() || '-'}
          </span>
        ),
      },
      {
        accessor: 'unidadDescripcion',
        title: 'Unidad',
        render: (row) => (
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {row.unidadDescripcion || '-'}
          </span>
        ),
      },
      {
        accessor: 'distritaleDescripcion',
        title: 'Distrital',
        render: (row) => (
          <span className="badge badge-outline-secondary text-xs">
            {row.distritaleDescripcion || '-'}
          </span>
        ),
      },
      {
        accessor: 'grupoDescripcion',
        title: 'Grupo',
        render: (row) => (
          <span className="text-xs text-gray-400">
            {row.grupoDescripcion || '-'}
          </span>
        ),
      },
      {
        accessor: 'asignadoCaso',
        title: 'Asignado al Caso',
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.asignadoCaso?.trim() || '-'}
          </span>
        ),
      },
      {
        accessor: 'fiscalAsignadoCaso',
        title: 'Fiscal Asignado',
        render: (row) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row.fiscalAsignadoCaso?.trim() || '-'}
          </span>
        ),
      },
      {
        accessor: 'idCaso',
        title: 'Acciones',
        className:
          'sticky right-0 bg-white dark:bg-[#0e1726] z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] border-l border-white-light dark:border-[#191e3a]',
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            {tipo === 'no-aprobado' && (
              <button
                type="button"
                className="text-primary hover:text-primary/70 transition-colors"
                onClick={() =>
                  router.push(
                    `/operativos/registro?id=${row.idCaso}`
                  )
                }
                title="Ver / Editar"
              >
                <IconPencil className="h-5 w-5" />
              </button>
            )}
            {(tipo === 'aprobado' ||
              tipo === 'con-cud' ||
              tipo === 'todos' ||
              tipo === 'impresion') && (
                <>
                  <button
                    type="button"
                    className="text-info hover:text-info/70 transition-colors"
                    onClick={() => row.numeroOperativo && void abrirPreview(row.numeroOperativo)}
                    title="Vista Previa del Reporte"
                  >
                    <IconEye className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="text-success hover:text-success/70 transition-colors"
                    onClick={() => row.numeroOperativo && void descargarPdfDirecto(row.numeroOperativo)}
                    title="Descargar PDF"
                  >
                    <IconPrinter className="h-5 w-5" />
                  </button>
                </>
              )}
            {(tipo === 'aprobado' || tipo === 'envio-fiscalia') && (
              <button
                type="button"
                className="text-info hover:text-info/70 transition-colors"
                onClick={() => abrirModalFiscalia(row)}
                title="Enviar a Fiscalía"
              >
                <IconSend className="h-5 w-5" />
              </button>
            )}
          </div>
        ),
      },
    )

    return cols
  }, [tipo])

  return (
    <div className="space-y-4">
      <VistaPreviaOperativo
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={previewData}
        tipo="operativo"
        urlPdf={previewUrl}
      />
      <CustomDialog
        isOpen={fiscaliaModalOpen}
        handleClose={cerrarModalFiscalia}
        title="Enviar a Fiscalía"
        maxWidth="sm"
      >
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Registre el CUD asignado por Fiscalía para el caso{' '}
            <span className="font-semibold">{casoFiscalia?.numeroCaso || casoFiscalia?.nombreCaso}</span>.
          </p>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
              CUD
            </label>
            <Input
              autoFocus
              value={cudInput}
              onChange={(e) => setCudInput(e.target.value)}
              maxLength={15}
              placeholder="Ingrese el CUD"
              disabled={enviandoFiscalia}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              onClick={cerrarModalFiscalia}
              disabled={enviandoFiscalia}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="info"
              size="sm"
              onClick={() => void confirmarEnvioFiscalia()}
              disabled={enviandoFiscalia || !cudInput.trim()}
              loading={enviandoFiscalia}
            >
              Enviar a Fiscalía
            </Button>
          </div>
        </div>
      </CustomDialog>
      <div className="panel p-0">
        <VristoDataTable<GestionOperativoItem>
          rows={filasPagina}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l)
            setPage(1)
          }}
          search={search}
          onSearchChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          columns={columns}
          loading={isLoading}
          extraButtons={
            <Button
              variant="outline-secondary"
              size="sm"
              className="m-1"
              onClick={() => void refetch()}
            >
              Actualizar
            </Button>
          }
        />
      </div>
    </div>
  )
}
