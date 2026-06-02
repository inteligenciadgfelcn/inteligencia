'use client'

import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { FormInputDate } from '@/components/form/FormInputDate'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

import { AgregarPersonalApi } from '../api/agregar-personal.api'
import {
  mapDistritalToOption,
  mapGradoToOption,
  mapGrupoToOption,
  mapUnidadToOption,
} from '../mappers/agregar-personal.mappers'
import { agregarPersonalSchema } from '../schemas/agregar-personal.schema'
import type {
  AgregarPersonalFormValues,
  CatalogOption,
  DistritalCatalogItem,
  GradoCatalogItem,
  GrupoCatalogItem,
  UnidadCatalogItem,
} from '../types/agregar-personal.types'
import {
  createDefaultAgregarPersonalValues,
  formatNombreCompleto,
  generarCodigoTemporalPersonal,
} from '../utils/agregar-personal.utils'
import { RHFInput } from '../../../../../components/form/RHFInput'
import { RHFSelect } from '../../../../../components/form/RHFSelect'
import { RHFDate } from '../../../../../components/form/RHFDate'

const radioOptions = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
]

const rolOptions = [
  { value: 'investigador', label: 'Investigador', original: 'investigador' },
  { value: 'perito', label: 'Perito', original: 'perito' },
  { value: 'consultas', label: 'Consultas', original: 'consultas' },
]

