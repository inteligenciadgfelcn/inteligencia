'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  VristoDataTable,
  type Column,
} from '@/components/datatable/VristoDataTable'
import IconTrash from '@/components/Icon/IconTrash'
import { PersonasService } from '@/services/operativos'
import { SiiiLookupsService } from '@/services/parametricas'
import type { PersonaResponse } from '@/services/operativos'
import { useConfirmDialog } from '@/hooks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAlerts } from '@/hooks/useAlerts'
import { LoadingDialog } from '@/components/modales/LoadingDialog'
import { trimPayload } from '@/utils/trimPayload'

// ─── Tipos internos ───────────────────────────────────────────────────────────
type Opcion = { id: string; label: string }
type FotosCache = {
  frente: string | null
  perfil: string | null
  documento: string | null
}

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
              className="ml-2 p-1"
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
        <span className="text-danger text-xs mt-1 block">Esta foto es obligatoria</span>
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
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </p>
      {src ? (
        <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 shadow-md hover:scale-[1.01] transition-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={label}
            className="h-full max-w-full cursor-zoom-in object-contain"
            onClick={() => onZoom(src)}
          />
        </div>
      ) : (
        <div className="flex h-56 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 shadow-inner">
          <span className="text-xs font-medium text-gray-400">Sin fotografía cargada</span>
        </div>
      )}
    </div>
  )
}

