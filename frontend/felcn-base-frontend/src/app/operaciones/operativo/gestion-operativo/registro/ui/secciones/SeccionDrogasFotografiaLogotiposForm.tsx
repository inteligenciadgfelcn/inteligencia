'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DataTable } from 'mantine-datatable'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormInputDropdown, FormInputText, optionType } from '@/components/form'
import FormInputFile from '@/components/form/FormInputFile'
import IconTrashLines from '@/components/Icon/IconTrashLines'

import {
  EstadoDroga,
  GestionOperativoCatalogosService,
  GestionOperativoDrogasService,
  GestionOperativoLogotiposService,
  LogotipoCasoPayload,
  ResponseDroga,
} from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'
import { useParametricas } from '@/hooks'
import FormInputImage from '@/components/form/FormInputImage'

const ITEMS_POR_PAGINA = 5

// ── Imagen autenticada ──────────────────────────────────────────────────────
function ImagenAutenticada({
  path,
  alt,
  className,
  onClick,
}: {
  path: string
  alt: string
  className?: string
  onClick?: (src: string) => void
}) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string
    GestionOperativoDrogasService.obtenerFoto(path)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      })
      .catch(() => setSrc(null))
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [path])

  if (!src) return null
  // blob URLs no son compatibles con next/image — se usa <img> intencionalmente
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={onClick ? `${className ?? ''} cursor-zoom-in` : className}
      onClick={() => onClick?.(src)}
    />
  )
}

