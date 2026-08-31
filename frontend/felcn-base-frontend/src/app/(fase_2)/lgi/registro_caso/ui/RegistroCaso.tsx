'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { RHFSelect } from '@/components/form/RHFSelect'

import { PersonasInvestigadas } from '../../caso_detalle/ui/PersonasInvestigadas'

import type {
  DepartamentoLgi,
  DistritalLgi,
  GrupoLgi,
} from '../../(parametricas)/types/parametricas.types'
import { ParametricasLgiApi } from '../../(parametricas)/api/parametricas.api'
import { RegistroCasoApi } from '../api/registro-caso.api'
import {
  buildDatosGeneralesPayload,
  codigoDepartamento,
  mapDepartamentoToOption,
  mapDistritalToOption,
  mapGrupoToOption,
} from '../mappers/registro-caso.mappers'
import {
  datosGeneralesSchema,
  informacionCasoSchema,
  type DatosGeneralesSchemaValues,
  type InformacionCasoSchemaValues,
} from '../schemas/registro-caso.schema'
import type {
  CatalogOption,
} from '../types/registro-caso.types'
import {
  createDefaultDatosGeneralesValues,
  leerCasoDeStorage,
} from '../utils/registro-caso.utils'
import { SolicitarInteligenciaDialog } from './SolicitarInteligenciaDialog'
import { CasoSiiiDialog } from './CasoSiiiDialog'
import { InvestigadoresDataTable } from './InvestigadoresDataTable'

type TabKey =
  | 'datos-generales'
  | 'personas'
  | 'informacion-caso'
  | 'investigadores'

type Modo = 'nuevo' | 'editar' | 'ver'

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
  { key: 'informacion-caso', label: 'Información del caso' },
  { key: 'investigadores', label: 'Investigadores asignados' },
]

const placeholderCards: Record<
  TabKey,
  Array<{ label: string; value: string }>
> = {
  'datos-generales': [],
  personas: [],
  'informacion-caso': [],
  investigadores: [
    {
      label: 'Registros',
      value: 'Sin investigadores asignados todavía',
    },
    {
      label: 'Acción',
      value: 'Pendiente de integración con el backend',
    },
  ],
}

export function RegistroCaso({ casoId, modo = 'nuevo' }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const isLectura = modo === 'ver'
  const casoInicial = useMemo(() => leerCasoDeStorage(), [])
  const casoActivo = casoId ? Number(casoId) : null

  const [activeTab, setActiveTab] = useState<TabKey>('datos-generales')
  const [casoActivoId, setCasoActivoId] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [generandoNumero, setGenerandoNumero] = useState(false)
  const [solicitarInteligenciaOpen, setSolicitarInteligenciaOpen] =
    useState(false)

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

  // ── Formulario datos generales ───────────────────────────────────────────────
  const disIdInicial = useMemo(() => {
    if (!casoInicial?.disId) return null
    return {
      value: String(casoInicial.disId),
      label: casoInicial.regional || String(casoInicial.disId),
      original: {
        id: Number(casoInicial.disId),
        descripcion: casoInicial.regional || '',
        estado: '',
        idUnidad: 0,
        unidad: '',
      } as DistritalLgi,
    }
  }, [casoInicial])

  const datosForm = useForm<DatosGeneralesSchemaValues>({
    resolver: zodResolver(datosGeneralesSchema),
    defaultValues: {
      ...createDefaultDatosGeneralesValues(),
      ...(casoInicial && casoId
        ? {
          disId: disIdInicial,
          nombreCaso: casoInicial.nombreCaso ?? '',
          nroCaso: casoInicial.nroCaso ?? '',
          cudIfp: casoInicial.cudIfp ?? '',
          remiteFiscal: casoInicial.remiteFiscal ?? '',
          conformeA: casoInicial.conformeA ?? '',
          controlJurisdiccional:
            (casoInicial.controlJurisdiccional as string | undefined) ?? '',
        }
        : {}),
    },
  })

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    resetField,
    formState: { errors },
  } = datosForm

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

  useEffect(() => {
    resetField('idGrupo')
  }, [disIdSeleccionado?.value, resetField])

  useEffect(() => {
    if (!casoId || !casoInicial?.dptoavId || !departamentos.length) return
    const match = departamentos.find(
      (d) => codigoDepartamento(d) === casoInicial.dptoavId
    )
    if (match) {
      setValue('departamento', mapDepartamentoToOption(match))
    }
  }, [casoId, casoInicial?.dptoavId, departamentos, setValue])

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
    } finally {
      setIsSaving(false)
    }
  }

  const currentCards = useMemo(() => placeholderCards[activeTab], [activeTab])

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
              {casoInicial?.nombreCaso ?? 'Registro de caso LGI'}
            </h2>
            {casoIdEfectivo && (
              <p className="mt-1 text-sm text-gray-500">ID {casoIdEfectivo}</p>
            )}
          </div>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => router.push('/lgi/listado_casos')}
          >
            Volver al listado
          </Button>
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
                    label="Regional"
                    error={errors.disId?.message as string | undefined}
                    isDisable={isLectura}
                    originalData={distritales}
                    mapOption={mapDistritalToOption}
                  />

                  <RHFSelect<GrupoLgi>
                    id="idGrupo"
                    name="idGrupo"
                    control={control}
                    label="Puesto"
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
                    <Input
                      {...register('conformeA')}
                      disabled={isLectura}
                      error={!!errors.conformeA}
                      className="w-full"
                      placeholder="Responsable del llenado"
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
                      CUD fiscalía
                    </label>
                    <Input
                      {...register('cudIfp')}
                      disabled={isLectura}
                      error={!!errors.cudIfp}
                      className="w-full"
                      placeholder="CUD/IFP"
                    />
                    {errors.cudIfp && (
                      <p className="mt-1 text-xs text-danger">
                        {errors.cudIfp.message}
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
            <form
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
                        placeholder="Número de caso FELCN"
                      />
                      {!isLectura && (
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setSolicitarInteligenciaOpen(true)}
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

              {!isLectura && (
                <div className="flex flex-col gap-3 rounded-md border border-dashed border-[#e0e6ed] bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] md:flex-row md:items-center md:justify-end">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => setActiveTab('personas')}
                  >
                    Volver
                  </Button>
                  <Button type="submit" variant="primary">
                    Siguiente
                  </Button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'investigadores' && (
            <InvestigadoresDataTable casoId={casoId!} />
          )}
        </div>
      </div>

      {/* Dialog solicitar info de inteligencia */}
      <CasoSiiiDialog isOpen={solicitarInteligenciaOpen} nroCaso={informacionForm.getValues('nroCasoFelcn')} onClose={() => {
        setSolicitarInteligenciaOpen(false)
      }} />
    </div>
  )
}
