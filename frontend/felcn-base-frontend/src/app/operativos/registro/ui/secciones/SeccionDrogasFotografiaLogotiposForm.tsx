'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import IconTrash from '@/components/Icon/IconTrash'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  DrogasService,
  LogotiposService,
} from '@/services/operativos'
import type {
  EstadoDroga,
  LogotipoCasoPayload,
  ResponseDroga,
} from '@/services/operativos'
import { useConfirmDialog, useParametricas } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { SiiiLookupsService } from '@/services/parametricas'

// ─── Tipos ────────────────────────────────────────────────────────────────────
type FotosCacheDroga = { pruebaCampo: string | null; pesaje: string | null }

// ─── DropzoneFoto ─────────────────────────────────────────────────────────────
function DropzoneFoto({
  label,
  archivo,
  onChange,
  error = false,
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
            ? 'border-danger bg-red-50 dark:bg-red-900/10'
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
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="ml-2"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = ''
                onChange(null)
              }}
            >
              ✕
            </Button>
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
      {error && (
        <div className="mt-1">
          <span className="text-danger text-xs block italic">Esta fotografía es obligatoria</span>
        </div>
      )}
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

// ─── FotoSlot ─────────────────────────────────────────────────────────────────
function FotoSlot({
  src,
  label,
  onZoom,
}: {
  src: string | null
  label: string
  onZoom: (src: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          className="h-40 w-full cursor-zoom-in rounded object-cover shadow-sm hover:opacity-90"
          onClick={() => onZoom(src)}
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
          <span className="text-xs text-gray-400">Sin foto</span>
        </div>
      )}
    </div>
  )
}

