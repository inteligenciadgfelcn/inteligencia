'use client'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { OperativoFormValues } from './schemas'
import {
  CategoriaOperativo,
  Distrito,
  Grupo,
  IdItemOperativo,
  Municipio,
  Provincia,
  SelectOption,
  Unidad,
} from '../types/registro.types'
import { Departamento } from '@/app/(fase_2)/inteligencia/registro/services/departments.service'
import { useDepartments } from '@/app/(fase_2)/inteligencia/registro/hooks/use.departments'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getCategoriasOperativo,
  getDistritos,
  getGrupos,
  getItemsCategoria,
  getMunicipios,
  getProvincias,
  getUnidades,
} from '../services/registro.service'

type Props = {
  form: UseFormReturn<OperativoFormValues>
  onSave: () => Promise<void>
  loading: boolean
  // departamentos: Departamento[]
  // provincias: Provincia[]
  // municipios: Municipio[]
}

export const OperativoFormCard = ({ form, onSave, loading }: Props) => {
  const {
    register,
    control,
    formState: { errors },
    resetField,
    handleSubmit,
  } = form

  const departamentoSeleccionado = useWatch({ control, name: 'departamento' })
  const provinciaSeleccionada = useWatch({ control, name: 'provincia' })
  const categoriaSeleccionada = useWatch({ control, name: 'categoria' })
  const unidadSeleccionada = useWatch({ control, name: 'unidad' })
  const distritoSeleccionado = useWatch({ control, name: 'distrito' })

  const { data: departamentos } = useDepartments()
  const { data: provincias } = useQuery<Provincia[]>({
    queryKey: ['provincias', departamentoSeleccionado?.value],
    enabled: Boolean(departamentoSeleccionado),
    queryFn: () =>
      getProvincias(departamentoSeleccionado!.original.abreviatura),
  })
  const { data: municipios } = useQuery<Municipio[]>({
    queryKey: ['municipios', provinciaSeleccionada?.value],
    enabled: Boolean(provinciaSeleccionada),
    queryFn: () => getMunicipios(provinciaSeleccionada.value),
  })
  const { data: categorias } = useQuery<CategoriaOperativo[]>({
    queryKey: ['categoria'],
    queryFn: () => getCategoriasOperativo(),
  })
  const { data: itemsCategoria } = useQuery<IdItemOperativo[]>({
    queryKey: ['item_categoria', categoriaSeleccionada?.value],
    enabled: Boolean(categoriaSeleccionada),
    queryFn: () => getItemsCategoria(categoriaSeleccionada!.value),
  })
  const { data: unidades } = useQuery<Unidad[]>({
    queryKey: ['unidades'],
    queryFn: () => getUnidades(),
  })
  const { data: distritos } = useQuery<Distrito[]>({
    queryKey: ['distritos', unidadSeleccionada?.value],
    enabled: Boolean(unidadSeleccionada),
    queryFn: () => getDistritos(unidadSeleccionada!.value),
  })
  const { data: grupos } = useQuery<Grupo[]>({
    queryKey: ['grupos', distritoSeleccionado?.value],
    enabled: Boolean(distritoSeleccionado),
    queryFn: () => getGrupos(distritoSeleccionado!.value),
  })

  useEffect(() => {
    resetField('provincia')
    resetField('municipio')
  }, [departamentoSeleccionado?.value, resetField])

  useEffect(() => {
    resetField('municipio')
  }, [provinciaSeleccionada?.value, resetField])

  useEffect(() => {
    resetField('itemOperativo')
  }, [categoriaSeleccionada?.value, resetField])

  useEffect(() => {
    resetField('distrito')
    resetField('grupo')
  }, [unidadSeleccionada?.value, resetField])

  useEffect(() => {
    resetField('grupo')
  }, [distritoSeleccionado?.value, resetField])

  return (
    <div className="panel">
      <h5 className="mb-4 text-base font-semibold">Datos del Operativo</h5>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <InputWithPrefix
            name="codigoRadiograma"
            prefix="Codigo radiograma"
            register={register}
            error={errors.codigoRadiograma?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <InputWithPrefix
            name="fechaHoraOperativo"
            prefix="Fecha hora del operativo"
            register={register}
            error={errors.fechaHoraOperativo?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <AsyncSearchSelect<Departamento>
            name="departamento"
            control={control}
            prefix="Departamento"
            error={errors.departamento?.message}
            originalData={departamentos ?? []}
            mapOption={(item): SelectOption<Departamento> => ({
              label: item.descripcion,
              value: item.idDepartamento,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <AsyncSearchSelect<Provincia>
            name="provincia"
            control={control}
            prefix="Provincia"
            error={errors.provincia?.message}
            isDisable={!departamentoSeleccionado}
            originalData={provincias ?? []}
            mapOption={(item): SelectOption<Provincia> => ({
              label: item.descripcion,
              value: item.idProvincia,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <AsyncSearchSelect<Municipio>
            name="municipio"
            control={control}
            prefix="Municipio"
            error={errors.municipio?.message}
            isDisable={!provinciaSeleccionada}
            originalData={municipios ?? []}
            mapOption={(item): SelectOption<Municipio> => ({
              label: item.descripcion,
              value: item.idLocalidad,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-12">
          <InputWithPrefix
            name="localidadODireccion"
            prefix="Localidad o Direccion"
            register={register}
            error={errors.localidadODireccion?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-8">
          <AsyncSearchSelect<CategoriaOperativo>
            name="categoria"
            control={control}
            prefix="Operativo realizado en"
            error={errors.categoria?.message}
            originalData={categorias ?? []}
            mapOption={(item): SelectOption<CategoriaOperativo> => ({
              label: item.descripcion,
              value: item.idCategoriaOperativo,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <AsyncSearchSelect<IdItemOperativo>
            name="itemOperativo"
            control={control}
            prefix=""
            isDisable={!categoriaSeleccionada}
            error={errors.itemOperativo?.message}
            originalData={itemsCategoria ?? []}
            mapOption={(item): SelectOption<IdItemOperativo> => ({
              label: item.descripcion,
              value: item.idItemOperativo,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <AsyncSearchSelect<Unidad>
            name="unidad"
            control={control}
            prefix="Unidad operativa"
            error={errors.unidad?.message}
            originalData={unidades ?? []}
            mapOption={(item): SelectOption<Unidad> => ({
              label: item.descripcion,
              value: item.id,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <AsyncSearchSelect<Distrito>
            name="distrito"
            control={control}
            prefix="Distrito"
            error={errors.distrito?.message}
            isDisable={!unidadSeleccionada}
            originalData={distritos ?? []}
            mapOption={(item): SelectOption<Distrito> => ({
              label: item.descripcion,
              value: item.idDistrital,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <AsyncSearchSelect<Grupo>
            name="grupo"
            control={control}
            prefix="Grupo"
            error={errors.grupo?.message}
            isDisable={!distritoSeleccionado}
            originalData={grupos ?? []}
            mapOption={(item): SelectOption<Grupo> => ({
              label: item.descripcion,
              value: item.idGrupo,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-12">
          <InputWithPrefix
            name="alMandoDe"
            prefix="Al mando de"
            register={register}
            error={errors.alMandoDe?.message}
          />
        </div>

        <div className="col-span-12">
          <InputWithPrefix
            name="resumen"
            prefix="Hecho detallado"
            register={register}
            error={errors.resumen?.message}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end border-t px-1 pt-4 dark:border-gray-700">
        <button
          type="button"
          className="btn btn-primary"
          disabled={loading}
          onClick={() => void onSave()}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
