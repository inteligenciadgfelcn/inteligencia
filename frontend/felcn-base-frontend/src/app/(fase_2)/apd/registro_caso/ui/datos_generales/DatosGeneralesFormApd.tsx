'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { RHFSelect } from '@/components/form/RHFSelect'
import { RHFDate } from '@/components/form/RHFDate'

import type {
  DepartamentoLgi,
  DistritalLgi,
  GrupoLgi,
  InicioCasoLgi,
} from '../../../(parametricas)/types/parametricas-apd.types'
import { ParametricasLgiApi } from '../../../(parametricas)/api/parametricas-apd.api'
import { RegistroCasoApi } from '../../api/registro-caso-apd.api'
import { InvestigadoresApi } from '../../api/investigadores-apd.api'
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
} from '../../mappers/registro-caso-apd.mappers'
import {
  datosGeneralesSchema,
  type DatosGeneralesSchemaValues,
} from '../../schemas/registro-caso-apd.schema'
import type {
  AsignacionLgiDetalle,
  CatalogOption,
} from '../../types/registro-caso-apd.types'
import type { InvestigadorGeneralRow } from '../../types/investigadores-apd.types'
import { createDefaultDatosGeneralesValues } from '../../utils/registro-caso-apd.utils'
import { InvestigadorSelect } from '../shared/InvestigadorSelectApd'
import { obtenerUltimoCodigoServicioActivo } from '../../../../inteligencia/servicio/services/servicio.service'

type Props = {
  casoId?: string | null
  caso?: AsignacionLgiDetalle | null
  isLectura: boolean
  onBeforeSave?: () => void
  onGuardadoExitoso: (casoIdCreado?: number) => void
}

export function DatosGeneralesForm({
  casoId,
  caso,
  isLectura,
  onBeforeSave,
  onGuardadoExitoso,
}: Props) {
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const [generandoNumero, setGenerandoNumero] = useState(false)

  const form = useForm<DatosGeneralesSchemaValues>({
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
  } = form

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

  const { data: investigadores = [] } = useQuery<InvestigadorGeneralRow[]>({
    queryKey: ['lgi-registro-caso', 'investigadores'],
    queryFn: () => InvestigadoresApi.listarPorUnidad(),
  })

  useEffect(() => {
    if (casoId) return
    void obtenerUltimoCodigoServicioActivo().then((codigo) => {
      if (codigo) setValue('codigoServicio', codigo)
    })
  }, [casoId, setValue])

  const disIdSeleccionado = useWatch({
    control,
    name: 'disId',
  }) as CatalogOption<DistritalLgi> | null

  const { data: grupos = [] } = useQuery<GrupoLgi[]>({
    queryKey: ['lgi-registro-caso', 'grupos', disIdSeleccionado?.value ?? ''],
    enabled: Boolean(disIdSeleccionado?.value),
    queryFn: () => ParametricasLgiApi.listarGrupos(Number(disIdSeleccionado!.value)),
  })

  // Solo se hidrata una vez por caso: evita que un refetch de catálogos pise
  // lo que el usuario ya está editando.
  const casoHidratadoRef = useRef<string | null>(null)

  // 1. Hidrata el formulario
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

    reset({
      ...createDefaultDatosGeneralesValues(),
      disId: buscarDistritalPorId(distritales, caso.disId),
      departamento: departamento
        ? mapDepartamentoToOption(departamento)
        : null,
      inicioCaso: buscarInicioCasoPorDescripcion(
        iniciosCaso,
        caso.inicioCaso
      ),
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
      idGrupo: null,
    })
  }, [caso, casoId, departamentos, distritales, iniciosCaso, reset])

  useEffect(() => {
    if (!casoId || !caso?.idGrupo || !grupos.length) return
    const grupo = grupos.find((item) => item.id === caso.idGrupo)

    if (grupo) {
      setValue('idGrupo', mapGrupoToOption(grupo))
    }
  }, [casoId, caso?.idGrupo, grupos, setValue,])

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
      const numero = await RegistroCasoApi.generarNumero(codigo, 'PD')
      setValue('nroCaso', numero, { shouldValidate: true })
    } finally {
      setGenerandoNumero(false)
    }
  }

  const onSubmitDatosGenerales = async (values: DatosGeneralesSchemaValues) => {
    setIsSaving(true)
    onBeforeSave?.()
    try {
      const payload = buildDatosGeneralesPayload(values)
      let casoIdCreado: number | undefined

      if (casoId) {
        await RegistroCasoApi.actualizarDatosGenerales(casoId, payload)
      } else {
        const respuesta = await RegistroCasoApi.crearDatosGenerales(payload)
        casoIdCreado = respuesta.id
      }

      queryClient.invalidateQueries({ queryKey: ['apd-listado-casos'] })
      if (casoId) {
        queryClient.invalidateQueries({
          queryKey: ['apd-registro-caso', 'caso', casoId],
        })
      }

      onGuardadoExitoso(casoIdCreado)
    } finally {
      setIsSaving(false)
    }
  }

  return (
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

          <InvestigadorSelect
            id="conformeA"
            name="conformeA"
            control={control}
            label="Responsable del llenado"
            investigadores={investigadores}
            error={errors.conformeA?.message as string | undefined}
            isDisable={isLectura}
          />

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
  )
}