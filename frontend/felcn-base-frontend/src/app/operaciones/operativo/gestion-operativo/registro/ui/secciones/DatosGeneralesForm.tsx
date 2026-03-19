'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'

const MapaConMarcador = dynamic(
  () => import('@/components/mapas/MapaConMarcador'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    ),
  }
)
import { useParametricas } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import {
  GestionOperativoCatalogosService,
  GestionOperativosDatosGeneralesService,
} from '@/services/operativos'

import type {
  CasoOperativoDetalle,
  CasoResumen,
  OperativoResponse,
} from '@/services/operativos'
import type { OperativoPayload } from '@/services/operativos'
import type { SeccionPayloadBase } from '../../../types'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface DatosGeneralesFormProps {
  titulo: string
  onGuardar: (payload: SeccionPayloadBase) => Promise<unknown>
  onOperativoGuardado?: () => void
  cargando?: boolean
  datosCaso?: CasoOperativoDetalle | null
  tieneOperativo?: boolean
}

interface DatosLectura {
  numeroInforme: string
  nombreCaso: string
  unidad: string
  distrital: string
  grupo: string
  quienRealiza: string
  celularRealiza: string
  asignado: string
  celularAsignado: string
  fiscal: string
  celularFiscal: string
}

interface optionType {
  id: string
  value: string
  label: string
}

/** Convierte una fecha a formato YYYY-MM-DDTHH:mm requerido por datetime-local */
const toDatetimeLocal = (value: unknown): string => {
  const date = value instanceof Date ? value : new Date(String(value ?? ''))
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const DEFAULT_VALUES: OperativoPayload = {
  numeroOperativo: 'CB-UM-363/25',
  idTipoRelevancia: 0,
  idTipoDenuncia: 0,
  idTipoPenal: 0,
  fechaOperativo: toDatetimeLocal(new Date()),
  idDepartamento: 0,
  idProvincia: 0,
  idLocalidad: 0,
  lugar: 'CENTRAL VILLA 14 DE SEPTIEMBRE SINDICATO VILLA POR VENIR',
  idCategoriaOperativo: 0,
  idItemOperativo: 0,
  idUnidad: 0,
  idDistrital: 0,
  idGrupo: 0,
  mando: 'CAP. OSCAR DANIEL CHOQUE ALARCON',
  idPlanOperacion: 0,
  breveDetalle: '',
  descripcion: '',
  idTipoOperacion: 0,
  organizacion: '',
  coordX: -17.78507,
  coordY: -63.1761788,
  clanFamiliar: '',
}

const toStringOrEmpty = (value: unknown) => (value == null ? '' : String(value))

const toNumberOrZero = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const toIsoDate = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toISOString()
  }
  const parsed = new Date(String(value ?? ''))
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString()
  }
  return parsed.toISOString()
}

const mapCasoOperativoToForm = (
  caso: CasoResumen,
  operativo: OperativoResponse | null
): Partial<OperativoPayload> => ({
  numeroOperativo:
    operativo?.numeroOperativo ??
    caso?.numeroOperativo ??
    DEFAULT_VALUES.numeroOperativo,
  idTipoRelevancia: toNumberOrZero(operativo?.idTipoRelevancia),
  idTipoDenuncia: toNumberOrZero(operativo?.idTipoDenuncia),
  idTipoPenal: toNumberOrZero(operativo?.idTipoPenal),
  fechaOperativo: operativo?.fechaOperativo
    ? toDatetimeLocal(new Date(operativo.fechaOperativo))
    : DEFAULT_VALUES.fechaOperativo,
  idDepartamento: toNumberOrZero(operativo?.idDepartamento),
  idProvincia: toNumberOrZero(operativo?.idProvincia),
  idLocalidad: toNumberOrZero(operativo?.idLocalidad),
  lugar: operativo?.lugar ?? '',
  idCategoriaOperativo: toNumberOrZero(operativo?.idCategoriaOperativo),
  idItemOperativo: toNumberOrZero(operativo?.idItemOperativo),
  idUnidad: toNumberOrZero(operativo?.idUnidad),
  idDistrital: toNumberOrZero(operativo?.idDistrital),
  idGrupo: toNumberOrZero(operativo?.idGrupo),
  mando: operativo?.mando ?? '',
  idPlanOperacion: toNumberOrZero(operativo?.idPlanOperacion),
  idTipoOperacion: toNumberOrZero(operativo?.idTipoOperacion),
  clanFamiliar: operativo?.clanFamiliar ?? '',
  organizacion: operativo?.organizacion ?? '',
  coordX: operativo?.coordX ?? DEFAULT_VALUES.coordX,
  coordY: operativo?.coordY ?? DEFAULT_VALUES.coordY,
  breveDetalle: operativo?.breveDetalle ?? operativo?.descripcion ?? '',
  descripcion: operativo?.descripcion ?? operativo?.breveDetalle ?? '',
})