// ─── FotosExpansion ───────────────────────────────────────────────────────────
function FotosExpansion({
  persona,
  cache,
  onCacheLoad,
  onZoom,
}: {
  persona: PersonaResponse
  cache: FotosCache | undefined
  onCacheLoad: (id: string, fotos: FotosCache) => void
  onZoom: (src: string) => void
}) {
  useEffect(() => {
    if (cache) return

    const fetchFoto = (path: string | null): Promise<string | null> =>
      path
        ? PersonasService.obtenerFoto(path)
          .then((blob) => URL.createObjectURL(blob))
          .catch(() => null)
        : Promise.resolve(null)

    void Promise.all([
      fetchFoto(persona.urlFotoFrente),
      fetchFoto(persona.urlFotoPerfilIzquierdo),
      fetchFoto(persona.urlFotoDocumento),
    ]).then(([frente, perfil, documento]) => {
      onCacheLoad(persona.id, { frente, perfil, documento })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!cache) {
    return (
      <div className="grid grid-cols-3 gap-4 border-t border-[#e0e6ed] p-4 dark:border-gray-700">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="border-t border-[#e0e6ed] p-4 dark:border-gray-700">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
        Fotos de Identificación
      </p>
      <div className="grid grid-cols-3 gap-4">
        <FotoSlot src={cache.frente} label="Foto Frente" onZoom={onZoom} />
        <FotoSlot src={cache.perfil} label="Perfil Izquierdo" onZoom={onZoom} />
        <FotoSlot
          src={cache.documento}
          label="Documento / SEGIP"
          onZoom={onZoom}
        />
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatFecha = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ─── Seccion6Form ─────────────────────────────────────────────────────────────
interface Props {
  titulo: string
  idoperativo: number
}

const ITEMS_POR_PAGINA = 10

export function Persona({ titulo, idoperativo }: Props) {
  const { confirm, ConfirmDialog } = useConfirmDialog()
  const { Alerta } = useAlerts()
  // ── Opciones de selectores ────────────────────────────────────────────────
  const [opcionesEstado, setOpcionesEstado] = useState<Opcion[]>([])
  const [opcionesDocumento, setOpcionesDocumento] = useState<Opcion[]>([])
  const [opcionesPaises, setOpcionesPaises] = useState<Opcion[]>([])
  const [idBoliviaDefault, setIdBoliviaDefault] = useState('')

  // ── Campos del formulario ─────────────────────────────────────────────────
  const [nombres, setNombres] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [apCasada, setApCasada] = useState('')
  const [genero, setGenero] = useState('')
  const [idEstadoSujeto, setIdEstadoSujeto] = useState('')
  const [idTipoDocumento, setIdTipoDocumento] = useState('')
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [direccion, setDireccion] = useState('')
  const [idPais, setIdPais] = useState('')

  // Token para forzar re-mount de DropzoneFoto al resetear
  const [dropzoneToken, setDropzoneToken] = useState(0)
  const [fotoFrente, setFotoFrente] = useState<File | null>(null)
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null)
  const [fotoDocumento, setFotoDocumento] = useState<File | null>(null)

  // ── Lista, paginación y estado general ────────────────────────────────────
  const [cargando, setCargando] = useState(false)
  const [personas, setPersonas] = useState<PersonaResponse[]>([])
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const [submitted, setSubmitted] = useState(false)

  // ── Cache de fotos ────────────────────────────────────────────────────────
  const [fotosCache, setFotosCache] = useState<Record<string, FotosCache>>({})
  const fotosCacheRef = useRef<Record<string, FotosCache>>({})
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  const actualizarCache = useCallback((id: string, fotos: FotosCache) => {
    fotosCacheRef.current[id] = fotos
    setFotosCache((prev) => ({ ...prev, [id]: fotos }))
  }, [])

  const limpiarCache = useCallback(() => {
    Object.values(fotosCacheRef.current).forEach(
      ({ frente, perfil, documento }) => {
        if (frente) URL.revokeObjectURL(frente)
        if (perfil) URL.revokeObjectURL(perfil)
        if (documento) URL.revokeObjectURL(documento)
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

  // ── Cargar paramétricas ───────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      const dbEstados = await SiiiLookupsService.obtenerEstadosSujeto()
      const dbDocumentos = await SiiiLookupsService.obtenerTiposDocumento()
      const dbPaises = await SiiiLookupsService.obtenerPaises()

      if (dbEstados?.finalizado) {
        setOpcionesEstado(
          (dbEstados.datos ?? []).map((e: any) => ({
            id: String(e.id),
            label: String(e.descripcion),
          }))
        )
      }

      if (dbDocumentos?.finalizado) {
        setOpcionesDocumento(
          (dbDocumentos.datos ?? []).map((d: any) => ({
            id: String(d.id),
            label: String(d.descripcion),
          }))
        )
      }

      if (dbPaises?.finalizado) {
        setOpcionesPaises(
          (dbPaises.datos ?? []).map((p: any) => ({
            id: String(p.id),
            label: String(p.descripcion),
          }))
        )
        const bolivia = (dbPaises.datos ?? []).find(
          (p: any) => String(p.descripcion).trim().toUpperCase() === 'BOLIVIA'
        )
        if (bolivia) {
          const idBol = String(bolivia.id)
          setIdBoliviaDefault(idBol)
          setIdPais(idBol)
        }
      }
    }
    void cargar()
  }, [])

  // ── Cargar personas ───────────────────────────────────────────────────────
  const cargarPersonas = useCallback(
    async (pag: number = 1) => {
      if (!idoperativo) return
      setCargando(true)
      limpiarCache()
      setExpandedIds([])
      try {
        const res = await PersonasService.listar(
          idoperativo,
          pag,
          ITEMS_POR_PAGINA
        )
        if (res?.finalizado) {
          setPersonas(res.datos?.filas ?? [])
          setTotalRegistros(res.datos?.page?.totalElements ?? 0)
        }
      } finally {
        setCargando(false)
      }
    },
    [idoperativo, limpiarCache]
  )

  useEffect(() => {
    void cargarPersonas(1)
  }, [idoperativo]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset del formulario ──────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setNombres('')
    setPrimerApellido('')
    setSegundoApellido('')
    setApCasada('')
    setGenero('')
    setIdEstadoSujeto('')
    setIdTipoDocumento('')
    setNumeroDocumento('')
    setFechaNacimiento('')
    setDireccion('')
    setIdPais(idBoliviaDefault)
    setFotoFrente(null)
    setFotoPerfil(null)
    setFotoDocumento(null)
    setDropzoneToken((t) => t + 1)
    setSubmitted(false)
  }, [idBoliviaDefault])

  // ── Guardar persona ───────────────────────────────────────────────────────
  const guardarPersona = async () => {
    setSubmitted(true)
    if (!idoperativo) return

    if (
      !nombres ||
      !primerApellido ||
      !idEstadoSujeto ||
      !genero ||
      !idTipoDocumento ||
      !numeroDocumento ||
      !idPais ||
      !fechaNacimiento ||
      !direccion ||
      !fotoFrente ||
      !fotoPerfil ||
      !fotoDocumento
    ) {
      return
    }

    setCargando(true)
    try {
      const res = await PersonasService.crear(idoperativo, trimPayload({
        nombres,
        apellidoPaterno: primerApellido,
        apellidoMaterno: segundoApellido,
        apellidoCasada: apCasada || undefined,
        genero: genero === 'true',
        idTipoDocumento: Number(idTipoDocumento),
        nroDocumento: numeroDocumento,
        fechaNacimiento,
        direccion,
        estado: idEstadoSujeto,
        idPais: idPais ? Number(idPais) : undefined,
        fotoFrente: fotoFrente ?? undefined,
        fotoPerfilIzquierdo: fotoPerfil ?? undefined,
        fotoDocumento: fotoDocumento ?? undefined,
      }))
      if (res?.finalizado) {
        await cargarPersonas(1)
        setPagina(1)
        resetForm()
      }
    } finally {
      setCargando(false)
    }
  }

  // ── Eliminar persona ──────────────────────────────────────────────────────
  const handleEliminar = async (id: string) => {
    confirm({
      texto: '¿Está seguro de eliminar esta persona?',
      onConfirm: async () => {
        setCargando(true)
        try {
          await PersonasService.eliminar(
            idoperativo,
            Number(id)
          )
          setExpandedIds((prev) => prev.filter((eid) => eid !== id))
          await cargarPersonas(pagina)
        } finally {
          setCargando(false)
        }
      },
    })
  }

  const handleCambioPagina = (nuevaPagina: number) => {
    setPagina(nuevaPagina)
    void cargarPersonas(nuevaPagina)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <LoadingDialog show={cargando} />
      <ConfirmDialog />
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <h4 className="mb-4 text-sm font-semibold">{titulo}</h4>

        {/* ── Formulario de registro ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Fila 1: Nombres y apellidos */}
          <div>
            <label htmlFor="nombres" className="mb-1 block text-sm font-medium">
              Nombre(s) <span className="text-danger">*</span>
            </label>
            <Input
              id="nombres"
              type="text"
              className={`w-full ${!nombres && submitted ? 'border-danger' : ''}`}
              value={nombres}
              onChange={(e) => setNombres(e.target.value.toUpperCase())}
            />
            {!nombres && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label
              htmlFor="primerApellido"
              className="mb-1 block text-sm font-medium"
            >
              Primer Apellido <span className="text-danger">*</span>
            </label>
            <Input
              id="primerApellido"
              type="text"
              className={`w-full ${!primerApellido && submitted ? 'border-danger' : ''}`}
              value={primerApellido}
              onChange={(e) => setPrimerApellido(e.target.value.toUpperCase())}
            />
            {!primerApellido && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label
              htmlFor="segundoApellido"
              className="mb-1 block text-sm font-medium"
            >
              Segundo Apellido
            </label>
            <Input
              id="segundoApellido"
              type="text"
              className="w-full"
              value={segundoApellido}
              onChange={(e) => setSegundoApellido(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label
              htmlFor="apCasada"
              className="mb-1 block text-sm font-medium"
            >
              Ap. Casada
            </label>
            <Input
              id="apCasada"
              type="text"
              className="w-full"
              value={apCasada}
              onChange={(e) => setApCasada(e.target.value.toUpperCase())}
            />
          </div>

          {/* Fila 2: Estado, Género, Documento */}
          <div>
            <label
              htmlFor="idEstadoSujeto"
              className="mb-1 block text-sm font-medium"
            >
              Estado / Tipo Implicado <span className="text-danger">*</span>
            </label>
            <Select
              id="idEstadoSujeto"
              className={`w-full ${!idEstadoSujeto && submitted ? 'border-danger' : ''}`}
              value={idEstadoSujeto}
              onChange={(e) => setIdEstadoSujeto(e.target.value)}
              options={opcionesEstado.map((o) => ({
                value: o.label,
                label: o.label,
              }))}
              placeholder="Seleccione un dato"
            />
            {!idEstadoSujeto && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label htmlFor="genero" className="mb-1 block text-sm font-medium">
              Género <span className="text-danger">*</span>
            </label>
            <Select
              id="genero"
              className={`w-full ${!genero && submitted ? 'border-danger' : ''}`}
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              options={[
                { value: 'true', label: 'Masculino' },
                { value: 'false', label: 'Femenino' },
              ]}
              placeholder="Seleccione un dato"
            />
            {!genero && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label
              htmlFor="idTipoDocumento"
              className="mb-1 block text-sm font-medium"
            >
              Tipo de Documento <span className="text-danger">*</span>
            </label>
            <Select
              id="idTipoDocumento"
              className={`w-full ${!idTipoDocumento && submitted ? 'border-danger' : ''}`}
              value={idTipoDocumento}
              onChange={(e) => setIdTipoDocumento(e.target.value)}
              options={opcionesDocumento.map((o) => ({
                value: o.id,
                label: o.label,
              }))}
              placeholder="Seleccione un dato"
            />
            {!idTipoDocumento && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label
              htmlFor="numeroDocumento"
              className="mb-1 block text-sm font-medium"
            >
              Nro. Documento <span className="text-danger">*</span>
            </label>
            <Input
              id="numeroDocumento"
              type="text"
              className={`w-full ${!numeroDocumento && submitted ? 'border-danger' : ''}`}
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value.toUpperCase())}
            />
            {!numeroDocumento && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>

          {/* Fila 3: Fecha, Dirección, Nacionalidad */}
          <div>
            <label
              htmlFor="fechaNacimiento"
              className="mb-1 block text-sm font-medium"
            >
              Fecha de Nacimiento <span className="text-danger">*</span>
            </label>
            <Input
              id="fechaNacimiento"
              type="date"
              className={`w-full ${!fechaNacimiento && submitted ? 'border-danger' : ''}`}
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
            {!fechaNacimiento && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div className="col-span-1 lg:col-span-2">
            <label
              htmlFor="direccion"
              className="mb-1 block text-sm font-medium"
            >
              Dirección <span className="text-danger">*</span>
            </label>
            <Input
              id="direccion"
              type="text"
              className={`w-full ${!direccion && submitted ? 'border-danger' : ''}`}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value.toUpperCase())}
            />
            {!direccion && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <label htmlFor="idPais" className="mb-1 block text-sm font-medium">
              Nacionalidad <span className="text-danger">*</span>
            </label>
            <Select
              id="idPais"
              className={`w-full ${!idPais && submitted ? 'border-danger' : ''}`}
              value={idPais}
              onChange={(e) => setIdPais(e.target.value)}
              options={opcionesPaises.map((o) => ({
                value: o.id,
                label: o.label,
              }))}
              placeholder="Seleccione un dato"
            />
            {!idPais && submitted && (
              <span className="text-danger text-xs mt-1">Este campo es obligatorio</span>
            )}
          </div>

          {/* Fila 4: Fotos — DropzoneFoto con drag & drop */}
          <div className="col-span-1 lg:col-span-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <DropzoneFoto
                key={`frente-${dropzoneToken}`}
                label="Foto Frente"
                archivo={fotoFrente}
                onChange={setFotoFrente}
                error={!fotoFrente && submitted}
              />
              <DropzoneFoto
                key={`perfil-${dropzoneToken}`}
                label="Foto Perfil Izquierdo"
                archivo={fotoPerfil}
                onChange={setFotoPerfil}
                error={!fotoPerfil && submitted}
              />
              <DropzoneFoto
                key={`documento-${dropzoneToken}`}
                label="Foto Documento / SEGIP"
                archivo={fotoDocumento}
                onChange={setFotoDocumento}
                error={!fotoDocumento && submitted}
              />
            </div>
          </div>

          {/* Botón guardar */}
          <div className="col-span-1 mt-2 lg:col-span-4 flex justify-end">
            <Button
              type="button"
              variant="success"
              size="sm"
              onClick={() => void guardarPersona()}
              disabled={cargando}
            >
              Guardar
            </Button>
          </div>
        </div>

        {/* ── Tabla de personas registradas ── */}
        <div className="mt-5">
          <div className="datatables">
            <VristoDataTable<PersonaResponse>
              loading={cargando}
              rows={personas}
              total={totalRegistros}
              limit={ITEMS_POR_PAGINA}
              page={pagina}
              onPageChange={handleCambioPagina}
              onLimitChange={() => { }}
              columns={
                [
                  {
                    accessor: 'nombreCompleto',
                    title: 'Nombre Completo',
                    render: (r) =>
                      [r.nombres, r.apellidoPaterno, r.apellidoMaterno]
                        .filter(Boolean)
                        .join(' '),
                  },
                  { accessor: 'nroDocumento', title: 'Nro. Documento' },
                  {
                    accessor: 'descripcionTipoDocumento',
                    title: 'Tipo Documento',
                  },
                  {
                    accessor: 'fechaNacimiento',
                    title: 'Fecha Nac.',
                    render: (r) => formatFecha(r.fechaNacimiento),
                  },
                  {
                    accessor: 'genero',
                    title: 'Género',
                    render: (r) => (r.genero ? 'Masculino' : 'Femenino'),
                  },
                  { accessor: 'estado', title: 'Estado' },
                  {
                    accessor: 'direccion',
                    title: 'Dirección',
                    render: (r) => (
                      <span
                        className="block max-w-[160px] overflow-hidden text-ellipsis"
                        title={r.direccion}
                      >
                        {r.direccion}
                      </span>
                    ),
                  },
                  { accessor: 'descripcionPais', title: 'Nacionalidad' },
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
                ] as Column<PersonaResponse>[]
              }
              rowExpansion={{
                idField: 'id',
                expandedIds: expandedIds,
                onExpandChange: setExpandedIds as (
                  ids: (string | number)[]
                ) => void,
                renderContent: (record) => (
                  <FotosExpansion
                    persona={record}
                    cache={fotosCache[record.id]}
                    onCacheLoad={actualizarCache}
                    onZoom={setImagenAmpliada}
                  />
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {
        imagenAmpliada && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={() => setImagenAmpliada(null)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagenAmpliada as string}
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
        )
      }
    </div>
  )
}
