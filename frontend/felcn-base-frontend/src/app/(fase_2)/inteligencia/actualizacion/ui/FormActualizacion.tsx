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
import {
  generateNroCaso,
  saveAssignNroCaso,
} from '../services/actualizacion.service'
import { InterpreteMensajes } from '@/utils'
import { useAlerts } from '@/hooks'

const selectSchema = (message: string) =>
  z.preprocess(
    (val) => (val === null ? undefined : val),
    z.object(
      {
        value: z.string(),
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
  onActualizar: () => void
}

type FormState = z.infer<typeof formSchema>

export function FormActualizacion({ caso, onActualizar }: Props) {
  const [continuacionCaso, setContinuacionCaso] = useState(true)
  const [loading, setLoading] = useState(false)
  const { Alerta } = useAlerts()

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
    setValue,
    getValues,
    trigger,
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: FormState) => {
    try {
      setLoading(true)
      const code = await saveAssignNroCaso(
        getValues('nroRegistro'),
        getValues('codigoDepartamento'),
        getValues('letrasPrincipalAprendido')?.label
      )

      Alerta({
        mensaje: InterpreteMensajes({
          mensaje: 'Número de caso guardado correctamente.',
        }),
        variant: 'success',
      })

      onActualizar()
    } catch (error) {
      imprimir('Error generando número de caso', error)
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const onContinuacionChange = async (value: boolean) => {
    setContinuacionCaso(value)
    if (value) {
      setValue('newCode', '', { shouldValidate: true, shouldDirty: true })
    } else {
      handleGenNroCaso()
    }
  }

  const handleGenNroCaso = async () => {
    const fieldsToValidate: (keyof FormState)[] = [
      'letrasPrincipalAprendido',
      'codigoDepartamento',
      'nroRegistro',
    ]

    // Validar solo los campos requeridos para asignar número de registro
    const isValid = await trigger(fieldsToValidate)
    if (!isValid) {
      return
    }

    try {
      setLoading(true)
      const code = await generateNroCaso(
        getValues('codigoDepartamento'),
        getValues('letrasPrincipalAprendido')?.label
      )

      Alerta({
        mensaje: InterpreteMensajes({
          mensaje: 'Número de caso generado correctamente.',
        }),
        variant: 'success',
      })

      // Si la respuesta contiene el número de registro, actualizarlo en el form
      if (code) {
        setValue('newCode', code, { shouldValidate: true, shouldDirty: true })
      }
    } catch (error) {
      imprimir('Error generando número de caso', error)
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (caso) {
      reset({
        letrasPrincipalAprendido: undefined,
        codigoDepartamento: caso.abreviaturaDepartamento ?? '',
        nroRegistro: caso.numeroOperativo ?? '',
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
                label: item.descripcion,
                value: item.descripcion,
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
                disabled={!caso || loading}
              >
                Si
              </button>
              <button
                type="button"
                className={`btn btn-sm btn-danger`}
                onClick={() => onContinuacionChange(false)}
                disabled={!caso || loading}
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

          <div className="col-span-12 md:col-span-4 flex md:justify-start">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              Actualizar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
