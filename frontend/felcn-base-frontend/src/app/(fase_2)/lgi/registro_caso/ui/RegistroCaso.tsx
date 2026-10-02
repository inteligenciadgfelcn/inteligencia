'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { RHFSelect } from '@/components/form/RHFSelect'
import { RHFDate } from '@/components/form/RHFDate'

import { PersonasInvestigadas } from '../../caso_detalle/ui/PersonasInvestigadas'

import type {
  DepartamentoLgi,
  DistritalLgi,
  GrupoLgi,
  InicioCasoLgi,
} from '../../(parametricas)/types/parametricas.types'
import { ParametricasLgiApi } from '../../(parametricas)/api/parametricas.api'
import { RegistroCasoApi } from '../api/registro-caso.api'
import {
  buildDatosGeneralesPayload,
  buscarDistritalPorId,
  buscarGrupoPorDescripcion,
  buscarInicioCasoPorDescripcion,
  codigoDepartamento,
  mapDepartamentoToOption,
  mapDistritalToOption,
  mapGrupoToOption,
  mapInicioCasoToOption,
} from '../mappers/registro-caso.mappers'
import {
  datosGeneralesSchema,
  informacionCasoSchema,
  type DatosGeneralesSchemaValues,
  type InformacionCasoSchemaValues,
} from '../schemas/registro-caso.schema'
import type {
  AsignacionLgiDetalle,
  CatalogOption,
} from '../types/registro-caso.types'
import type { ConsultaSiiiQueryDto } from '../types/siii.types'
import { createDefaultDatosGeneralesValues } from '../utils/registro-caso.utils'
import { ResultadosBusquedaSiii } from './ResultadosBusquedaSiii'
import { CasosRelacionados } from './CasosRelacionados'
import { InvestigadoresDataTable } from './InvestigadoresDataTable'
import { InvestigadorCombobox } from '../../components/InvestigadorCombobox'
import { abrirPdfEnNuevaPestana } from '@/utils/peticion'
import { obtenerUltimoCodigoServicioActivo } from '../../../inteligencia/servicio/services/servicio.service'

type TabKey =
  | 'datos-generales'
  | 'personas'
  | 'informacion-caso'
  | 'investigadores'

type Modo = 'nuevo' | 'editar' | 'ver'

interface BusquedaSiiiFiltros {
  fechaInicio: string
  fechaFin: string
  nombreCaso: string
  nombresPersona: string
  apellidoPaterno: string
  apellidoMaterno: string
  nroDocumento: string
}

interface Props {
  casoId?: string | null
  modo?: Modo
}

const FORMAS_INICIO = [
  'Remisión fiscalía',
  'Por denuncia',
  'Reporte inteligencia',
]

const formaInicioToOption = (value: string): CatalogOption<string> => ({
  value,
  label: value,
  original: value,
})

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'datos-generales', label: 'Datos generales del caso' },
  { key: 'personas', label: 'Personas investigadas' },
  { key: 'informacion-caso', label: 'Antecedentes del caso' },
  { key: 'investigadores', label: 'Investigadores asignados' },
]

