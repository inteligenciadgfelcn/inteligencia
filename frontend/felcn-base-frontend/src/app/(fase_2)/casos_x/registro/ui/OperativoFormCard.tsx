'use client'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { UseFormReturn } from 'react-hook-form'
import { OperativoFormValues } from './schemas'
import {
  Departamento,
  Municipio,
  Provincia,
  SelectOption,
} from '../types/registro.types'

type Props = {
  form: UseFormReturn<OperativoFormValues>
  departamentos: Departamento[]
  provincias: Provincia[]
  municipios: Municipio[]
}

export const OperativoFormCard = ({
  form,
  departamentos,
  provincias,
  municipios,
}: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = form

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
            originalData={departamentos}
            mapOption={(item): SelectOption<Departamento> => ({
              label: item.descripcion,
              value: item.id,
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
            originalData={provincias}
            mapOption={(item): SelectOption<Provincia> => ({
              label: item.descripcion,
              value: item.id,
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
            originalData={municipios}
            mapOption={(item): SelectOption<Municipio> => ({
              label: item.descripcion,
              value: item.id,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <InputWithPrefix
            name="localidadODireccion"
            prefix="Localidad o Direccion"
            register={register}
            error={errors.localidadODireccion?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <InputWithPrefix
            name="operativoRealizadoEn"
            prefix="Operativo realizado en"
            register={register}
            error={errors.operativoRealizadoEn?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <InputWithPrefix
            name="unidadOperativa"
            prefix="Unidad operativa"
            register={register}
            error={errors.unidadOperativa?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
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
            prefix="Resumen"
            register={register}
            error={errors.resumen?.message}
          />
        </div>
      </div>
    </div>
  )
}
