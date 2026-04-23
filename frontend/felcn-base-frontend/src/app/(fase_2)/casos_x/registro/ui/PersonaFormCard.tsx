'use client'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { useQuery } from '@tanstack/react-query'
import { UseFormReturn } from 'react-hook-form'
import { PersonaFormValues } from './schemas'
import {
  EstadoPersona,
  Pais,
  SelectOption,
  TipoDocumento,
} from '../types/registro.types'
import {
  getEstadosPersona,
  getPaises,
  getTiposDocumentos,
} from '../services/registro.service'

type Props = {
  form: UseFormReturn<PersonaFormValues>
  loading: boolean
  onSave: () => Promise<void>
}

const sexos = [
  { id: 1, descripcion: 'Masculino', value: 'MASCULINO' as const },
  { id: 2, descripcion: 'Femenino', value: 'FEMENINO' as const },
]

export const PersonaFormCard = ({ form, loading, onSave }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = form

  const { data: paises } = useQuery<Pais[]>({
    queryKey: ['paises'],
    queryFn: () => getPaises(),
  })

  const { data: tiposDocumento } = useQuery<TipoDocumento[]>({
    queryKey: ['tipos-documento'],
    queryFn: () => getTiposDocumentos(),
  })

  const { data: estados } = useQuery<EstadoPersona[]>({
    queryKey: ['estado-persona'],
    queryFn: () => getEstadosPersona(),
  })

  return (
    <div className="panel">
      <h5 className="mb-4 text-base font-semibold">Datos de Persona</h5>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <InputWithPrefix
            name="nombres"
            prefix="Nombre(s)"
            register={register}
            error={errors.nombres?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <InputWithPrefix
            name="paterno"
            prefix="Paterno"
            register={register}
            error={errors.paterno?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <InputWithPrefix
            name="materno"
            prefix="Materno"
            register={register}
            error={errors.materno?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <InputWithPrefix
            name="apEsposo"
            prefix="Ap. Esposo"
            register={register}
            error={errors.apEsposo?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <AsyncSearchSelect<Pais>
            name="pais"
            control={control}
            prefix="Pais"
            error={errors.pais?.message}
            originalData={paises ?? []}
            mapOption={(item): SelectOption<Pais> => ({
              label: item.descripcion,
              value: item.idPais,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <AsyncSearchSelect<{
            id: number
            descripcion: string
            value: 'MASCULINO' | 'FEMENINO'
          }>
            name="sexo"
            control={control}
            prefix="Sexo"
            error={errors.sexo?.message as string}
            originalData={sexos}
            mapOption={(item) => ({
              label: item.descripcion,
              value: item.id,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <InputWithPrefix
            name="direccion"
            prefix="Direccion"
            register={register}
            error={errors.direccion?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <AsyncSearchSelect<TipoDocumento>
            name="tipoDocumento"
            control={control}
            prefix="Tipo de documento"
            error={errors.tipoDocumento?.message}
            originalData={tiposDocumento ?? []}
            mapOption={(item): SelectOption<TipoDocumento> => ({
              label: item.descripcion,
              value: item.idTipoDocumento,
              original: item,
            })}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <InputWithPrefix
            name="numeroDocumento"
            prefix="Numero"
            register={register}
            error={errors.numeroDocumento?.message}
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <AsyncSearchSelect<EstadoPersona>
            name="estado"
            control={control}
            prefix="Estado"
            error={errors.estado?.message}
            originalData={estados ?? []}
            mapOption={(item): SelectOption<EstadoPersona> => ({
              label: item.descripcion,
              value: item.idEstado,
              original: item,
            })}
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