export function DatosGeneralesForm({
  titulo,
  onGuardar,
  onOperativoGuardado,
  cargando = false,
  datosCaso = null,
  tieneOperativo = false,
}: DatosGeneralesFormProps) {
  const searchParams = useSearchParams()
  const { Alerta } = useAlerts()
  const [parametricasBaseListas, setParametricasBaseListas] = useState(false)

  const [opcionesOperativoEn, setOpcionesOperativoEn] = useState<optionType[]>(
    []
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [datosLectura, setDatosLectura] = useState<DatosLectura>({
    numeroInforme: '',
    nombreCaso: '',
    unidad: '',
    distrital: '',
    grupo: '',
    quienRealiza: '',
    celularRealiza: '',
    asignado: '',
    celularAsignado: '',
    fiscal: '',
    celularFiscal: '',
  })
  const {
    departamentos,
    provincias,
    localidades,
    tiposRelevancia,
    tiposDenuncia,
    tiposPenal,
    tiposOperacion,
    planesOperaciones,
    unidadesSiii,
    categoriasOperativo,
    cargarDepartamentos,
    cargarProvincias,
    cargarLocalidades,
    cargarTiposRelevancia,
    cargarTiposDenuncia,
    cargarTiposPenal,
    cargarTiposOperacion,
    cargarPlanesOperaciones,
    cargarUnidadesSiii,
    cargarCategoriasOperativo,
    distritales,
    grupos,
    cargarDistritales,
    cargarGrupos,
  } = useParametricas()

  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm<OperativoPayload>({
    defaultValues: DEFAULT_VALUES,
  })
  const reglaObligatorio = {
    required: 'Campo obligatorio',
    validate: (value: any) => {
      if (typeof value === 'number') return value !== 0 || 'Campo obligatorio'
      return String(value ?? '').trim() !== '' || 'Campo obligatorio'
    },
  }

  const opcionesDepartamento: optionType[] = departamentos.map((d) => ({
    id: String(d.id),
    value: String(d.id),
    label: d.descripcion,
  }))

  const opcionesProvincia: optionType[] = provincias.map((p) => ({
    id: String(p.id),
    value: String(p.id),
    label: p.descripcion,
  }))

  const opcionesMunicipio: optionType[] = localidades.map((l) => ({
    id: String(l.id),
    value: String(l.id),
    label: l.descripcion,
  }))

  const opcionesUnidadEst: optionType[] = unidadesSiii.map((u) => ({
    id: String(u.id),
    value: String(u.id),
    label: u.descripcion,
  }))

  const opcionesDistritalEst: optionType[] = distritales.map((d) => ({
    id: String(d.id),
    value: String(d.id),
    label: d.descripcion,
  }))

  const opcionesGrupoEst: optionType[] = grupos.map((g) => ({
    id: String(g.id),
    value: String(g.id),
    label: g.descripcion,
  }))

  const opcionesRelevancia: optionType[] = tiposRelevancia.map((r) => ({
    id: String(r.id),
    value: String(r.id),
    label: String(r.descripcion ?? ''),
  }))

  const opcionesTipoDenuncia: optionType[] = tiposDenuncia.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: String(t.descripcion ?? ''),
  }))

  const opcionesTipoPenal: optionType[] = tiposPenal.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: String(t.descripcion ?? ''),
  }))

  const opcionesTipoOperativo: optionType[] = tiposOperacion.map((t) => ({
    id: String(t.id),
    value: String(t.id),
    label: String(t.descripcion ?? ''),
  }))

  const opcionesPlan: optionType[] = planesOperaciones.map((p) => ({
    id: String(p.id),
    value: String(p.id),
    label: String(p.nombre ?? ''),
  }))

  const coordX = watch('coordX')
  const coordY = watch('coordY')
  const categoriaOperativoSeleccionada = watch('idCategoriaOperativo')
  const departamentoSeleccionado = watch('idDepartamento')
  const provinciaSeleccionada = watch('idProvincia')
  const unidadSeleccionada = watch('idUnidad')
  const distritalSeleccionado = watch('idDistrital')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const cargandoDesdePropsRef = useRef(false)

  useEffect(() => {
    let activo = true
    const cargarParametricasBase = async () => {
      await Promise.all([
        cargarDepartamentos(),
        cargarTiposRelevancia(),
        cargarTiposDenuncia(),
        cargarTiposPenal(),
        cargarTiposOperacion(),
        cargarPlanesOperaciones(),
        cargarUnidadesSiii(),
        cargarCategoriasOperativo(),
      ])

      if (activo) {
        setParametricasBaseListas(true)
      }
    }

    void cargarParametricasBase()
    return () => {
      activo = false
    }
  }, [
    cargarDepartamentos,
    cargarTiposRelevancia,
    cargarTiposDenuncia,
    cargarTiposPenal,
    cargarTiposOperacion,
    cargarPlanesOperaciones,
    cargarUnidadesSiii,
    cargarCategoriasOperativo,
  ])



  useEffect(() => {
    let activo = true

    const cargarItemsOperativo = async () => {
      const idCategoria = Number(categoriaOperativoSeleccionada)
      
      if (idCategoria <= 0) {
        if (!cargandoDesdePropsRef.current) {
          setOpcionesOperativoEn([])
          setValue('idItemOperativo', 0)
        }
        return
      }

      if (cargandoDesdePropsRef.current) return

      try {
        const respuesta = await GestionOperativoCatalogosService.obtenerItemsOperativo(idCategoria)
        if (!activo || !respuesta?.finalizado) return

        const opciones = respuesta.datos.map((t) => ({
          id: String(t.id),
          value: String(t.id),
          label: t.descripcion,
        }))

        setOpcionesOperativoEn(opciones)
        const idItemActual = Number(getValues('idItemOperativo'))
        const existeItemActual = opciones.some((opcion) => Number(opcion.value) === idItemActual)
        
        if (!existeItemActual) {
          setValue('idItemOperativo', 0)
        }
      } catch {
        setOpcionesOperativoEn([])
        setValue('idItemOperativo', 0)
      }
    }

    void cargarItemsOperativo()

    return () => {
      activo = false
    }
  }, [categoriaOperativoSeleccionada, getValues, setValue])

  useEffect(() => {
    const id = Number(departamentoSeleccionado)
    if (id > 0 && !cargandoDesdePropsRef.current) {
      setValue('idProvincia', 0)
      setValue('idLocalidad', 0)
      void cargarProvincias(id)
    }
  }, [departamentoSeleccionado, setValue, cargarProvincias])

  useEffect(() => {
    const id = Number(provinciaSeleccionada)
    if (id > 0 && !cargandoDesdePropsRef.current) {
      setValue('idLocalidad', 0)
      void cargarLocalidades(id)
    }
  }, [provinciaSeleccionada, setValue, cargarLocalidades])

  useEffect(() => {
    const id = Number(unidadSeleccionada)
    if (id > 0 && !cargandoDesdePropsRef.current) {
      setValue('idDistrital', 0)
      setValue('idGrupo', 0)
      void cargarDistritales(id)
    }
  }, [unidadSeleccionada, setValue, cargarDistritales])

  useEffect(() => {
    const id = Number(distritalSeleccionado)
    if (id > 0 && !cargandoDesdePropsRef.current) {
      setValue('idGrupo', 0)
      void cargarGrupos(id)
    }
  }, [distritalSeleccionado, setValue, cargarGrupos])

  const handleMapClick = (center: [number, number]) => {
    setValue('coordX', center[0])
    setValue('coordY', center[1])
  }

  const buscarDireccion = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=bo`
      )
      const data = await resp.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Error buscando dirección', error)
      Alerta({ mensaje: 'Hubo un error al buscar la dirección', variant: 'error' })
    } finally {
      setIsSearching(false)
    }
  }

  const seleccionarDireccion = (item: any) => {
    setValue('coordX', Number(item.lat))
    setValue('coordY', Number(item.lon))
    setValue('lugar', item.display_name)
    setSearchResults([])
    setSearchQuery('')
    if (mapRef.current) {
      mapRef.current.flyTo([Number(item.lat), Number(item.lon)], 16)
    }
  }

  const handleGuardar = async () => {
    const esValido = await trigger()
    if (!esValido) {
      return
    }

    const payload = getValues()
    const idCaso = Number(searchParams.get('id') ?? 0)

    try {
      if (idCaso > 0) {
        const payloadOperativo: OperativoPayload = {
          numeroOperativo: payload.numeroOperativo,
          idTipoRelevancia: toNumberOrZero(payload.idTipoRelevancia),
          idTipoDenuncia: toNumberOrZero(payload.idTipoDenuncia),
          idTipoPenal: toNumberOrZero(payload.idTipoPenal),
          fechaOperativo: toIsoDate(payload.fechaOperativo),
          idDepartamento: toNumberOrZero(payload.idDepartamento),
          idProvincia: toNumberOrZero(payload.idProvincia),
          idLocalidad: toNumberOrZero(payload.idLocalidad),
          lugar: payload.lugar,
          idCategoriaOperativo: toNumberOrZero(payload.idCategoriaOperativo),
          idItemOperativo: toNumberOrZero(payload.idItemOperativo),
          idUnidad: toNumberOrZero(payload.idUnidad),
          idDistrital: toNumberOrZero(payload.idDistrital),
          idGrupo: toNumberOrZero(payload.idGrupo),
          mando: payload.mando,
          coordX: toNumberOrZero(payload.coordX),
          coordY: toNumberOrZero(payload.coordY),
          idPlanOperacion: toNumberOrZero(payload.idPlanOperacion),
          breveDetalle: payload.breveDetalle,
          descripcion: payload.descripcion || payload.breveDetalle,
          idTipoOperacion: toNumberOrZero(payload.idTipoOperacion),
          organizacion: payload.organizacion,
          clanFamiliar: payload.clanFamiliar,
        }

        if (tieneOperativo) {
          await GestionOperativosDatosGeneralesService.actualizarOperativo(
            idCaso,
            payloadOperativo
          )
          Alerta({
            mensaje: 'Operativo actualizado correctamente',
            variant: 'success',
          })
        } else {
          await GestionOperativosDatosGeneralesService.crearOperativo(
            idCaso,
            payloadOperativo
          )
          Alerta({
            mensaje: 'Operativo guardado correctamente',
            variant: 'success',
          })
        }
        onOperativoGuardado?.()
        return
      }

      await onGuardar(payload as unknown as SeccionPayloadBase)
      Alerta({ mensaje: 'Datos guardados correctamente', variant: 'success' })
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    }
  }

  useEffect(() => {
    if (!parametricasBaseListas || !datosCaso) return
    const caso = datosCaso.caso
    const operativo = datosCaso.operativos?.[0] ?? null
    const mapped = mapCasoOperativoToForm(caso, operativo)

    setDatosLectura({
      numeroInforme: '',
      nombreCaso: caso?.nombreCaso ?? '',
      unidad: caso?.asignadoCaso ?? '',
      distrital: toStringOrEmpty(
        operativo?.idDistrital ?? caso?.telefonoSolicitud
      ),
      grupo: toStringOrEmpty(operativo?.idGrupo ?? caso?.telefonoSolicitud),
      quienRealiza: caso?.fiscalSolicitud ?? '',
      celularRealiza: caso?.telefonoSolicitud ?? '',
      asignado: caso?.asignadoCaso ?? '',
      celularAsignado: caso?.telefonoAsignado ?? '',
      fiscal: caso?.fiscalAsignadoCaso ?? '',
      celularFiscal: caso?.telefonoFiscal ?? '',
    })

    void (async () => {
      // Bloquea temporalmente los useEffect de cascada para evitar limpiezas
      cargandoDesdePropsRef.current = true

      const idDepto = Number(mapped.idDepartamento)
      const idProv = Number(mapped.idProvincia)
      const idUnidad = Number(mapped.idUnidad)
      const idDistrital = Number(mapped.idDistrital)
      const idCategoria = Number(mapped.idCategoriaOperativo)

      // Cargar primer nivel de dependencias (para no chocar estados de limpieza sincrona)
      await Promise.all([
        idDepto > 0 ? cargarProvincias(idDepto) : Promise.resolve(),
        idUnidad > 0 ? cargarDistritales(idUnidad) : Promise.resolve(),
      ])

      // Cargar segundo nivel de dependencias e items
      await Promise.all([
        idProv > 0 ? cargarLocalidades(idProv) : Promise.resolve(),
        idDistrital > 0 ? cargarGrupos(idDistrital) : Promise.resolve(),
        idCategoria > 0
          ? (async () => {
              try {
                const res = await GestionOperativoCatalogosService.obtenerItemsOperativo(idCategoria)
                if (res?.finalizado) {
                  setOpcionesOperativoEn(
                    res.datos.map((t) => ({
                      id: String(t.id),
                      value: String(t.id),
                      label: t.descripcion,
                    }))
                  )
                }
              } catch {
                setOpcionesOperativoEn([])
              }
            })()
          : Promise.resolve(),
      ])

      // Todas las opciones ya están precargadas.
      // Hacer reset emparejará los values exactos en la UI porque las etiquetas ya existen en el render
      reset({ ...DEFAULT_VALUES, ...mapped })

      // Liberar el bloqueo después del ciclo de render de react-hook-form
      setTimeout(() => {
        cargandoDesdePropsRef.current = false
      }, 300)
    })()
  }, [
    datosCaso,
    parametricasBaseListas,
    reset,
    setValue,
    cargarProvincias,
    cargarLocalidades,
    cargarDistritales,
    cargarGrupos,
  ])

  if (!parametricasBaseListas) {
    return <FullScreenLoading mensaje="Cargando parámetros del formulario..." />
  }

  return (
    <div>
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <h4 className="mb-4 text-sm font-semibold">{titulo}</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="numeroOperativo"
              className="mb-1 block text-sm font-medium"
            >
              Número de Operativo <span className="text-danger">*</span>
            </label>
            <input
              id="numeroOperativo"
              type="text"
              className={`form-input w-full ${errors.numeroOperativo ? 'border-danger' : ''}`}
              {...register('numeroOperativo', reglaObligatorio)}
            />
            {errors.numeroOperativo && (
              <div className="mt-1 text-xs text-danger">
                {errors.numeroOperativo.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="idTipoRelevancia"
              className="mb-1 block text-sm font-medium"
            >
              Relevancia <span className="text-danger">*</span>
            </label>
            <select
              id="idTipoRelevancia"
              className={`form-select w-full ${errors.idTipoRelevancia ? 'border-danger' : ''}`}
              {...register('idTipoRelevancia', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {opcionesRelevancia.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idTipoRelevancia && (
              <div className="mt-1 text-xs text-danger">
                {errors.idTipoRelevancia.message}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Número de Informe
            </label>
            <input
              className="form-input w-full"
              value={datosLectura.numeroInforme}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nombre del Caso
            </label>
            <input
              className="form-input w-full"
              value={datosLectura.nombreCaso}
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Asignado al Caso
            </label>
            <input
              className="form-input w-full"
              value={datosLectura.asignado}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nro. Celular
            </label>
            <input
              className="form-input w-full"
              value={datosLectura.celularAsignado}
              disabled
              readOnly
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Fiscal Asignado
            </label>
            <input
              className="form-input w-full"
              value={datosLectura.fiscal}
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Quién Realiza la Solicitud
            </label>
            <input
              className="form-input w-full"
              value={datosLectura.quienRealiza}
              disabled
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="idUnidad"
              className="mb-2 block text-sm font-medium"
            >
              Unidad <span className="text-danger">*</span>
            </label>
            <select
              id="idUnidad"
              className={`form-select w-full ${errors.idUnidad ? 'border-danger' : ''}`}
              {...register('idUnidad', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {opcionesUnidadEst.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idUnidad && (
              <div className="mt-1 text-xs text-danger">
                {errors.idUnidad.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="idDistrital"
              className="mb-2 block text-sm font-medium"
            >
              Distrital <span className="text-danger">*</span>
            </label>
            <select
              id="idDistrital"
              className={`form-select w-full ${errors.idDistrital ? 'border-danger' : ''}`}
              {...register('idDistrital', { ...reglaObligatorio, valueAsNumber: true })}
              disabled={opcionesDistritalEst.length === 0}
            >
              <option value="">Seleccione un dato</option>
              {opcionesDistritalEst.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idDistrital && (
              <div className="mt-1 text-xs text-danger">
                {errors.idDistrital.message}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="idGrupo" className="mb-2 block text-sm font-medium">
              Grupo <span className="text-danger">*</span>
            </label>
            <select
              id="idGrupo"
              className={`form-select w-full ${errors.idGrupo ? 'border-danger' : ''}`}
              {...register('idGrupo', { ...reglaObligatorio, valueAsNumber: true })}
              disabled={opcionesGrupoEst.length === 0}
            >
              <option value="">Seleccione un dato</option>
              {opcionesGrupoEst.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idGrupo && (
              <div className="mt-1 text-xs text-danger">
                {errors.idGrupo.message}
              </div>
            )}
          </div>
          <div className="hidden lg:block"></div>

          <div>
            <label
              htmlFor="idTipoDenuncia"
              className="mb-1 block text-sm font-medium"
            >
              Tipo de la Denuncia <span className="text-danger">*</span>
            </label>
            <select
              id="idTipoDenuncia"
              className={`form-select w-full ${errors.idTipoDenuncia ? 'border-danger' : ''}`}
              {...register('idTipoDenuncia', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {opcionesTipoDenuncia.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idTipoDenuncia && (
              <div className="mt-1 text-xs text-danger">
                {errors.idTipoDenuncia.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="idTipoPenal"
              className="mb-1 block text-sm font-medium"
            >
              Tipo Penal <span className="text-danger">*</span>
            </label>
            <select
              id="idTipoPenal"
              className={`form-select w-full ${errors.idTipoPenal ? 'border-danger' : ''}`}
              {...register('idTipoPenal', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {opcionesTipoPenal.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idTipoPenal && (
              <div className="mt-1 text-xs text-danger">
                {errors.idTipoPenal.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="fechaOperativo"
              className="mb-1 block text-sm font-medium"
            >
              Fecha y Hora del Operativo <span className="text-danger">*</span>
            </label>
            <input
              id="fechaOperativo"
              type="datetime-local"
              className={`form-input w-full ${errors.fechaOperativo ? 'border-danger' : ''}`}
              {...register('fechaOperativo', reglaObligatorio)}
            />
            {errors.fechaOperativo && (
              <div className="mt-1 text-xs text-danger">
                {errors.fechaOperativo.message}
              </div>
            )}
          </div>
          <div className="hidden lg:block"></div>
          <div>
            <label
              htmlFor="idDepartamento"
              className="mb-1 block text-sm font-medium"
            >
              Departamento <span className="text-danger">*</span>
            </label>
            <select
              id="idDepartamento"
              className={`form-select w-full ${errors.idDepartamento ? 'border-danger' : ''}`}
              {...register('idDepartamento', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {opcionesDepartamento.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idDepartamento && (
              <div className="mt-1 text-xs text-danger">
                {errors.idDepartamento.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="idProvincia"
              className="mb-1 block text-sm font-medium"
            >
              Provincia <span className="text-danger">*</span>
            </label>
            <select
              id="idProvincia"
              className={`form-select w-full ${errors.idProvincia ? 'border-danger' : ''}`}
              {...register('idProvincia', { ...reglaObligatorio, valueAsNumber: true })}
              disabled={opcionesProvincia.length === 0}
            >
              <option value="">Seleccione un dato</option>
              {opcionesProvincia.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idProvincia && (
              <div className="mt-1 text-xs text-danger">
                {errors.idProvincia.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="idLocalidad"
              className="mb-1 block text-sm font-medium"
            >
              Municipio <span className="text-danger">*</span>
            </label>
            <select
              id="idLocalidad"
              className={`form-select w-full ${errors.idLocalidad ? 'border-danger' : ''}`}
              {...register('idLocalidad', { ...reglaObligatorio, valueAsNumber: true })}
              disabled={opcionesMunicipio.length === 0}
            >
              <option value="">Seleccione un dato</option>
              {opcionesMunicipio.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idLocalidad && (
              <div className="mt-1 text-xs text-danger">
                {errors.idLocalidad.message}
              </div>
            )}
          </div>

          <div className="col-span-1 lg:col-span-4">
            <div>
              <label htmlFor="lugar" className="mb-1 block text-sm font-medium">
                En la localidad, comunidad, dirección (Zona, Calle, Avenida,
                Barrio) <span className="text-danger">*</span>
              </label>
              <input
                id="lugar"
                type="text"
                className={`form-input w-full ${errors.lugar ? 'border-danger' : ''}`}
                {...register('lugar', reglaObligatorio)}
              />
              {errors.lugar && (
                <div className="mt-1 text-xs text-danger">
                  {errors.lugar.message}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="idCategoriaOperativo"
              className="mb-1 block text-sm font-medium"
            >
              Categoría Operativo <span className="text-danger">*</span>
            </label>
            <select
              id="idCategoriaOperativo"
              className={`form-select w-full ${errors.idCategoriaOperativo ? 'border-danger' : ''}`}
              {...register('idCategoriaOperativo', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {categoriasOperativo.map((cat) => (
                <option key={cat.id} value={Number(cat.id)}>
                  {cat.descripcion}
                </option>
              ))}
            </select>
            {errors.idCategoriaOperativo && (
              <div className="mt-1 text-xs text-danger">
                {errors.idCategoriaOperativo.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="idItemOperativo"
              className="mb-1 block text-sm font-medium"
            >
              Operativo Realizado en <span className="text-danger">*</span>
            </label>
            <select
              id="idItemOperativo"
              className={`form-select w-full ${errors.idItemOperativo ? 'border-danger' : ''}`}
              {...register('idItemOperativo', { ...reglaObligatorio, valueAsNumber: true })}
              disabled={opcionesOperativoEn.length === 0}
            >
              <option value="">Seleccione un dato</option>
              {opcionesOperativoEn.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idItemOperativo && (
              <div className="mt-1 text-xs text-danger">
                {errors.idItemOperativo.message}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="mando" className="mb-1 block text-sm font-medium">
              Al Mando de <span className="text-danger">*</span>
            </label>
            <input
              id="mando"
              type="text"
              className={`form-input w-full ${errors.mando ? 'border-danger' : ''}`}
              {...register('mando', reglaObligatorio)}
            />
            {errors.mando && (
              <div className="mt-1 text-xs text-danger">
                {errors.mando.message}
              </div>
            )}
          </div>
          <div className="hidden lg:block"></div>
          <div>
            <label
              htmlFor="idPlanOperacion"
              className="mb-1 block text-sm font-medium"
            >
              Plan de Operaciones <span className="text-danger">*</span>
            </label>
            <select
              id="idPlanOperacion"
              className={`form-select w-full ${errors.idPlanOperacion ? 'border-danger' : ''}`}
              {...register('idPlanOperacion', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {opcionesPlan.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idPlanOperacion && (
              <div className="mt-1 text-xs text-danger">
                {errors.idPlanOperacion.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="idTipoOperacion"
              className="mb-1 block text-sm font-medium"
            >
              El Operativo es de Tipo <span className="text-danger">*</span>
            </label>
            <select
              id="idTipoOperacion"
              className={`form-select w-full ${errors.idTipoOperacion ? 'border-danger' : ''}`}
              {...register('idTipoOperacion', { ...reglaObligatorio, valueAsNumber: true })}
            >
              <option value="">Seleccione un dato</option>
              {opcionesTipoOperativo.map((opt) => (
                <option key={opt.id} value={Number(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.idTipoOperacion && (
              <div className="mt-1 text-xs text-danger">
                {errors.idTipoOperacion.message}
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="clanFamiliar"
              className="mb-1 block text-sm font-medium"
            >
              Clan Familiar <span className="text-danger">*</span>
            </label>
            <input
              id="clanFamiliar"
              type="text"
              className={`form-input w-full ${errors.clanFamiliar ? 'border-danger' : ''}`}
              {...register('clanFamiliar', reglaObligatorio)}
            />
            {errors.clanFamiliar && (
              <div className="mt-1 text-xs text-danger">
                {errors.clanFamiliar.message}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="organizacion"
              className="mb-1 block text-sm font-medium"
            >
              Organización Criminal <span className="text-danger">*</span>
            </label>
            <input
              id="organizacion"
              type="text"
              className={`form-input w-full ${errors.organizacion ? 'border-danger' : ''}`}
              {...register('organizacion', reglaObligatorio)}
            />
            {errors.organizacion && (
              <div className="mt-1 text-xs text-danger">
                {errors.organizacion.message}
              </div>
            )}
          </div>
          <div className="hidden lg:block"></div>

          <div className="col-span-1 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="coordX"
                className="mb-1 block text-sm font-medium"
              >
                Latitud <span className="text-danger">*</span>
              </label>
              <input
                id="coordX"
                type="text"
                className={`form-input w-full ${errors.coordX ? 'border-danger' : ''}`}
                {...register('coordX', reglaObligatorio)}
              />
              {errors.coordX && (
                <div className="mt-1 text-xs text-danger">
                  {errors.coordX.message}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="coordY"
                className="mb-1 block text-sm font-medium"
              >
                Longitud <span className="text-danger">*</span>
              </label>
              <input
                id="coordY"
                type="text"
                className={`form-input w-full ${errors.coordY ? 'border-danger' : ''}`}
                {...register('coordY', reglaObligatorio)}
              />
              {errors.coordY && (
                <div className="mt-1 text-xs text-danger">
                  {errors.coordY.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 mt-4">
            <div className="flex gap-2 mb-2 relative">
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Buscar dirección, zona o calle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void buscarDireccion()
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-inline"
                onClick={() => void buscarDireccion()}
                disabled={isSearching}
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>

              {searchResults.length > 0 && (
                <ul className="absolute top-full left-0 mt-1 z-[1000] w-full bg-white dark:bg-[#1b2e4b] border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-md shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((item, idx) => (
                    <li
                      key={idx}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-sm"
                      onClick={() => seleccionarDireccion(item)}
                    >
                      {item.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <MapaConMarcador
              id="mapa-operativo-seccion-1"
              mapRef={mapRef}
              centro={[
                Number(coordX) || -17.78507,
                Number(coordY) || -63.1761788,
              ]}
              zoom={15.63}
              height={400}
              onClick={handleMapClick}
              coordenadas={
                coordX && coordY
                  ? [Number(coordX), Number(coordY)]
                  : null
              }
            />
          </div>

          <div className="col-span-1 lg:col-span-4 mt-4">
            <div>
              <label
                htmlFor="breveDetalle"
                className="mb-1 block text-sm font-medium"
              >
                Breve Detalle del Operativo <span className="text-danger">*</span>
              </label>
              <textarea
                id="breveDetalle"
                className={`form-textarea w-full ${errors.breveDetalle ? 'border-danger text-danger' : ''}`}
                rows={6}
                {...register('breveDetalle', reglaObligatorio)}
              />
              {errors.breveDetalle && (
                <div className="mt-1 text-xs text-danger">
                  {errors.breveDetalle.message}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 mt-2 lg:col-span-3">
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => void handleGuardar()}
              disabled={cargando}
            >
              {tieneOperativo ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
