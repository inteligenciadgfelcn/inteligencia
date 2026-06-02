'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import { FormInputDate } from '@/components/form/FormInputDate'
import { FormInputRadio } from '@/components/form/FormInputRadio'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

import { RegistroCasosApi } from '../api/registro-casos.api'
import {
  mapFuncionarioToDropdownOption,
  mapGrupoToOption,
  mapRegionalToOption,
  mapSimpleCatalogToOption,
} from '../mappers/registro-casos.mappers'
import { registroCasosSchema } from '../schemas/registro-casos.schema'
import {
  CatalogOption,
  FuncionarioCatalogItem,
  GrupoCatalogItem,
  RegionalCatalogItem,
  SimpleCatalogItem,
  RegistroCasosFormValues,
} from '../types/registro-casos.types'
import {
  CURRENT_YEAR,
  createDefaultRegistroCasosValues,
  formatFuncionarioLabel,
} from '../utils/registro-casos.utils'

const radioOptions = [
  { value: 'si', label: 'Si' },
  { value: 'no', label: 'No' },
]

export const RegistroCasosIngresoDatos = () => {
  const [codigoGenerado, setCodigoGenerado] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const defaultValues = useMemo(() => createDefaultRegistroCasosValues(), [])

  const form = useForm<RegistroCasosFormValues>({
    resolver: zodResolver(registroCasosSchema),
    defaultValues,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
    formState: { errors },
  } = form

  const regional = useWatch({
    control,
    name: 'regional',
  }) as CatalogOption<RegionalCatalogItem> | null
  const grupo = useWatch({
    control,
    name: 'grupo',
  }) as CatalogOption<GrupoCatalogItem> | null
  const casoPorPerdidaDominio = useWatch({
    control,
    name: 'casoPorPerdidaDominio',
  })
  const asignados = watch('asignadoAlCaso') ?? []

  const { data: regionales = [] } = useQuery<RegionalCatalogItem[]>({
    queryKey: ['lgi-registro-casos', 'regionales'],
    queryFn: () => RegistroCasosApi.listarRegionales(),
  })

  const { data: departamentos = [] } = useQuery<SimpleCatalogItem[]>({
    queryKey: ['lgi-registro-casos', 'departamentos'],
    queryFn: () => RegistroCasosApi.listarDepartamentos(),
  })

  const { data: tiposCaso = [] } = useQuery<SimpleCatalogItem[]>({
    queryKey: ['lgi-registro-casos', 'tipos-caso'],
    queryFn: () => RegistroCasosApi.listarTiposCaso(),
  })

  const { data: tiposDelito = [] } = useQuery<SimpleCatalogItem[]>({
    queryKey: ['lgi-registro-casos', 'tipos-delito'],
    queryFn: () => RegistroCasosApi.listarTiposDelito(),
  })

  const { data: inicioCasoLgi = [] } = useQuery<SimpleCatalogItem[]>({
    queryKey: ['lgi-registro-casos', 'inicio-caso-lgi'],
    queryFn: () => RegistroCasosApi.listarInicioCasoLgi(),
  })

  const { data: grupos = [] } = useQuery<GrupoCatalogItem[]>({
    queryKey: ['lgi-registro-casos', 'grupos', regional?.value ?? ''],
    enabled: Boolean(regional?.value),
    queryFn: () => RegistroCasosApi.listarGruposPorRegional(regional!.value),
  })

  const { data: funcionarios = [] } = useQuery<FuncionarioCatalogItem[]>({
    queryKey: ['lgi-registro-casos', 'funcionarios', grupo?.value ?? ''],
    enabled: Boolean(grupo?.value),
    queryFn: () => RegistroCasosApi.listarFuncionariosPorGrupo(grupo!.value),
  })

  const funcionarioColumns: Column<FuncionarioCatalogItem>[] = [
    {
      accessor: 'seleccion',
      title: 'Sel.',
      className: 'w-16',
      render: (row) => {
        const checked = asignados.includes(row.id)

        return (
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-primary"
            checked={checked}
            onChange={() => {
              const nextValue = checked
                ? asignados.filter((id) => id !== row.id)
                : [...asignados, row.id]

              setValue('asignadoAlCaso', nextValue, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }}
          />
        )
      },
    },
    { accessor: 'nroPase', title: 'Nro Pase' },
    { accessor: 'grado', title: 'Grado' },
    { accessor: 'nombre', title: 'Nombre' },
    { accessor: 'paterno', title: 'Paterno' },
    { accessor: 'materno', title: 'Materno' },
    {
      accessor: 'identificacion',
      title: 'Funcionario',
      render: (row) => formatFuncionarioLabel(row),
    },
  ]

  useEffect(() => {
    resetField('grupo')
    resetField('asignadoAlCaso')
  }, [regional?.value, resetField])

  useEffect(() => {
    resetField('asignadoAlCaso')
  }, [grupo?.value, resetField])

  useEffect(() => {
    if (casoPorPerdidaDominio === 'no') {
      resetField('nroCasoPerdidaDominio')
    }
  }, [casoPorPerdidaDominio, resetField])

  const onNuevoCaso = () => {
    reset(createDefaultRegistroCasosValues())
    setCodigoGenerado('')
  }

  const onSubmit = async (values: RegistroCasosFormValues) => {
    setIsSaving(true)
    try {
      const response = await RegistroCasosApi.asignarCaso(values)
      setCodigoGenerado(response.codigoGenerado)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Registro de Casos LGI
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ingreso de datos generales del caso.
        </p>
      </div>

      {codigoGenerado && (
        <Card
          title="Caso asignado"
          className="border border-success/30 bg-success/5"
        >
          <div className="rounded-md bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:bg-[#0f172a] dark:text-gray-200">
            Código generado:{' '}
            <span className="font-semibold text-success">{codigoGenerado}</span>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card title="Datos de origen y asignación">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AsyncSearchSelect<RegionalCatalogItem>
              name="regional"
              control={control}
              prefix="Regional"
              error={errors.regional?.message as string | undefined}
              originalData={regionales}
              mapOption={mapRegionalToOption}
            />

            <AsyncSearchSelect<GrupoCatalogItem>
              name="grupo"
              control={control}
              prefix="Grupo"
              error={errors.grupo?.message as string | undefined}
              isDisable={!regional}
              originalData={grupos}
              mapOption={mapGrupoToOption}
            />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h6 className="text-sm font-semibold text-dark dark:text-white-light">
                  Asignado al caso
                </h6>
                <p className="text-xs text-gray-500">
                  Seleccione uno o más funcionarios del grupo elegido.
                </p>
              </div>

              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                disabled={!grupo || asignados.length === 0}
                onClick={() =>
                  setValue('asignadoAlCaso', [], {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              >
                Limpiar selección
              </Button>
            </div>

            <VristoDataTable<FuncionarioCatalogItem>
              rows={funcionarios}
              total={funcionarios.length}
              page={1}
              limit={Math.max(funcionarios.length, 1)}
              onPageChange={() => undefined}
              onLimitChange={() => undefined}
              columns={funcionarioColumns}
              loading={!grupo ? false : false}
              rowClassName={(row) =>
                asignados.includes(row.id)
                  ? 'bg-primary/5 dark:bg-primary/10'
                  : ''
              }
            />

            {errors.asignadoAlCaso && (
              <p className="text-xs text-danger">
                {errors.asignadoAlCaso.message}
              </p>
            )}
          </div>
        </Card>

        <Card title="Datos generales del caso">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AsyncSearchSelect<SimpleCatalogItem>
              name="departamento"
              control={control}
              prefix="El caso se registra en el departamento de"
              error={errors.departamento?.message as string | undefined}
              originalData={departamentos}
              mapOption={mapSimpleCatalogToOption}
            />

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                Nombre del caso
              </label>
              <Input
                {...register('nombreCaso')}
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

            <AsyncSearchSelect<SimpleCatalogItem>
              name="tipoCaso"
              control={control}
              prefix="Tipo de caso"
              error={errors.tipoCaso?.message as string | undefined}
              originalData={tiposCaso}
              mapOption={mapSimpleCatalogToOption}
            />

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                Nro asignado por la FELCN
              </label>
              <Input
                {...register('nroAsignadoFelcn')}
                error={!!errors.nroAsignadoFelcn}
                className="w-full"
                placeholder="Nro asignado por la FELCN"
              />
              {errors.nroAsignadoFelcn && (
                <p className="mt-1 text-xs text-danger">
                  {errors.nroAsignadoFelcn.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                CUD o Nro asignado por fiscalía
              </label>
              <Input
                {...register('cudFiscalia')}
                error={!!errors.cudFiscalia}
                className="w-full"
                placeholder="CUD o nro asignado por fiscalía"
              />
              {errors.cudFiscalia && (
                <p className="mt-1 text-xs text-danger">
                  {errors.cudFiscalia.message}
                </p>
              )}
            </div>

            <AsyncSearchSelect<SimpleCatalogItem>
              name="tipoDelito"
              control={control}
              prefix="Tipo de delito"
              error={errors.tipoDelito?.message as string | undefined}
              originalData={tiposDelito}
              mapOption={mapSimpleCatalogToOption}
            />

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                Nro de caso (Inv. Financiera Paralela)
              </label>
              <Input
                {...register('nroCasoInvFinancieraParalela')}
                error={!!errors.nroCasoInvFinancieraParalela}
                className="w-full"
                placeholder="Nro de caso"
              />
              {errors.nroCasoInvFinancieraParalela && (
                <p className="mt-1 text-xs text-danger">
                  {errors.nroCasoInvFinancieraParalela.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                CUD Delito precedente (Inv. Financiera Paralela)
              </label>
              <Input
                {...register('cudDelitoPrecedente')}
                error={!!errors.cudDelitoPrecedente}
                className="w-full"
                placeholder="CUD delito precedente"
              />
              {errors.cudDelitoPrecedente && (
                <p className="mt-1 text-xs text-danger">
                  {errors.cudDelitoPrecedente.message}
                </p>
              )}
            </div>

            <FormInputRadio
              id="casoPorPerdidaDominio"
              name="casoPorPerdidaDominio"
              control={control}
              label="Caso por pérdida de dominio?"
              options={radioOptions}
            />

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                Nro de caso (Pérdida de dominio)
              </label>
              <Input
                {...register('nroCasoPerdidaDominio')}
                disabled={casoPorPerdidaDominio !== 'si'}
                error={!!errors.nroCasoPerdidaDominio}
                className="w-full"
                placeholder="Nro de caso por pérdida de dominio"
              />
              {errors.nroCasoPerdidaDominio && (
                <p className="mt-1 text-xs text-danger">
                  {errors.nroCasoPerdidaDominio.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                Memorándum nro
              </label>
              <Input
                {...register('memorandumNro')}
                error={!!errors.memorandumNro}
                className="w-full"
                placeholder="Memorándum nro"
              />
              {errors.memorandumNro && (
                <p className="mt-1 text-xs text-danger">
                  {errors.memorandumNro.message}
                </p>
              )}
            </div>

            <FormInputDate
              id="fechaAsignacionCaso"
              name="fechaAsignacionCaso"
              control={control}
              label="Fecha asignación de caso"
              clearable
            />

            <AsyncSearchSelect<SimpleCatalogItem>
              name="inicioCasoLgi"
              control={control}
              prefix="Inicio de Caso por LGI"
              error={errors.inicioCasoLgi?.message as string | undefined}
              originalData={inicioCasoLgi}
              mapOption={mapSimpleCatalogToOption}
            />

            <FormInputDate
              id="remitidoGiaefFecha"
              name="remitidoGiaefFecha"
              control={control}
              label="Remitido al GIAEF en Fecha"
              clearable
            />

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                Gestion
              </label>
              <Input
                {...register('gestion')}
                type="number"
                inputMode="numeric"
                min={1000}
                max={9999}
                error={!!errors.gestion}
                className="w-full"
              />
              {errors.gestion && (
                <p className="mt-1 text-xs text-danger">
                  {errors.gestion.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3 rounded-md border border-dashed border-[#e0e6ed] bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a] md:flex-row md:items-center md:justify-end">
          <Button
            type="button"
            variant="outline-secondary"
            onClick={onNuevoCaso}
            disabled={isSaving}
          >
            Nuevo Caso
          </Button>
          <Button type="submit" variant="primary" loading={isSaving}>
            Asignar Caso
          </Button>
        </div>
      </form>

      <div className="text-xs text-gray-500">
        Gestión por defecto: {CURRENT_YEAR}
      </div>
    </div>
  )
}
