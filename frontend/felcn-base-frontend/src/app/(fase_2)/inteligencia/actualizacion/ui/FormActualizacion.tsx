'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import { CasoActualizacionTable } from '../types/caso.actualizacion.table'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getIniciales, LetraInicial } from '../services/letras.service'
import { imprimir } from '@/utils/imprimir'
import IconEdit from '@/components/Icon/IconEdit'
import IconPrinter from '@/components/Icon/IconPrinter'

const selectSchema = (message: string) =>
  z.preprocess(
    (val) => (val === null ? undefined : val),
    z.object(
      {
        value: z.number(),
        label: z.string(),
      },
      { required_error: message }
    )
  )

export const formSchema = z.object({
  letrasPrincipalAprendido: selectSchema(
    'Letras Principal Aprendido es obligatorio'
  ),
  codigoDepartamento: z.string().min(1, 'Codigo Departamento es obligatorio'),
  nroRegistro: z.string().min(1, 'Nro de Registro es obligatorio'),
  newCode: z.string().min(1, 'Nro Caso es obligatorio'),
})

export interface FormActualizacionValues {
  letraPrincipalAprendido: string
  codigoDepartamento: string
  nroRegistro: string
  continuacionCaso: boolean
  newCode: string
  caso: CasoActualizacionTable
}

interface Props {
  caso: CasoActualizacionTable | null
  onActualizar: (values: FormActualizacionValues) => void
}

type FormState = z.infer<typeof formSchema>

export function FormActualizacion({ caso, onActualizar }: Props) {
  const [continuacionCaso, setContinuacionCaso] = useState(true)

  const { data: letras } = useQuery({
    queryKey: ['letras'],
    queryFn: getIniciales,
    placeholderData: keepPreviousData,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
  })

  imprimir('caso en form', watch())

  const onSubmit = (values: FormState) => {
    onActualizar({
      letraPrincipalAprendido: values.letrasPrincipalAprendido?.label ?? '',
      codigoDepartamento: values.codigoDepartamento,
      nroRegistro: values.nroRegistro,
      continuacionCaso,
      newCode: values.newCode,
      caso: caso!,
    })
  }

  const onContinuacionChange = (value: boolean) => {
    setContinuacionCaso(value)
    if (value) {
      setValue('newCode', '', { shouldValidate: true, shouldDirty: true })
    } else {
      setValue('newCode', '12345', { shouldValidate: true, shouldDirty: true })
    }
  }

  useEffect(() => {
    if (caso) {
      reset({
        letrasPrincipalAprendido: undefined,
        codigoDepartamento: caso.codigoDepartamento ?? '',
        nroRegistro: caso.nroRegistro ?? '',
        newCode: '',
      })
    } else {
      reset({
        letrasPrincipalAprendido: undefined,
        codigoDepartamento: '',
        nroRegistro: '',
        newCode: '',
      })
    }
  }, [caso, reset])

  return (
    <div className="panel p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <AsyncSearchSelect<LetraInicial>
              control={control}
              name="letrasPrincipalAprendido"
              prefix="Letras Principal Aprendido"
              error={errors.letrasPrincipalAprendido?.message as string}
              originalData={letras ?? []}
              mapOption={(item) => ({
                label: item.letra,
                value: item.idLetra,
                original: item,
              })}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <InputWithPrefix
              name="codigoDepartamento"
              prefix="Codigo Departamento"
              register={register}
              error={errors.codigoDepartamento?.message as string}
            />
          </div>

          <div className="col-span-12 md:col-span-4 flex items-end gap-2">
            <InputWithPrefix
              name="nroRegistro"
              prefix="Nro de Registro"
              register={register}
              error={errors.nroRegistro?.message as string}
            />
            {caso && <IconPrinter />}
            {caso && <IconEdit />}
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-2 h-7">
              <span className="text-xs font-semibold">
                Continuacion del Caso
              </span>
              <button
                type="button"
                className={`btn btn-sm btn-success`}
                onClick={() => onContinuacionChange(true)}
                disabled={!caso}
              >
                Si
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-danger`}
                onClick={() => onContinuacionChange(false)}
                disabled={!caso}
              >
                No
              </button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <InputWithPrefix
              name="newCode"
              prefix="Nro Caso"
              register={register}
              error={errors.newCode?.message as string}
            />
          </div>

          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <button type="submit" className="btn btn-primary btn-sm">
              Actualizar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