export function RegistroCaso({ casoId, modo = 'nuevo' }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const isLectura = modo === 'ver'
  const casoActivo = casoId ? Number(casoId) : null

  const [activeTab, setActiveTab] = useState<TabKey>('datos-generales')
  const [casoActivoId, setCasoActivoId] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [generandoNumero, setGenerandoNumero] = useState(false)
  const [conformeAValue, setConformeAValue] = useState('')
  const [filtroSiii, setFiltroSiii] = useState<ConsultaSiiiQueryDto | null>(
    null
  )

  const casoIdEfectivo = casoActivo ?? casoActivoId

  // ── Catálogos ────────────────────────────────────────────────────────────────
  const { data: distritales = [] } = useQuery<DistritalLgi[]>({
    queryKey: ['lgi-registro-caso', 'distritales'],
    queryFn: () => ParametricasLgiApi.listarDistritales(),
  })

  const { data: departamentos = [] } = useQuery<DepartamentoLgi[]>({
    queryKey: ['lgi-registro-caso', 'departamentos'],
    queryFn: () => ParametricasLgiApi.listarDepartamentos(),
  })

  const { data: iniciosCaso = [] } = useQuery<InicioCasoLgi[]>({
    queryKey: ['lgi-registro-caso', 'inicios-caso'],
    queryFn: () => ParametricasLgiApi.listarIniciosCaso(),
  })

  // ── Caso a editar ────────────────────────────────────────────────────────────
  const {
    data: caso,
    isLoading: isLoadingCaso,
    isError: isErrorCaso,
    error: errorCaso,
  } = useQuery<AsignacionLgiDetalle>({
    queryKey: ['lgi-registro-caso', 'caso', casoId],
    queryFn: () => RegistroCasoApi.obtenerCaso(casoId!),
    enabled: Boolean(casoId),
  })

  // ── Formulario datos generales ───────────────────────────────────────────────
  const datosForm = useForm<DatosGeneralesSchemaValues>({
    resolver: zodResolver(datosGeneralesSchema),
    defaultValues: createDefaultDatosGeneralesValues(),
  })

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    resetField,
    reset,
    formState: { errors },
  } = datosForm

  useEffect(() => {
    if (casoId) return
    void obtenerUltimoCodigoServicioActivo().then((codigo) => {
      if (codigo) setValue('codigoServicio', codigo)
    })
  }, [casoId, setValue])

  // Solo se hidrata una vez por caso: evita que un refetch de catálogos pise
  // lo que el usuario ya está editando.
  const casoHidratadoRef = useRef<string | null>(null)

  useEffect(() => {
    if (!casoId || !caso) return
    if (!distritales.length || !departamentos.length || !iniciosCaso.length) {
      return
    }
    if (casoHidratadoRef.current === casoId) return
    casoHidratadoRef.current = casoId

    const departamento = departamentos.find(
      (item) => codigoDepartamento(item) === caso.dptoavId
    )


    console.log('Aqui vienen el useEffect');
    console.log(caso);


    reset({
      ...createDefaultDatosGeneralesValues(),
      disId: buscarDistritalPorId(distritales, caso.disId),
      departamento: departamento ? mapDepartamentoToOption(departamento) : null,
      inicioCaso: buscarInicioCasoPorDescripcion(iniciosCaso, caso.inicioCaso),
      nombreCaso: caso.nombreCaso || '',
      nroCaso: caso.nroCaso || caso.nroCasoGiaef || '',
      nroCasoFis: caso.nroCasoFis || caso.cudifp || '',
      remiteFiscal: caso.remiteFiscal || '',
      conformeA: caso.conformeA || '',
      controlJurisdiccional: caso.controlJurisdiccional || '',
      fechaInicio: caso.fechaInicio
        ? dayjs(caso.fechaInicio).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      codigoServicio: caso.codigoServicio || '',
    })

    setConformeAValue(caso.conformeA || '')
  }, [caso, casoId, departamentos, distritales, iniciosCaso, reset])

  const disIdSeleccionado = useWatch({
    control,
    name: 'disId',
  }) as CatalogOption<DistritalLgi> | null

  const { data: grupos = [] } = useQuery<GrupoLgi[]>({
    queryKey: ['lgi-registro-caso', 'grupos', disIdSeleccionado?.value ?? ''],
    enabled: Boolean(disIdSeleccionado?.value),
    queryFn: () =>
      ParametricasLgiApi.listarGrupos(Number(disIdSeleccionado!.value)),
  })

  // El puesto avanzado llega como `descripcionGrupo` (texto), no como id: se
  // resuelve contra el catálogo de grupos de la distrital ya seleccionada.
  // Solo se aplica una vez por distrital y nunca después de que el usuario
  // elija otra, para no pisear su selección.
  const distritalCambiadaPorUsuarioRef = useRef(false)
  const grupoResueltoParaDistritalRef = useRef<string | null>(null)

  useEffect(() => {
    if (distritalCambiadaPorUsuarioRef.current) return
    if (!caso?.descripcionGrupo || !grupos.length) return

    const distritalActual = String(disIdSeleccionado?.value ?? '')
    if (!distritalActual) return
    if (grupoResueltoParaDistritalRef.current === distritalActual) return
    grupoResueltoParaDistritalRef.current = distritalActual

    const grupoNombre = caso?.descripcionGrupo || caso?.puesto || ''
    const grupo = buscarGrupoPorDescripcion(grupos, grupoNombre)
    if (grupo) setValue('idGrupo', grupo)
  }, [
    caso?.descripcionGrupo,
    caso?.puesto,
    grupos,
    disIdSeleccionado?.value,
    setValue,
  ])

  const onCambiarDistrital = () => {
    distritalCambiadaPorUsuarioRef.current = true
    grupoResueltoParaDistritalRef.current = null
    resetField('idGrupo')
  }

  const onGenerarNumero = async () => {
    const { departamento } = getValues()
    const codigo = departamento?.value
    if (!codigo) return
    setGenerandoNumero(true)
    try {
      const numero = await RegistroCasoApi.generarNumero(codigo, 'LGI')
      setValue('nroCaso', numero, { shouldValidate: true })
    } finally {
      setGenerandoNumero(false)
    }
  }

  // ── Formulario información del caso ────────────────────────────────────────
  const informacionForm = useForm<InformacionCasoSchemaValues>({
    resolver: zodResolver(informacionCasoSchema),
    defaultValues: {
      formaInicio: null,
      nroCasoFelcn: '',
    },
  })

  const {
    register: registerInformacion,
    control: controlInformacion,
    handleSubmit: handleSubmitInformacion,
    formState: { errors: errorsInformacion },
  } = informacionForm

  const onSubmitInformacion = () => {
    setActiveTab('investigadores')
  }

  // ── Búsqueda avanzada SIII ─────────────────────────────────────────────────
  const filtroSiiiForm = useForm<BusquedaSiiiFiltros>({
    defaultValues: {
      fechaInicio: '',
      fechaFin: '',
      nombreCaso: '',
      nombresPersona: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      nroDocumento: '',
    },
  })

  const {
    register: registerFiltroSiii,
    control: controlFiltroSiii,
  } = filtroSiiiForm

  const onBuscarSiii = () => {
    const valores = filtroSiiiForm.getValues()
    setFiltroSiii({
      numeroCaso: informacionForm.getValues('nroCasoFelcn') || undefined,
      fechaInicio: valores.fechaInicio || undefined,
      fechaFin: valores.fechaFin || undefined,
      nombreCaso: valores.nombreCaso || undefined,
      nombresPersona: valores.nombresPersona || undefined,
      apellidoPaterno: valores.apellidoPaterno || undefined,
      apellidoMaterno: valores.apellidoMaterno || undefined,
      nroDocumento: valores.nroDocumento || undefined,
    })
  }

  const onSubmitDatosGenerales = async (values: DatosGeneralesSchemaValues) => {
    setIsSaving(true)
    setMensaje(null)
    try {
      const payload = buildDatosGeneralesPayload(values)
      if (casoId) {
        await RegistroCasoApi.actualizarDatosGenerales(casoId, payload)
        setMensaje('Datos generales actualizados correctamente')
      } else {
        const respuesta = await RegistroCasoApi.crearDatosGenerales(payload)
        setCasoActivoId(respuesta.id)
        setMensaje('Datos generales registrados correctamente')
        setActiveTab('personas')
      }
      queryClient.invalidateQueries({ queryKey: ['lgi-listado-casos'] })
      if (casoId) {
        queryClient.invalidateQueries({
          queryKey: ['lgi-registro-caso', 'caso', casoId],
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (casoId && isLoadingCaso) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Cargando datos del caso...</p>
      </div>
    )
  }

  if (casoId && isErrorCaso) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-red-500">
          Error al cargar el caso: {errorCaso?.message ?? 'Error desconocido'}
        </p>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => router.push('/lgi/listado_casos')}
        >
          Volver al listado
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {modo === 'nuevo'
                ? 'Nuevo caso'
                : isLectura
                  ? 'Ver caso'
                  : 'Editar caso'}
            </p>
            <h2 className="mt-1 text-xl font-bold text-dark dark:text-white-light">
              {caso?.nombreCaso || 'Registro de caso LGI'}
            </h2>
            {casoIdEfectivo && (
              <p className="mt-1 text-sm text-gray-500">ID {casoIdEfectivo}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => router.push('/lgi/listado_casos')}
            >
              Volver al listado
            </Button>
            {casoIdEfectivo && (
              <Button
                type="button"
                variant="outline-primary"
                onClick={() =>
                  void abrirPdfEnNuevaPestana(RegistroCasoApi.exportarInicioPdf)
                }
              >
                Vista previa
              </Button>
            )}
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          {mensaje}
        </div>
      )}

      <div className="panel p-0">
        <div className="border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
          <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const active = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'datos-generales' && (
            <form
              onSubmit={handleSubmit(onSubmitDatosGenerales)}
              className="space-y-4"
            >
              <Card title="Datos de origen y asignación">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <RHFSelect<DistritalLgi>
                    id="disId"
                    name="disId"
                    control={control}
                    label="División Regional"
                    error={errors.disId?.message as string | undefined}
                    isDisable={isLectura}
                    originalData={distritales}
                    mapOption={mapDistritalToOption}
                    onValueChange={onCambiarDistrital}
                  />

                  <RHFSelect<GrupoLgi>
                    id="idGrupo"
                    name="idGrupo"
                    control={control}
                    label="Puesto avanzado"
                    error={errors.idGrupo?.message as string | undefined}
                    isDisable={isLectura || !disIdSeleccionado}
                    originalData={grupos}
                    mapOption={mapGrupoToOption}
                  />

                  <RHFSelect<DepartamentoLgi>
                    id="departamento"
                    name="departamento"
                    control={control}
                    label="Departamento"
                    error={errors.departamento?.message as string | undefined}
                    isDisable={isLectura}
                    originalData={departamentos}
                    mapOption={mapDepartamentoToOption}
                  />

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Responsable del llenado
                    </label>
                    <InvestigadorCombobox
                      id="conformeA"
                      value={conformeAValue}
                      disabled={isLectura}
                      placeholder="Busque un investigador..."
                      error={errors.conformeA?.message as string | undefined}
                      onInputChange={(value) => {
                        setConformeAValue(value)
                        setValue('conformeA', value, { shouldValidate: true })
                      }}
                      onSelect={(inv) => {
                        const nombre = inv.investigador
                        setConformeAValue(nombre)
                        setValue('conformeA', nombre, { shouldValidate: true })
                      }}
                    />
                    {errors.conformeA && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.conformeA.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Nombre del caso
                    </label>
                    <Input
                      {...register('nombreCaso')}
                      disabled={isLectura}
                      error={!!errors.nombreCaso}
                      className="w-full"
                      placeholder="Nombre del caso"
                    />
                    {errors.nombreCaso && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.nombreCaso.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Nro de caso asignado
                    </label>
                    <div className="flex gap-2">
                      <Input
                        {...register('nroCaso')}
                        disabled={isLectura}
                        error={!!errors.nroCaso}
                        className="w-full"
                        placeholder="LP-LGI-1/26"
                      />
                      {!isLectura && (
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="sm"
                          loading={generandoNumero}
                          onClick={onGenerarNumero}
                        >
                          Generar
                        </Button>
                      )}
                    </div>
                    {errors.nroCaso && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.nroCaso.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      CUD
                    </label>
                    <Input
                      {...register('nroCasoFis')}
                      disabled={isLectura}
                      error={!!errors.nroCasoFis}
                      className="w-full"
                      placeholder="CUD"
                    />
                    {errors.nroCasoFis && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.nroCasoFis.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      CUD Inv. Paralela
                    </label>
                    <Input
                      {...register('cudifp')}
                      disabled={isLectura}
                      error={!!errors.cudifp}
                      className="w-full"
                      placeholder=""
                    />
                    {errors.cudifp && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.cudifp.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Fiscal asignado
                    </label>
                    <Input
                      {...register('remiteFiscal')}
                      disabled={isLectura}
                      error={!!errors.remiteFiscal}
                      className="w-full"
                      placeholder="Nombre del fiscal"
                    />
                    {errors.remiteFiscal && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.remiteFiscal.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Control jurisdiccional
                    </label>
                    <Input
                      {...register('controlJurisdiccional')}
                      disabled={isLectura}
                      error={!!errors.controlJurisdiccional}
                      className="w-full"
                      placeholder="Juzgado de instrucción penal"
                    />
                    {errors.controlJurisdiccional && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.controlJurisdiccional.message}
                      </p>
                    )}
                  </div>

                  <RHFDate
                    id="fechaInicio"
                    name="fechaInicio"
                    control={control}
                    label="Fecha de inicio"
                    disabled={isLectura}
                  />

                  <RHFSelect<InicioCasoLgi>
                    id="inicioCaso"
                    name="inicioCaso"
                    control={control}
                    label="Forma de inicio del caso"
                    error={errors.inicioCaso?.message as string | undefined}
                    isDisable={isLectura}
                    originalData={iniciosCaso}
                    mapOption={mapInicioCasoToOption}
                  />

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Código de servicio
                    </label>
                    <Input
                      {...register('codigoServicio')}
                      disabled={true}
                      error={!!errors.codigoServicio}
                      className="w-full"
                    />
                    {errors.codigoServicio && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.codigoServicio.message}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {!isLectura && (
                <div className="flex flex-col gap-3 rounded-md border border-dashed border-[#e0e6ed] bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] md:flex-row md:items-center md:justify-end">
                  <Button type="submit" variant="primary" loading={isSaving}>
                    {casoId
                      ? 'Actualizar datos generales'
                      : 'Registrar caso y continuar'}
                  </Button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'personas' && (
            <div className="space-y-4">
              {!casoIdEfectivo ? (
                <Card title="Personas investigadas">
                  <p className="text-sm text-gray-500">
                    Primero registre los datos generales del caso para poder
                    agregar personas investigadas.
                  </p>
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setActiveTab('datos-generales')}
                    >
                      Ir a datos generales
                    </Button>
                  </div>
                </Card>
              ) : (
                <>
                  <PersonasInvestigadas
                    casoId={casoIdEfectivo}
                    isLectura={isLectura}
                  />
                  {!isLectura && (
                    <div className="flex flex-col gap-3 rounded-md border border-dashed border-[#e0e6ed] bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] md:flex-row md:items-center md:justify-end">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => setActiveTab('datos-generales')}
                      >
                        Volver
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setActiveTab('informacion-caso')}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'informacion-caso' && (
            <div className="space-y-4">
              <Card title="Búsqueda avanzada de SSCC">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <RHFDate
                    id="filtroFechaInicio"
                    name="fechaInicio"
                    control={controlFiltroSiii}
                    label="Fecha operativo desde"
                    disabled={isLectura}
                  />

                  <RHFDate
                    id="filtroFechaFin"
                    name="fechaFin"
                    control={controlFiltroSiii}
                    label="Fecha operativo hasta"
                    disabled={isLectura}
                  />

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Nombre del caso
                    </label>
                    <Input
                      {...registerFiltroSiii('nombreCaso')}
                      disabled={isLectura}
                      className="w-full"
                      placeholder="Nombre del caso"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Nombres persona
                    </label>
                    <Input
                      {...registerFiltroSiii('nombresPersona')}
                      disabled={isLectura}
                      className="w-full"
                      placeholder="Nombres de la persona implicada"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Apellido paterno
                    </label>
                    <Input
                      {...registerFiltroSiii('apellidoPaterno')}
                      disabled={isLectura}
                      className="w-full"
                      placeholder="Apellido paterno"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Apellido materno
                    </label>
                    <Input
                      {...registerFiltroSiii('apellidoMaterno')}
                      disabled={isLectura}
                      className="w-full"
                      placeholder="Apellido materno"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                      Nro documento
                    </label>
                    <Input
                      {...registerFiltroSiii('nroDocumento')}
                      disabled={isLectura}
                      className="w-full"
                      placeholder="Nro de documento"
                    />
                  </div>
                </div>

                {!isLectura && (
                  <div className="mt-4 flex justify-end gap-3">
                    {filtroSiii && (
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => setFiltroSiii(null)}
                      >
                        Limpiar búsqueda
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="primary"
                      onClick={onBuscarSiii}
                    >
                      Buscar
                    </Button>
                  </div>
                )}
              </Card>

              {filtroSiii ? (
                <ResultadosBusquedaSiii
                  filtro={filtroSiii}
                  casoId={casoIdEfectivo}
                  isLectura={isLectura}
                />
              ) : (
                <CasosRelacionados
                  casoId={casoIdEfectivo}
                  isLectura={isLectura}
                />
              )}

              {!isLectura && (
                <div className="flex flex-col gap-3 rounded-md border border-dashed border-[#e0e6ed] bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] md:flex-row md:items-center md:justify-end">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => setActiveTab('personas')}
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    onClick={() => setActiveTab('investigadores')}
                  >
                    Siguiente
                  </Button>
                </div>
              )}


              {/* <form
                onSubmit={handleSubmitInformacion(onSubmitInformacion)}
                className="space-y-4"
              >
                <Card title="Información del caso">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFSelect<string>
                      id="formaInicio"
                      name="formaInicio"
                      control={controlInformacion}
                      label="Forma de inicio del caso"
                      error={
                        errorsInformacion.formaInicio?.message as
                        | string
                        | undefined
                      }
                      isDisable={isLectura}
                      originalData={FORMAS_INICIO}
                      mapOption={formaInicioToOption}
                    />

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                        Nro Caso FELCN
                      </label>
                      <div className="flex gap-2">
                        <Input
                          {...registerInformacion('nroCasoFelcn')}
                          disabled={isLectura}
                          error={!!errorsInformacion.nroCasoFelcn}
                          className="w-full"
                          placeholder="EJ. LP-O-1/26"
                        />
                        {!isLectura && (
                          <Button
                            type="button"
                            variant="outline-primary"
                            size="sm"
                            onClick={onBuscarSiii}
                          >
                            Buscar
                          </Button>
                        )}
                      </div>
                      {errorsInformacion.nroCasoFelcn && (
                        <p className="mt-1 text-xs text-danger">
                          {errorsInformacion.nroCasoFelcn.message}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

              </form> */}
            </div>
          )}

          {activeTab === 'investigadores' && (
            <InvestigadoresDataTable casoId={caso?.casosId!} />
          )}
        </div>
      </div>
    </div>
  )
}
