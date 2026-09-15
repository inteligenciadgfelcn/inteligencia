'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import IconTrash from '@/components/Icon/IconTrash'
import IconEye from '@/components/Icon/IconEye'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { LogotiposService } from '@/services/operativos'
import type { LogotipoResponse } from '@/services/operativos'
import { useConfirmDialog, useParametricas } from '@/hooks'
import { LoadingDialog } from '@/components/modales/LoadingDialog'

// ── DropzoneFoto ─────────────────────────────────────────────────────────────
function DropzoneFoto({
  label,
  archivo,
  onChange,
  error,
}: {
  label: string
  archivo: File | null
  onChange: (file: File | null) => void
  error?: boolean
}) {
  const [arrastrar, setArrastrar] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setArrastrar(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) onChange(file)
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${arrastrar
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : error
              ? 'border-danger bg-danger/5'
              : 'border-[#e0e6ed] hover:border-green-400 dark:border-[#1b2e4b] dark:hover:border-green-600'
          }`}
        onDragOver={(e) => {
          e.preventDefault()
          setArrastrar(true)
        }}
        onDragEnter={() => setArrastrar(true)}
        onDragLeave={() => setArrastrar(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {archivo ? (
          <div
            className="flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="truncate text-xs text-gray-600 dark:text-gray-400">
              {archivo.name}
            </span>
            <button
              type="button"
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = ''
                onChange(null)
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto mb-2 h-7 w-7 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="text-xs">
              <span className="font-medium text-green-600">
                Sube un archivo
              </span>
              <span className="text-gray-500"> o arrastra y suelta</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}

// ── ImagenAutenticada ────────────────────────────────────────────────────────
function ImagenAutenticada({
  path,
  alt,
  onClick,
}: {
  path: string
  alt: string
  onClick: (src: string) => void
}) {
  const [src, setSrc] = useState<string | null>(null)
  const [cargandoFoto, setCargandoFoto] = useState(true)

  useEffect(() => {
    let objectUrl: string
    LogotiposService.obtenerFoto(path)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      })
      .catch(() => setSrc(null))
      .finally(() => setCargandoFoto(false))
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [path])

  if (cargandoFoto) {
    return (
      <div className="h-24 w-32 mx-auto animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    )
  }
  if (!src) {
    return (
      <div className="flex h-24 w-32 mx-auto items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <span className="text-[10px] font-medium text-gray-400">Sin foto</span>
      </div>
    )
  }
  return (
    <div className="flex h-24 w-32 mx-auto items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 shadow-md hover:scale-105 transition-transform">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full max-w-full cursor-zoom-in object-contain"
        onClick={() => onClick(src)}
      />
    </div>
  )
}

const ITEMS_POR_PAGINA = 10

interface Props {
  titulo: string
  idoperativo: number
}

export function Logotipos({ titulo, idoperativo }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { paises, tiposDroga, cargarPaises, cargarTiposDroga } =
    useParametricas()

  useEffect(() => {
    cargarPaises()
    cargarTiposDroga()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [imagen, setImagen] = useState('')
  const [descripcionLogo, setDescripcionLogo] = useState('')
  const [idTipoDroga, setIdTipoDroga] = useState('')
  const [idPaisOrigen, setIdPaisOrigen] = useState('')
  const [idPaisDestino, setIdPaisDestino] = useState('')
  const [organizacion, setOrganizacion] = useState('')
  const [blanco, setBlanco] = useState('')
  const [observacion, setObservacion] = useState('')
  const [fotografia, setFotografia] = useState<File | null>(null)
  const [dropzoneToken, setDropzoneToken] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const [cargando, setCargando] = useState(false)
  const [items, setItems] = useState<LogotipoResponse[]>([])
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)
  const [observacionDetalle, setObservacionDetalle] = useState<string | null>(
    null
  )

  const cargar = useCallback(
    async (pag: number = 1) => {
      if (!idoperativo) return
      setCargando(true)
      try {
        const res = await LogotiposService.listar(
          idoperativo,
          pag,
          ITEMS_POR_PAGINA
        )
        if (res?.finalizado) {
          setItems(res.datos?.filas ?? [])
          setTotalRegistros(res.datos?.page?.totalElements ?? 0)
        }
      } finally {
        setCargando(false)
      }
    },
    [idoperativo]
  )

  useEffect(() => {
    void cargar(1)
  }, [cargar])

  const resetForm = () => {
    setImagen('')
    setDescripcionLogo('')
    setIdTipoDroga('')
    setIdPaisOrigen('')
    setIdPaisDestino('')
    setOrganizacion('')
    setBlanco('')
    setObservacion('')
    setFotografia(null)
    setDropzoneToken((t) => t + 1)
    setSubmitted(false)
  }

  const handleGuardar = async () => {
    setSubmitted(true)
    if (
      !imagen ||
      !descripcionLogo ||
      !idTipoDroga ||
      !idPaisOrigen ||
      !idPaisDestino ||
      !organizacion ||
      !blanco ||
      !fotografia ||
      !observacion
    ) {
      return
    }

    setCargando(true)
    try {
      const res = await LogotiposService.crear(idoperativo, {
        imagen: imagen.trim(),
        descripcionLogo: descripcionLogo.trim(),
        idTipoDroga: Number(idTipoDroga),
        idPaisOrigen: Number(idPaisOrigen),
        idPaisDestino: Number(idPaisDestino),
        organizacion: organizacion.trim(),
        blanco: blanco.trim() || undefined,
        observacion: observacion.trim() || undefined,
        fotografia: fotografia ?? undefined,
      })
      if (res?.finalizado) {
        await cargar(1)
        setPagina(1)
        resetForm()
      }
    } finally {
      setCargando(false)
    }
  }

  const handleEliminar = async (id: number) => {
    confirm({
      texto: '¿Está seguro de eliminar este logotipo?',
      onConfirm: async () => {
        setCargando(true)
        try {
          await LogotiposService.eliminar(idoperativo, id)
          await cargar(pagina)
        } finally {
          setCargando(false)
        }
      },
    })
  }

  const handleCambioPagina = (nuevaPagina: number) => {
    setPagina(nuevaPagina)
    void cargar(nuevaPagina)
  }

  return (
    <div>
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <h4 className="mb-4 text-sm font-semibold">{titulo}</h4>

        {/* Formulario */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Imagen <span className="text-danger">*</span>
            </label>
            <Input
              type="text"
              uppercase
              className={`w-full ${!imagen && submitted ? 'border-danger' : ''}`}
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
            />
            {!imagen && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Descripción del Logo <span className="text-danger">*</span>
            </label>
            <Input
              type="text"
              uppercase
              className={`w-full ${!descripcionLogo && submitted ? 'border-danger' : ''}`}
              value={descripcionLogo}
              onChange={(e) => setDescripcionLogo(e.target.value)}
            />
            {!descripcionLogo && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Tipo de Droga <span className="text-danger">*</span>
            </label>
            <Select
              options={tiposDroga.map((t) => ({
                value: String(t.id),
                label: t.descripcion,
              }))}
              placeholder="Seleccione un dato"
              value={idTipoDroga}
              onChange={(e) => setIdTipoDroga(e.target.value)}
              className={`w-full ${!idTipoDroga && submitted ? 'border-danger' : ''}`}
            />
            {!idTipoDroga && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              País de Origen <span className="text-danger">*</span>
            </label>
            <Select
              options={paises.map((p) => ({
                value: String(p.id),
                label: p.descripcion,
              }))}
              placeholder="Seleccione un dato"
              value={idPaisOrigen}
              onChange={(e) => setIdPaisOrigen(e.target.value)}
              className={`w-full ${!idPaisOrigen && submitted ? 'border-danger' : ''}`}
            />
            {!idPaisOrigen && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              País de Destino <span className="text-danger">*</span>
            </label>
            <Select
              options={paises.map((p) => ({
                value: String(p.id),
                label: p.descripcion,
              }))}
              placeholder="Seleccione un dato"
              value={idPaisDestino}
              onChange={(e) => setIdPaisDestino(e.target.value)}
              className={`w-full ${!idPaisDestino && submitted ? 'border-danger' : ''}`}
            />
            {!idPaisDestino && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Organización Criminal <span className="text-danger">*</span>
            </label>
            <Input
              type="text"
              uppercase
              className={`w-full ${!organizacion && submitted ? 'border-danger' : ''}`}
              value={organizacion}
              onChange={(e) => setOrganizacion(e.target.value)}
            />
            {!organizacion && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Posibles Blancos <span className="text-danger">*</span>
            </label>
            <Input
              value={blanco}
              onChange={(e) => setBlanco(e.target.value)}
              uppercase
              className={`w-full ${!blanco && submitted ? 'border-danger' : ''}`}
            />
            {!blanco && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Observación <span className="text-danger">*</span>
            </label>
            <Textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={2}
              uppercase
              className={`w-full ${!observacion && submitted ? 'border-danger' : ''}`}
            />
            {!observacion && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div className="col-span-1 lg:col-span-4">
            <DropzoneFoto
              key={`logo-foto-${dropzoneToken}`}
              label="Fotografía del Logo"
              archivo={fotografia}
              onChange={setFotografia}
              error={!fotografia && submitted}
            />
            {!fotografia && submitted && (
              <span className="text-danger text-xs mt-1">Esta fotografía es obligatoria</span>
            )}
          </div>

          <div className="col-span-1 mt-2 lg:col-span-4 flex justify-end">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={() => void handleGuardar()}
              disabled={cargando}
            >
              Guardar
            </Button>
          </div>
        </div>

        {/* Tabla */}
        <div className="mt-5">
          <div className="datatables">
            <VristoDataTable<LogotipoResponse>
              loading={cargando}
              rows={items}
              total={totalRegistros}
              page={pagina}
              limit={ITEMS_POR_PAGINA}
              onPageChange={handleCambioPagina}
              onLimitChange={() => { }}
              columns={[
                {
                  accessor: 'descripcionLogo',
                  title: 'Descripción',
                  render: (row) => String(row.descripcionLogo ?? ''),
                },
                {
                  accessor: 'descripcionTipoDroga',
                  title: 'Tipo de Droga',
                  render: (row) =>
                    row.descripcionTipoDroga ?? String(row.idTipoDroga ?? '—'),
                },
                {
                  accessor: 'descripcionPaisOrigen',
                  title: 'País de Origen',
                  render: (row) =>
                    row.descripcionPaisOrigen ?? String(row.idPaisOrigen ?? '—'),
                },
                {
                  accessor: 'descripcionPaisDestino',
                  title: 'País de Destino',
                  render: (row) =>
                    row.descripcionPaisDestino ?? String(row.idPaisDestino ?? '—'),
                },
                {
                  accessor: 'organizacion',
                  title: 'Organización',
                  render: (row) => String(row.organizacion ?? ''),
                },
                {
                  accessor: 'blanco',
                  title: 'Blancos',
                  render: (row) => String(row.blanco ?? ''),
                },
                {
                  accessor: 'urlFotografia',
                  title: 'Foto',
                  render: (row) =>
                    row.urlFotografia ? (
                      <ImagenAutenticada
                        path={row.urlFotografia}
                        alt="Logotipo"
                        onClick={setImagenAmpliada}
                      />
                    ) : (
                      <div className="flex h-24 w-32 mx-auto items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <span className="text-[10px] font-medium text-gray-400">Sin foto</span>
                      </div>
                    ),
                },
                {
                  accessor: 'actions',
                  title: '',
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-primary hover:text-primary/80"
                        title="Ver observación"
                        onClick={() => setObservacionDetalle(row.observacion ?? '')}
                      >
                        <IconEye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="text-danger hover:text-danger/80"
                        title="Eliminar"
                        disabled={cargando}
                        onClick={() => void handleEliminar(row.id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Modal de detalle de observación */}
      {observacionDetalle !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setObservacionDetalle(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl dark:bg-[#0e1726]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Observación
            </p>
            <p className="whitespace-pre-wrap text-sm">
              {observacionDetalle || 'Sin observación registrada'}
            </p>
            <Button
              type="button"
              variant="dark"
              size="sm"
              className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
              onClick={() => setObservacionDetalle(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setImagenAmpliada(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagenAmpliada}
              alt="Vista ampliada"
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            <Button
              type="button"
              variant="dark"
              size="sm"
              className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
              onClick={() => setImagenAmpliada(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