// ── Panel de logotipos (estado propio por droga) ────────────────────────────
function LogotiposPanel({
  idoperativo,
  idDroga,
}: {
  idoperativo: number
  idDroga: number
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      imagen: '',
      descripcionLogo: '',
      organizacion: '',
      blanco: '',
      observacion: '',
      fotografia: [],
    },
  })

  const [logotiposItems, setLogotiposItems] = useState<LogotipoCasoPayload[]>(
    []
  )
  const [cargando, setCargando] = useState(false)
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const cargar = async () => {
    setCargando(true)
    try {
      const res = await GestionOperativoLogotiposService.listar(
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
  }, [idoperativo, idDroga])

  const eliminar = async (id: number) => {
    await GestionOperativoLogotiposService.eliminar(idoperativo, idDroga, id)
    await cargar()
  }

  const onSubmit = async (data: Record<string, any>) => {
    const fotoLogoFile =
      data.fotografia && data.fotografia.length > 0
        ? data.fotografia[0]
        : undefined
    setCargando(true)
    try {
      const respuesta = await GestionOperativoLogotiposService.crear(
        idoperativo,
        idDroga,
        {
          id: 0,
          imagen: String(data.imagen ?? ''),
          descripcionLogo: String(data.descripcionLogo ?? ''),
          organizacion: String(data.organizacion ?? ''),
          blanco: data.blanco ? String(data.blanco) : undefined,
          observacion: data.observacion ? String(data.observacion) : undefined,
          fotografia: fotoLogoFile,
        }
      )
      if (respuesta?.finalizado) {
        await cargar()
        reset()
        setMostrarFormulario(false)
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="mt-4 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Logotipos de la Droga #{idDroga}
      </p>

      {/* Formulario */}
      {mostrarFormulario && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title="REGISTRAR LOGOTIPO">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInputText
                id="imagen"
                name="imagen"
                label="Imagen"
                control={control}
              />
              <FormInputText
                id="descripcionLogo"
                name="descripcionLogo"
                label="Descripción del Logo"
                control={control}
              />
              <FormInputText
                id="organizacion"
                name="organizacion"
                label="Organización Criminal"
                control={control}
              />
              <FormInputText
                id="blanco"
                name="blanco"
                label="Posibles Blancos"
                control={control}
              />
              <FormInputText
                id="observacion"
                name="observacion"
                label="Observación"
                control={control}
              />
              <div className="hidden lg:block" />
              <div className="col-span-1 lg:col-span-3">
                <FormInputFile
                  id="fotografia"
                  name="fotografia"
                  label="Fotografía"
                  control={control}
                  limite={1}
                  tiposPermitidos={['image/*']}
                />
              </div>
              <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
                <Button variant="primary" type="submit" disabled={cargando}>
                  Guardar Logotipo
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}

      {/* Tabla */}
      <Card
        title="LOGOTIPOS REGISTRADOS"
        action={
          <Button
            variant="primary"
            onClick={() => setMostrarFormulario((v) => !v)}
            disabled={cargando}
          >
            {mostrarFormulario ? 'Cancelar' : 'Agregar Logotipo'}
          </Button>
        }
      >
        <div className="datatables">
          <DataTable
            withTableBorder={false}
            className="table-hover whitespace-nowrap"
            fetching={cargando}
            records={logotiposItems}
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
                accessor: 'foto',
                title: 'Foto',
                render: (row) => {
                  const fotoUrl =
                    (row as unknown as Record<string, unknown>).fotografiaUrl ??
                    (row as unknown as Record<string, unknown>).urlFotografia
                  return typeof fotoUrl === 'string' && fotoUrl.length > 0 ? (
                    <ImagenAutenticada
                      path={fotoUrl}
                      alt="Logotipo"
                      className="h-14 w-20 rounded object-cover shadow-sm"
                      onClick={setImagenAmpliada}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )
                },
              },
              {
                accessor: 'actions',
                title: '',
                render: (row) => (
                  <button
                    type="button"
                    className="text-danger"
                    onClick={() => {
                      void eliminar(row.id)
                    }}
                  >
                    <IconTrashLines />
                  </button>
                ),
              },
            ]}
            highlightOnHover
          />
        </div>
      </Card>

      {/* Lightbox logotipos */}
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
            <button
              type="button"
              className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
              onClick={() => setImagenAmpliada(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Ítem de droga desplegable ───────────────────────────────────────────────
function DrogaItem({
  droga,
  expandido,
  onToggle,
  onEliminar,
  idoperativo,
}: {
  droga: ResponseDroga
  expandido: boolean
  onToggle: () => void
  onEliminar: () => void
  idoperativo: number
}) {
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null)

  return (
    <div className="overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Cabecera del ítem */}
      <div
        className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900"
        onClick={onToggle}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <span className="font-bold text-primary">#{droga.id}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Estado:</span> {droga.idEstadoDroga}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Gramos:</span> {droga.cantidadGramos}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Unidades:</span>{' '}
            {droga.cantidadUnidades}
          </span>
          {droga.costo != null && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Costo:</span> Bs. {droga.costo}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="text-danger"
            onClick={(e) => {
              e.stopPropagation()
              onEliminar()
            }}
          >
            <IconTrashLines />
          </button>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expandido ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Contenido expandido */}
      {expandido && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          {/* Detalles */}
          <div className='grid grid-cols-3'>
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-3 lg:grid-cols-4">
              <div>
                <span className="font-medium text-gray-500">Transporte:</span>{' '}
                {droga.idFormaTransporte}
              </div>
              <div>
                <span className="font-medium text-gray-500">Procedencia:</span>{' '}
                {droga.idPaisProcedencia}
              </div>
              <div>
                <span className="font-medium text-gray-500">Destino:</span>{' '}
                {droga.idPaisDestino}
              </div>
              <div>
                <span className="font-medium text-gray-500">Ingreso:</span>{' '}
                {droga.fechaHoraIngreso}
              </div>
              <div>
                <span className="font-medium text-gray-500">Usuario:</span>{' '}
                {droga.usuario}
              </div>
            </div>

            {/* Fotos de la droga */}
            {(droga.urlFotoPruebaCampo || droga.urlFotoPesaje) && (
              <div className="mb-4 flex gap-6">
                {droga.urlFotoPruebaCampo && (
                  <div className="text-center">
                    <p className="mb-1 text-xs text-gray-500">
                      Prueba de Campo
                    </p>
                    <ImagenAutenticada
                      path={droga.urlFotoPruebaCampo}
                      alt="Prueba de Campo"
                      className="h-20 w-28 rounded object-cover shadow-sm"
                      onClick={setImagenAmpliada}
                    />
                  </div>
                )}
                {droga.urlFotoPesaje && (
                  <div className="text-center">
                    <p className="mb-1 text-xs text-gray-500">Pesaje</p>
                    <ImagenAutenticada
                      path={droga.urlFotoPesaje}
                      alt="Pesaje"
                      className="h-20 w-28 rounded object-cover shadow-sm"
                      onClick={setImagenAmpliada}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Logotipos anidados */}
          <LogotiposPanel idoperativo={idoperativo} idDroga={droga.id} />
        </div>
      )}

      {/* Lightbox fotos de droga */}
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
            <button
              type="button"
              className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-800 shadow-lg hover:bg-gray-100"
              onClick={() => setImagenAmpliada(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Componente principal ────────────────────────────────────────────────────
interface SeccionFormProps {
  titulo: string
  onGuardar?: (payload: SeccionPayloadBase) => Promise<unknown>
  onRecuperar?: () => Promise<unknown>
  cargando?: boolean
  idoperativo?: number
}

export function SeccionDrogasFotografiaLogotiposForm({
  idoperativo = 0,
}: SeccionFormProps) {
  const {
    control: controlDrogas,
    handleSubmit: handleSubmitDrogas,
    setValue: setDrogasValue,
    watch: watchDrogas,
    reset: resetDrogas,
  } = useForm({
    defaultValues: {
      idTipoDroga: '',
      idEstadoDroga: '',
      cantidadGramos: '',
      cantidadUnidades: '',
      costo: '',
      idFormaTransporte: '',
      idPaisProcedencia: '',
      idPaisDestino: '',
      observaciones: '',
      pruebaCampo: [],
      pesaje: [],
    },
  })

  const {
    paises,
    tiposDroga,
    cargarPaises,
    cargarTiposDroga,
    formasTransporte,
    cargarFormasTransporte,
  } = useParametricas()

  useEffect(() => {
    cargarPaises(), cargarTiposDroga(), cargarFormasTransporte()
  }, [])

  const opcionesPaises: optionType[] = paises.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: t.descripcion,
  }))
  const opcionesTiposDroga: optionType[] = tiposDroga.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: t.descripcion,
  }))
  const opcionesFormasTransporte: optionType[] = formasTransporte.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: t.descripcion,
  }))

  const tipoDrogaSeleccionada = watchDrogas('idTipoDroga')
  const [estadosDroga, setEstadosDroga] = useState<EstadoDroga[]>([])

  const cargarEstadosDroga = async (idTipoDroga: number) => {
    try {
      const res = await GestionOperativoCatalogosService.obtenerEstadosDroga(idTipoDroga)
      if (res?.finalizado) {
        setEstadosDroga(Array.isArray(res.datos) ? res.datos : [])
      }
    } catch {
      setEstadosDroga([])
    }
  }

  useEffect(() => {
    if (tipoDrogaSeleccionada) {
      setDrogasValue('idEstadoDroga', '')
      void cargarEstadosDroga(Number(tipoDrogaSeleccionada))
    } else {
      setEstadosDroga([])
    }
  }, [tipoDrogaSeleccionada])

  const opcionesEstadosDroga: optionType[] = estadosDroga.map((e) => ({
    id: String(e.id),
    value: String(e.id),
    label: e.descripcion,
  }))

  // Estado de lista
  const [drogasItems, setDrogasItems] = useState<ResponseDroga[]>([])
  const [cargandoDrogas, setCargandoDrogas] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [expandidoId, setExpandidoId] = useState<number | null>(null)
  const [paginaActual, setPaginaActual] = useState(1)
  const [idBolivia, setIdBolivia] = useState('')

  const [cantidadTn, setCantidadTn] = useState('')
  const [cantidadKg, setCantidadKg] = useState('')
  const [cantidadG, setCantidadG] = useState('')
  const [cantidadMg, setCantidadMg] = useState('')

  const parseNumber = (valor: unknown) => {
    if (typeof valor === 'number') return Number.isFinite(valor) ? valor : 0
    const normalizado = Number(String(valor ?? '').replace(',', '.'))
    return Number.isFinite(normalizado) ? normalizado : 0
  }

  useEffect(() => {
    if (paises.length > 0) {
      const bolivia = paises.find(
        (p) => p.descripcion.trim().toLowerCase() === 'bolivia'
      )
      if (bolivia) {
        setIdBolivia(String(bolivia.id))
        setDrogasValue('idPaisProcedencia', String(bolivia.id))
        setDrogasValue('idPaisDestino', String(bolivia.id))
      }
    }
  }, [paises, setDrogasValue])

  const cargarDrogas = async () => {
    if (!idoperativo) return
    setCargandoDrogas(true)
    try {
      const res = await GestionOperativoDrogasService.listar(idoperativo)
      if (res?.finalizado) {
        setDrogasItems(res.datos?.filas ?? [])
      }
    } finally {
      setCargandoDrogas(false)
    }
  }

  useEffect(() => {
    void cargarDrogas()
  }, [idoperativo])

  const eliminarDroga = async (id: number) => {
    if (!idoperativo) return
    await GestionOperativoDrogasService.eliminar(idoperativo, id)
    if (expandidoId === id) setExpandidoId(null)
    await cargarDrogas()
  }

  const onSubmitDrogas = async (data: Record<string, any>) => {
    if (!idoperativo) return
    const gramos =
      parseNumber(cantidadTn) * 1_000_000 +
      parseNumber(cantidadKg) * 1_000 +
      parseNumber(cantidadG) +
      parseNumber(cantidadMg) / 1000

    const pruebaCampoFile =
      data.pruebaCampo && data.pruebaCampo.length > 0 ? data.pruebaCampo[0] : undefined
    const pesajeFile =
      data.pesaje && data.pesaje.length > 0 ? data.pesaje[0] : undefined

    setCargandoDrogas(true)
    try {
      const respuesta = await GestionOperativoDrogasService.crear(idoperativo, {
        id: 0,
        idTipoDroga: data.idTipoDroga,
        idEstadoDroga: data.idEstadoDroga,
        cantidadGramos: gramos,
        cantidadUnidades: parseNumber(data.cantidadUnidades),
        costo: data.costo !== '' ? parseNumber(data.costo) : undefined,
        idFormaTransporte: data.idFormaTransporte,
        idPaisProcedencia: data.idPaisProcedencia,
        idPaisDestino: data.idPaisDestino,
        observaciones: data.observaciones ? String(data.observaciones) : undefined,
        pruebaCampo: pruebaCampoFile,
        pesaje: pesajeFile,
      })
      if (respuesta?.finalizado) {
        await cargarDrogas()
        resetDrogas({
          idTipoDroga: '',
          idEstadoDroga: '',
          cantidadGramos: '',
          cantidadUnidades: '',
          costo: '',
          idFormaTransporte: '',
          idPaisProcedencia: idBolivia,
          idPaisDestino: idBolivia,
          observaciones: '',
          pruebaCampo: [],
          pesaje: [],
        })
        setCantidadTn('')
        setCantidadKg('')
        setCantidadG('')
        setCantidadMg('')
        setMostrarFormulario(false)
        setPaginaActual(1)
      }
    } finally {
      setCargandoDrogas(false)
    }
  }

  // Paginación
  const totalPaginas = Math.max(
    1,
    Math.ceil(drogasItems.length / ITEMS_POR_PAGINA)
  )
  const itemsPagina = drogasItems.slice(
    (paginaActual - 1) * ITEMS_POR_PAGINA,
    paginaActual * ITEMS_POR_PAGINA
  )

  const toggleExpandido = (id: number) => {
    setExpandidoId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="space-y-5">
      {/* Formulario de registro */}
      {mostrarFormulario && (
        <form onSubmit={handleSubmitDrogas(onSubmitDrogas)}>
          <Card title="REGISTRO DE DROGA">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <FormInputDropdown
                id="idTipoDroga"
                name="idTipoDroga"
                label="Tipo de Droga"
                control={controlDrogas}
                options={opcionesTiposDroga}
              />
              <FormInputDropdown
                id="idEstadoDroga"
                name="idEstadoDroga"
                label="Estado de la Droga"
                control={controlDrogas}
                options={opcionesEstadosDroga}
              />
              <FormInputText
                id="cantidadUnidades"
                name="cantidadUnidades"
                label="Cantidad de Unidades"
                control={controlDrogas}
              />
              <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Cantidad
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-500">Tn</span>
                    <Input
                      id="cantidadTn"
                      value={cantidadTn}
                      onChange={(event) => setCantidadTn(event.target.value)}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-500">Kg</span>
                    <Input
                      id="cantidadKg"
                      value={cantidadKg}
                      onChange={(event) => setCantidadKg(event.target.value)}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-500">g</span>
                    <Input
                      id="cantidadG"
                      value={cantidadG}
                      onChange={(event) => setCantidadG(event.target.value)}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-500">Mg</span>
                    <Input
                      id="cantidadMg"
                      value={cantidadMg}
                      onChange={(event) => setCantidadMg(event.target.value)}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <FormInputText
                id="costo"
                name="costo"
                label="Costo (Bs.)"
                control={controlDrogas}
              />
              <FormInputDropdown
                id="idFormaTransporte"
                name="idFormaTransporte"
                label="Forma de Transporte"
                control={controlDrogas}
                options={opcionesFormasTransporte}
              />
              <FormInputDropdown
                id="idPaisProcedencia"
                name="idPaisProcedencia"
                label="Procedencia"
                control={controlDrogas}
                options={opcionesPaises}
              />
              <FormInputDropdown
                id="idPaisDestino"
                name="idPaisDestino"
                label="Destino"
                control={controlDrogas}
                options={opcionesPaises}
              />
              <FormInputText
                id="observaciones"
                name="observaciones"
                label="Observaciones"
                control={controlDrogas}
              />
              <div className="col-span-1 lg:col-span-3">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInputImage
                    id="pruebaCampo"
                    name="pruebaCampo"
                    label="Fotografía Prueba de Campo"
                    control={controlDrogas}
                    limite={1}
                    tiposPermitidos={['image/*']}
                  />
                  <FormInputImage
                    id="pesaje"
                    name="pesaje"
                    label="Fotografía Cuantificación y Pesaje"
                    control={controlDrogas}
                    limite={1}
                    tiposPermitidos={['image/*']}
                  />
                </div>
              </div>
              <div className="col-span-1 mt-4 flex justify-end lg:col-span-3">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={cargandoDrogas}
                >
                  Guardar Droga
                </Button>
              </div>
            </div>
          </Card>
        </form>
      )}

      {/* Lista desplegable de drogas */}
      <Card
        title="DROGAS REGISTRADAS"
        action={
          <Button
            variant="primary"
            onClick={() => setMostrarFormulario((v) => !v)}
            disabled={cargandoDrogas}
          >
            {mostrarFormulario ? 'Cancelar' : 'Agregar Droga'}
          </Button>
        }
      >
        {cargandoDrogas ? (
          <p className="py-6 text-center text-sm text-gray-400">Cargando...</p>
        ) : drogasItems.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            Sin registros
          </p>
        ) : (
          <div className="space-y-0">
            {itemsPagina.map((droga) => (
              <DrogaItem
                key={droga.id}
                droga={droga}
                expandido={expandidoId === droga.id}
                onToggle={() => toggleExpandido(droga.id)}
                onEliminar={() => void eliminarDroga(droga.id)}
                idoperativo={idoperativo}
              />
            ))}

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-between pt-3">
                <span className="text-xs text-gray-500">
                  Página {paginaActual} de {totalPaginas} — {drogasItems.length}{' '}
                  registros
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((p) => p - 1)}
                    className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    ‹ Anterior
                  </button>
                  <button
                    type="button"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual((p) => p + 1)}
                    className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-40 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    Siguiente ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