const RadioField = ({
  name,
  label,
  control,
}: {
  name: keyof AgregarPersonalFormValues
  label: string
  control: ReturnType<typeof useForm<AgregarPersonalFormValues>>['control']
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-200">
          {label}
        </p>
        <div className="flex flex-wrap gap-3">
          {radioOptions.map((option) => (
            <label
              key={option.value}
              className={`flex min-w-[96px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${field.value === option.value ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 bg-white dark:border-[#1b2e4b] dark:bg-[#0f172a]'}`}
            >
              <input
                type="radio"
                className="form-radio"
                value={option.value}
                checked={field.value === option.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {!!error && <p className="mt-1 text-xs text-danger">{error.message}</p>}
      </div>
    )}
  />
)

export const AgregarPersonalForm = () => {
  const [codigoTemporal, setCodigoTemporal] = useState('')

  const form = useForm<AgregarPersonalFormValues>({
    resolver: zodResolver(agregarPersonalSchema),
    defaultValues: createDefaultAgregarPersonalValues(),
  })

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    formState: { isSubmitting },
  } = form

  const unidad = useWatch({ control, name: 'unidad' })
  const distrital = useWatch({ control, name: 'distrital' })
  const nombres = useWatch({ control, name: 'nombres' })
  const apellidoPaterno = useWatch({ control, name: 'apellidoPaterno' })
  const apellidoMaterno = useWatch({ control, name: 'apellidoMaterno' })
  const unidadId = unidad?.value ?? ''
  const distritalId = distrital?.value ?? ''

  const { data: grados = [], isLoading: isLoadingGrados } = useQuery<
    GradoCatalogItem[]
  >({
    queryKey: ['lgi-agregar-personal', 'grados'],
    queryFn: () => AgregarPersonalApi.listarGrados(),
  })

  const { data: unidades = [], isLoading: isLoadingUnidades } = useQuery<
    UnidadCatalogItem[]
  >({
    queryKey: ['lgi-agregar-personal', 'unidades'],
    queryFn: () => AgregarPersonalApi.listarUnidades(),
  })

  const { data: distritales = [], isLoading: isLoadingDistritales } = useQuery<
    DistritalCatalogItem[]
  >({
    queryKey: ['lgi-agregar-personal', 'distritales', unidadId],
    enabled: Boolean(unidadId),
    queryFn: () => AgregarPersonalApi.listarDistritalesPorUnidad(unidadId),
  })

  const { data: grupos = [], isLoading: isLoadingGrupos } = useQuery<
    GrupoCatalogItem[]
  >({
    queryKey: ['lgi-agregar-personal', 'grupos', distritalId],
    enabled: Boolean(distritalId),
    queryFn: () => AgregarPersonalApi.listarGruposPorDistrital(distritalId),
  })

  const gradoOptions = useMemo(() => grados.map(mapGradoToOption), [grados])
  const unidadOptions = useMemo(
    () => unidades.map(mapUnidadToOption),
    [unidades]
  )
  const distritalOptions = useMemo(
    () => distritales.map(mapDistritalToOption),
    [distritales]
  )
  const grupoOptions = useMemo(() => grupos.map(mapGrupoToOption), [grupos])

  useEffect(() => {
    resetField('distrital')
    resetField('grupo')
  }, [unidad, resetField])

  useEffect(() => {
    resetField('grupo')
  }, [distrital, resetField])

  const onSubmit = async (values: AgregarPersonalFormValues) => {
    setCodigoTemporal(
      `${generarCodigoTemporalPersonal()}-${values.nroPaseCredencial}`
    )
  }

  const nombreCompleto = formatNombreCompleto({
    nombres: nombres ?? '',
    apellidoPaterno: apellidoPaterno ?? '',
    apellidoMaterno: apellidoMaterno ?? '',
  })

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Agregar personal
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ingreso de datos para el registro de nuevos funcionarios.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card title="Datos de credencial y persona">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <RHFInput
              id="nroPaseCredencial"
              name="nroPaseCredencial"
              control={control}
              label="Nro Pase Credencial"
            />

            <RHFSelect
              id="grado"
              name="grado"
              label="Grado"
              control={control}
              originalData={gradoOptions}
              isDisable={!!isLoadingGrados}
              mapOption={(option) => ({
                value: option.value,
                label: option.label,
                original: option,
              })}
            />

            <RHFInput
              id="apellidoPaterno"
              name="apellidoPaterno"
              control={control}
              label="Apellido paterno"
            />

            <RHFInput
              id="apellidoMaterno"
              name="apellidoMaterno"
              control={control}
              label="Apellido materno"
            />

            <RHFInput
              id="nombres"
              name="nombres"
              control={control}
              label="Nombres"
            />

            <RHFDate
              id="fechaNacimiento"
              name="fechaNacimiento"
              control={control}
              label="Fecha de nacimiento"
              format="YYYY-MM-DD"
            />
          </div>
        </Card>

        <Card title="Contacto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <RHFInput
              id="correoElectronico"
              name="correoElectronico"
              control={control}
              label="Correo electrónico"
            />

            <RHFInput
              id="nroTelefonoCelular"
              name="nroTelefonoCelular"
              control={control}
              label="Nro teléfono celular"
            />

            <RHFInput
              id="nroTelefonoOficina"
              name="nroTelefonoOficina"
              control={control}
              label="Nro teléfono oficina"
            />
          </div>
        </Card>

        <Card title="Unidad y jerarquía">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <RHFSelect
              id="unidad"
              name="unidad"
              label="Unidad"
              control={control}
              originalData={unidadOptions}
              isDisable={isLoadingUnidades}
              mapOption={(option: CatalogOption) => ({
                value: option.value,
                label: option.label,
                original: option,
              })}
            />

            <RHFSelect
              id="distrital"
              name="distrital"
              label="Distrital"
              control={control}
              originalData={distritalOptions}
              isDisable={!unidadId || isLoadingDistritales}
              mapOption={(option: CatalogOption) => ({
                value: option.value,
                label: option.label,
                original: option,
              })}
            />

            <RHFSelect
              id="grupo"
              name="grupo"
              label="Grupo"
              control={control}
              originalData={grupoOptions}
              isDisable={!distritalId || isLoadingGrupos}
              mapOption={(option: CatalogOption) => ({
                value: option.value,
                label: option.label,
                original: option,
              })}
            />
          </div>
        </Card>

        <Card title="Rol y permisos">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <RHFSelect
              id="rol"
              name="rol"
              label="Rol"
              control={control}
              originalData={rolOptions}
              mapOption={(option: CatalogOption) => ({
                value: option.value,
                label: option.label,
                original: option,
              })}
            />

            <RadioField
              name="habilitadoIngreso"
              control={control}
              label="Habilitado para ingreso de la información"
            />

            <RadioField
              name="mostrarListaInvestigadores"
              control={control}
              label="Mostrar en la lista de investigadores"
            />
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              reset(createDefaultAgregarPersonalValues())
              setCodigoTemporal('')
            }}
          >
            Limpiar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Validar registro
          </Button>
        </div>
      </form>
    </div>
  )
}