// ─── LogotiposPanel ───────────────────────────────────────────────────────────
function LogotiposPanel({
  idoperativo,
  idDroga,
  onZoom,
  onEliminarConfirm,
}: {
  idoperativo: number
  idDroga: number
  onZoom: (src: string) => void
  onEliminarConfirm: (texto: string, onConfirm: () => Promise<void>) => void
}) {
  const { Alerta } = useAlerts()
  const [imagen, setImagen] = useState('')
  const [descripcionLogo, setDescripcionLogo] = useState('')
  const [organizacion, setOrganizacion] = useState('')
  const [blanco, setBlanco] = useState('')
  const [observacion, setObservacion] = useState('')
  const [fotografia, setFotografia] = useState<File | null>(null)
  const [dropzoneToken, setDropzoneToken] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  // ── Thumbnail de foto con estado de carga ─────────────────────────────────
  function FotoLogotipoThumb({
    path,
    onClick,
  }: {
    path: string
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
        <div className="h-14 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      )
    }
    if (!src) {
      return (
        <div className="flex h-14 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
          <span className="text-xs text-gray-400">Sin foto</span>
        </div>
      )
    }
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt="Logotipo"
        className="h-14 w-full cursor-zoom-in rounded object-cover shadow-sm hover:opacity-90"
        onClick={() => onClick(src)}
      />
    )
  }

  const [logotiposItems, setLogotiposItems] = useState<LogotipoCasoPayload[]>(
    []
  )
  const [cargando, setCargando] = useState(false)

  const cargar = async () => {
    setCargando(true)
    try {
      const res = await LogotiposService.listar(
        idoperativo,
        idDroga
      )
      if (res?.finalizado) {
        setLogotiposItems(
          (res.datos?.filas as unknown as LogotipoCasoPayload[]) ?? []
        )
      }
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    void cargar()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setImagen('')
    setDescripcionLogo('')
    setOrganizacion('')
    setBlanco('')
    setObservacion('')
    setFotografia(null)
    setDropzoneToken((t) => t + 1)
    setSubmitted(false)
  }

  const guardar = async () => {
    setSubmitted(true)
    if (!imagen || !descripcionLogo || !organizacion || !fotografia || !blanco || !observacion) {
      return
    }

    setCargando(true)
    try {
      const res = await LogotiposService.crear(
        idoperativo,
        idDroga,
        {
          id: 0,
          imagen,
          descripcionLogo,
          organizacion,
          blanco: blanco || undefined,
          observacion: observacion || undefined,
          fotografia: fotografia ?? undefined,
        }
      )
      if (res?.finalizado) {
        await cargar()
        resetForm()
      }
    } finally {
      setCargando(false)
    }
  }

  const eliminar = async (id: number) => {
    onEliminarConfirm('¿Está seguro de eliminar este logotipo?', async () => {
      await LogotiposService.eliminar(idoperativo, idDroga, id)
      await cargar()
    })
  }

  return (
    <div className="mt-4 border-t border-[#e0e6ed] pt-4 dark:border-gray-700">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
        Logotipos
      </p>

      {/* Formulario siempre visible */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Imagen <span className="text-danger">*</span></label>
          <Input
            type="text"
            className={`w-full ${!imagen && submitted ? 'border-danger' : ''}`}
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />
          {!imagen && submitted && (
            <div className="mt-1">
              <span className="text-danger text-xs block">Este campo es obligatorio</span>
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Descripción del Logo <span className="text-danger">*</span>
          </label>
          <Input
            type="text"
            className={`w-full ${!descripcionLogo && submitted ? 'border-danger' : ''}`}
            value={descripcionLogo}
            onChange={(e) => setDescripcionLogo(e.target.value)}
          />
          {!descripcionLogo && submitted && (
            <div className="mt-1">
              <span className="text-danger text-xs block">Este campo es obligatorio</span>
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Organización Criminal <span className="text-danger">*</span>
          </label>
          <Input
            type="text"
            className={`w-full ${!organizacion && submitted ? 'border-danger' : ''}`}
            value={organizacion}
            onChange={(e) => setOrganizacion(e.target.value)}
          />
          {!organizacion && submitted && (
            <div className="mt-1">
              <span className="text-danger text-xs block">Este campo es obligatorio</span>
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Posibles Blancos <span className="text-danger">*</span>
          </label>
          <Input
            value={blanco}
            onChange={(e) => setBlanco(e.target.value)}
            className={`w-full ${!blanco && submitted ? 'border-danger' : ''}`}
          />
          {!blanco && submitted && (
            <div className="mt-1">
              <span className="text-danger text-xs block">Este campo es obligatorio</span>
            </div>
          )}
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label className="mb-1 block text-sm font-medium">Observación <span className="text-danger">*</span></label>
          <Textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            rows={2}
            className={`w-full ${!observacion && submitted ? 'border-danger' : ''}`}
          />
          {!observacion && submitted && (
            <div className="mt-1">
              <span className="text-danger text-xs block">Este campo es obligatorio</span>
            </div>
          )}
        </div>
        <div className="col-span-1 lg:col-span-3">
          <DropzoneFoto
            key={`logo-foto-${dropzoneToken}`}
            label="Fotografía del Logo"
            archivo={fotografia}
            onChange={setFotografia}
            error={!fotografia && submitted}
          />
        </div>
        <div className="col-span-1 mt-2 lg:col-span-3 flex justify-end">
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={() => void guardar()}
            disabled={cargando}
          >
            Guardar
          </Button>
        </div>
      </div>

      {/* Grilla de logotipos */}
      <div className="mt-4 datatables">
        <VristoDataTable<LogotipoCasoPayload>
          loading={cargando}
          rows={logotiposItems}
          total={logotiposItems.length}
          page={1}
          limit={logotiposItems.length || 10}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={[
            { accessor: 'id', title: '#' },
            {
              accessor: 'descripcionLogo',
              title: 'Descripción',
              render: (row) => String(row.descripcionLogo ?? ''),
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
              accessor: 'observacion',
              title: 'Observación',
              render: (row) => String(row.observacion ?? ''),
            },
            {
              accessor: 'urlFotografia',
              title: 'Foto',
              render: (row) => {
                const fotoUrl = (row as unknown as Record<string, unknown>)
                  .urlFotografia
                return typeof fotoUrl === 'string' && fotoUrl.length > 0 ? (
                  <FotoLogotipoThumb path={fotoUrl} onClick={onZoom} />
                ) : (
                  <div className="flex h-14 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                    <span className="text-xs text-gray-400">Sin foto</span>
                  </div>
                )
              },
            },
            {
              accessor: 'actions',
              title: '',
              render: (row) => (
                <button
                  type="button"
                  className="text-danger hover:text-danger/80"
                  title="Eliminar"
                  disabled={cargando}
                  onClick={() => void eliminar(row.id)}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

// ─── ExpansionContenidoDroga ──────────────────────────────────────────────────
function ExpansionContenidoDroga({
  droga,
  idoperativo,
  cache,
  onCacheLoad,
  onZoom,
  onEliminarConfirm,
}: {
  droga: ResponseDroga
  idoperativo: number
  cache: FotosCacheDroga | undefined
  onCacheLoad: (id: number, fotos: FotosCacheDroga) => void
  onZoom: (src: string) => void
  onEliminarConfirm: (texto: string, onConfirm: () => Promise<void>) => void
}) {
  useEffect(() => {
    if (cache) return
    const fetchFoto = (
      path: string | null | undefined
    ): Promise<string | null> =>
      path
        ? DrogasService.obtenerFoto(path)
          .then((blob) => URL.createObjectURL(blob))
          .catch(() => null)
        : Promise.resolve(null)

    void Promise.all([
      fetchFoto(droga.urlFotoPruebaCampo),
      fetchFoto(droga.urlFotoPesaje),
    ]).then(([pruebaCampo, pesaje]) => {
      onCacheLoad(droga.id, { pruebaCampo, pesaje })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="border-t border-[#e0e6ed] p-4 dark:border-gray-700">
      {/* Fotos */}
      {!cache ? (
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <FotoSlot
            src={cache.pruebaCampo}
            label="Prueba de Campo"
            onZoom={onZoom}
          />
          <FotoSlot
            src={cache.pesaje}
            label="Cuantificación y Pesaje"
            onZoom={onZoom}
          />
        </div>
      )}

      {/* Logotipos anidados */}
      <LogotiposPanel
        idoperativo={idoperativo}
        idDroga={droga.id}
        onZoom={onZoom}
        onEliminarConfirm={onEliminarConfirm}
      />
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const parseNumber = (valor: unknown) => {
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
  const normalizado = Number(String(valor ?? '').replace(',', '.'))
  return Number.isFinite(normalizado) ? normalizado : 0
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface SeccionFormProps {
  titulo: string
  idoperativo?: number
  // Props heredados del contrato de sección (no usados internamente)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGuardar?: (...args: any[]) => Promise<any>
  onRecuperar?: () => Promise<unknown>
  cargando?: boolean
}

const ITEMS_POR_PAGINA = 10

// ─── SeccionDrogasFotografiaLogotiposForm ─────────────────────────────────────
export function SeccionDrogasFotografiaLogotiposForm({
  titulo,
  idoperativo = 0,
}: SeccionFormProps) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  // ── Paramétricas ──────────────────────────────────────────────────────────
  const {
    paises,
    tiposDroga,
    cargarPaises,
    cargarTiposDroga,
    formasTransporte,
    cargarFormasTransporte,
  } = useParametricas()

  useEffect(() => {
    cargarPaises()
    cargarTiposDroga()
    cargarFormasTransporte()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [estadosDroga, setEstadosDroga] = useState<EstadoDroga[]>([])

  // ── Campos del formulario ─────────────────────────────────────────────────
  const [idTipoDroga, setIdTipoDroga] = useState('')
  const [idEstadoDroga, setIdEstadoDroga] = useState('')
  const [cantidadUnidades, setCantidadUnidades] = useState('1')
  const [cantidadTn, setCantidadTn] = useState('0')
  const [cantidadKg, setCantidadKg] = useState('0')
  const [cantidadG, setCantidadG] = useState('0')
  const [cantidadMg, setCantidadMg] = useState('0')
  const [costo, setCosto] = useState('0')
  const [idFormaTransporte, setIdFormaTransporte] = useState('')
  const [idPaisProcedencia, setIdPaisProcedencia] = useState('')
  const [idPaisDestino, setIdPaisDestino] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [dropzoneToken, setDropzoneToken] = useState(0)
  const [pruebaCampo, setPruebaCampo] = useState<File | null>(null)
  const [pesaje, setPesaje] = useState<File | null>(null)

  // ── Lista, paginación y estado general ────────────────────────────────────
  const [cargando, setCargando] = useState(false)
  const [drogas, setDrogas] = useState<ResponseDroga[]>([])
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([])
  const [submitted, setSubmitted] = useState(false)

  // ── Cache de fotos ────────────────────────────────────────────────────────
  const [fotosCache, setFotosCache] = useState<Record<string, FotosCacheDroga>>(
    {}
  )
  const fotosCacheRef = useRef<Record<string, FotosCacheDroga>>({})
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  const actualizarCache = useCallback((id: number, fotos: FotosCacheDroga) => {
    fotosCacheRef.current[id] = fotos
    setFotosCache((prev) => ({ ...prev, [id]: fotos }))
  }, [])

  const limpiarCache = useCallback(() => {
    Object.values(fotosCacheRef.current).forEach(
      ({ pruebaCampo, pesaje }) => {
        if (pruebaCampo) URL.revokeObjectURL(pruebaCampo)
        if (pesaje) URL.revokeObjectURL(pesaje)
      }
    )
    fotosCacheRef.current = {}
    setFotosCache({})
  }, [])

  useEffect(
    () => () => {
      limpiarCache()
    },
    [limpiarCache]
  )

  // ── Cascading: tipo → estados ─────────────────────────────────────────────
  useEffect(() => {
    if (!idTipoDroga) {
      setEstadosDroga([])
      setIdEstadoDroga('')
      return
    }
    let activo = true
    SiiiLookupsService.obtenerEstadosDroga(Number(idTipoDroga))
      .then((res) => {
        if (activo && res?.finalizado) setEstadosDroga(res.datos ?? [])
      })
      .catch(() => setEstadosDroga([]))
    return () => {
      activo = false
    }
  }, [idTipoDroga])

  // ── Cargar drogas ─────────────────────────────────────────────────────────
  const cargarDrogas = useCallback(
    async (pag: number = 1) => {
      if (!idoperativo) return
      setCargando(true)
      limpiarCache()
      setExpandedIds([])
      try {
        const res = await DrogasService.listar(
          idoperativo,
          pag,
          ITEMS_POR_PAGINA
        )
        if (res?.finalizado) {
          setDrogas(res.datos?.filas ?? [])
          setTotalRegistros(res.datos?.page?.totalElements ?? 0)
        }
      } finally {
        setCargando(false)
      }
    },
    [idoperativo, limpiarCache]
  )

  useEffect(() => {
    void cargarDrogas(1)
  }, [idoperativo]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset formulario ──────────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setIdTipoDroga('')
    setIdEstadoDroga('')
    setCantidadUnidades('1')
    setCantidadTn('0')
    setCantidadKg('0')
    setCantidadG('0')
    setCantidadMg('0')
    setCosto('0')
    setIdFormaTransporte('')
    setIdPaisProcedencia('')
    setIdPaisDestino('')
    setObservaciones('')
    setPruebaCampo(null)
    setPesaje(null)
    setDropzoneToken((t) => t + 1)
    setSubmitted(false)
  }, [])

  // ── Guardar droga ─────────────────────────────────────────────────────────
  const guardarDroga = async () => {
    setSubmitted(true)
    if (!idoperativo) return

    if (!idTipoDroga || !idEstadoDroga || !idFormaTransporte || !idPaisProcedencia || !idPaisDestino) {
      return
    }

    const totalGramos =
      parseNumber(cantidadTn) * 1000000 +
      parseNumber(cantidadKg) * 1000 +
      parseNumber(cantidadG) +
      parseNumber(cantidadMg) / 1000

    if (totalGramos < 0.001) {
      return
    }

    if (parseNumber(costo) <= 0 || !pruebaCampo || !pesaje) {
      return
    }

    setCargando(true)
    try {
      const res = await DrogasService.crear(idoperativo, {
        id: 0,
        idTipoDroga: Number(idTipoDroga),
        idEstadoDroga: Number(idEstadoDroga),
        cantidadUnidades: parseNumber(cantidadUnidades) || 1,
        cantidadGramos: totalGramos,
        idFormaTransporte: Number(idFormaTransporte),
        idPaisProcedencia: Number(idPaisProcedencia),
        idPaisDestino: Number(idPaisDestino),
        costo: costo ? parseNumber(costo) : undefined,
        observaciones: observaciones || undefined,
        pruebaCampo: pruebaCampo ?? undefined,
        pesaje: pesaje ?? undefined,
      })
      if (res?.finalizado) {
        await cargarDrogas(1)
        setPagina(1)
        resetForm()
      }
    } finally {
      setCargando(false)
    }
  }

  // ── Eliminar droga ────────────────────────────────────────────────────────
  const handleEliminar = async (id: number) => {
    confirm({
      texto: '¿Está seguro de eliminar este registro de droga?',
      onConfirm: async () => {
        setCargando(true)
        try {
          await DrogasService.eliminar(idoperativo, id)
          setExpandedIds((prev) => prev.filter((eid) => Number(eid) !== id))
          await cargarDrogas(pagina)
        } finally {
          setCargando(false)
        }
      },
    })
  }

  const handleEliminarConfirm = (texto: string, onConfirm: () => Promise<void>) => {
    confirm({ texto, onConfirm })
  }

  const handleCambioPagina = (nuevaPagina: number) => {
    setPagina(nuevaPagina)
    void cargarDrogas(nuevaPagina)
  }

  return (
    <div>
      <ConfirmDialog />
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <h4 className="mb-4 text-sm font-semibold">{titulo}</h4>

        {/* ── Formulario de registro ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              Estado de la Droga <span className="text-danger">*</span>
            </label>
            <Select
              options={estadosDroga.map((e) => ({
                value: String(e.id),
                label: e.descripcion,
              }))}
              placeholder="Seleccione un dato"
              value={idEstadoDroga}
              onChange={(e) => setIdEstadoDroga(e.target.value)}
              disabled={estadosDroga.length === 0}
              className={`w-full ${!idEstadoDroga && submitted ? 'border-danger' : ''}`}
            />
            {!idEstadoDroga && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Cantidad de Unidades
            </label>
            <Input
              id="cantidadUnidades"
              type="text"
              placeholder="1"
              className="w-full"
              value={cantidadUnidades}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || /^\d*$/.test(val)) {
                  setCantidadUnidades(val)
                }
              }}
            />
            {/* Se quita el error visual de unidades si solo depende del peso */}
          </div>

          {/* Cantidad multi-unidad */}
          <div className="col-span-1 md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Cantidad <span className="text-danger">*</span></label>
            <div className="grid grid-cols-4 gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-500">Tn</span>
                <Input
                  id="cantidadTn"
                  type="text"
                  placeholder="0"
                  className={`w-full ${(parseNumber(cantidadTn) * 1000000 + parseNumber(cantidadKg) * 1000 + parseNumber(cantidadG) + parseNumber(cantidadMg) / 1000) < 0.001 && submitted ? 'border-danger' : ''}`}
                  value={cantidadTn}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === '' || /^\d*$/.test(val)) {
                      setCantidadTn(val)
                    }
                  }}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-500">Kg</span>
                <Input
                  id="cantidadKg"
                  type="text"
                  placeholder="0"
                  className={`w-full ${(parseNumber(cantidadTn) * 1000000 + parseNumber(cantidadKg) * 1000 + parseNumber(cantidadG) + parseNumber(cantidadMg) / 1000) < 0.001 && submitted ? 'border-danger' : ''}`}
                  value={cantidadKg}
                  onChange={(e) => {
                    const val = e.target.value
                    if (
                      val === '' ||
                      (parseInt(val) >= 0 && parseInt(val) <= 999)
                    ) {
                      setCantidadKg(val)
                    }
                  }}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-500">g</span>
                <Input
                  id="cantidadG"
                  type="text"
                  placeholder="0"
                  className={`w-full ${(parseNumber(cantidadTn) * 1000000 + parseNumber(cantidadKg) * 1000 + parseNumber(cantidadG) + parseNumber(cantidadMg) / 1000) < 0.001 && submitted ? 'border-danger' : ''}`}
                  value={cantidadG}
                  onChange={(e) => {
                    const val = e.target.value
                    if (
                      val === '' ||
                      (parseInt(val) >= 0 && parseInt(val) <= 999)
                    ) {
                      setCantidadG(val)
                    }
                  }}
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-500">Mg</span>
                <Input
                  id="cantidadMg"
                  type="text"
                  placeholder="0"
                  className={`w-full ${(parseNumber(cantidadTn) * 1000000 + parseNumber(cantidadKg) * 1000 + parseNumber(cantidadG) + parseNumber(cantidadMg) / 1000) < 0.001 && submitted ? 'border-danger' : ''}`}
                  value={cantidadMg}
                  onChange={(e) => {
                    const val = e.target.value
                    if (
                      val === '' ||
                      (parseInt(val) >= 0 && parseInt(val) <= 999)
                    ) {
                      setCantidadMg(val)
                    }
                  }}
                  size="sm"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Costo (Bs.) <span className="text-danger">*</span>
            </label>
            <Input
              id="costo"
              type="text"
              placeholder="0"
              className={`w-full ${parseNumber(costo) <= 0 && submitted ? 'border-danger' : ''}`}
              value={costo}
              onChange={(e) => {
                const val = e.target.value
                if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                  setCosto(val)
                }
              }}
            />
            {parseNumber(costo) <= 0 && submitted && (
              <span className="text-danger text-xs mt-1">El costo debe ser mayor a 0</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Forma de Transporte <span className="text-danger">*</span>
            </label>
            <Select
              options={formasTransporte.map((f) => ({
                value: String(f.id),
                label: f.descripcion,
              }))}
              placeholder="Seleccione un dato"
              value={idFormaTransporte}
              onChange={(e) => setIdFormaTransporte(e.target.value)}
              className={`w-full ${!idFormaTransporte && submitted ? 'border-danger' : ''}`}
            />
            {!idFormaTransporte && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              País de Procedencia <span className="text-danger">*</span>
            </label>
            <Select
              options={paises.map((p) => ({
                value: String(p.id),
                label: p.descripcion,
              }))}
              placeholder="Seleccione un dato"
              value={idPaisProcedencia}
              onChange={(e) => setIdPaisProcedencia(e.target.value)}
              className={`w-full ${!idPaisProcedencia && submitted ? 'border-danger' : ''}`}
            />
            {!idPaisProcedencia && submitted && (
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
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className="mb-1 block text-sm font-medium">
              Observaciones
            </label>
            <Textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>

          {/* Fotos — DropzoneFoto */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DropzoneFoto
                key={`prueba-${dropzoneToken}`}
                label="Fotografía Prueba de Campo"
                archivo={pruebaCampo}
                onChange={setPruebaCampo}
                error={!pruebaCampo && submitted}
              />
              <DropzoneFoto
                key={`pesaje-${dropzoneToken}`}
                label="Fotografía Cuantificación y Pesaje"
                archivo={pesaje}
                onChange={setPesaje}
                error={!pesaje && submitted}
              />
            </div>
          </div>

          {/* Botón guardar */}
          <div className="col-span-1 mt-2 lg:col-span-3 flex justify-end">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={() => void guardarDroga()}
              disabled={cargando}
            >
              Guardar Droga
            </Button>
          </div>
        </div>

        {/* ── Tabla de drogas registradas ── */}
        <div className="mt-5">
          <div className="datatables">
            <VristoDataTable<ResponseDroga>
              loading={cargando}
              rows={drogas}
              total={totalRegistros}
              page={pagina}
              limit={ITEMS_POR_PAGINA}
              onPageChange={handleCambioPagina}
              onLimitChange={() => { }}
              columns={[
                {
                  accessor: 'descripcionTipoDroga',
                  title: 'Tipo de Droga',
                  render: (r) =>
                    r.descripcionTipoDroga ?? String(r.idTipoDroga ?? '—'),
                },
                {
                  accessor: 'descripcionEstadoDroga',
                  title: 'Estado',
                  render: (r) =>
                    r.descripcionEstadoDroga ?? String(r.idEstadoDroga ?? '—'),
                },
                {
                  accessor: 'cantidadUnidades',
                  title: 'Unidades',
                },
                {
                  accessor: 'cantidadGramos',
                  title: 'Gramos',
                  render: (r) =>
                    r.cantidadGramos != null
                      ? Number(r.cantidadGramos).toFixed(3)
                      : '0.000',
                },
                {
                  accessor: 'costo',
                  title: 'Costo (Bs.)',
                  render: (r) => (r.costo != null ? `${r.costo}` : '—'),
                },
                {
                  accessor: 'descripcionFormaTransporte',
                  title: 'Forma Transporte',
                  render: (r) =>
                    r.descripcionFormaTransporte ??
                    String(r.idFormaTransporte ?? '—'),
                },
                {
                  accessor: 'descripcionPaisProcedencia',
                  title: 'Procedencia',
                  render: (r) =>
                    r.descripcionPaisProcedencia ??
                    String(r.idPaisProcedencia ?? '—'),
                },
                {
                  accessor: 'descripcionPaisDestino',
                  title: 'Destino',
                  render: (r) =>
                    r.descripcionPaisDestino ?? String(r.idPaisDestino ?? '—'),
                },
                {
                  accessor: 'acciones',
                  title: 'Acciones',
                  render: (r) => (
                    <button
                      type="button"
                      className="text-danger hover:text-danger/80"
                      title="Eliminar"
                      disabled={cargando}
                      onClick={(e) => {
                        e.stopPropagation()
                        void handleEliminar(r.id)
                      }}
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  ),
                },
              ]}
              rowExpansion={{
                idField: 'id',
                expandedIds: expandedIds,
                onExpandChange: (ids) => setExpandedIds(ids),
                renderContent: (row) => (
                  <ExpansionContenidoDroga
                    droga={row}
                    idoperativo={idoperativo}
                    cache={fotosCache[row.id]}
                    onCacheLoad={actualizarCache}
                    onZoom={setImagenAmpliada}
                    onEliminarConfirm={handleEliminarConfirm}
                  />
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
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
