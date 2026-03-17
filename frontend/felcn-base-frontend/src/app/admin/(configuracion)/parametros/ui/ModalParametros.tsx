'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { ParametroCRUDType } from '@/app/admin/(configuracion)/parametros/types/parametrosCRUDTypes'
import { useAlerts, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import IconX from '@/components/Icon/IconX'
import FormInput from '@/components/form/FormInput'
import FormTextarea from '@/components/form/FormTextarea'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'

/* ================= VALIDACIÓN ================= */

const formSchema = z.object({
  codigo: z.string().min(1, 'Código obligatorio'),
  nombre: z.string().min(1, 'Nombre obligatorio'),
  grupo: z.string().min(1, 'Grupo obligatorio'),
  descripcion: z.string().min(1, 'Descripción obligatoria'),
})

type FormValues = z.infer<typeof formSchema>

/* ================= PROPS ================= */

interface Props {
  isOpen: boolean
  onClose: () => void
  parametro?: ParametroCRUDType | null
  onSuccess: () => void
}

/* ================= COMPONENT ================= */

export const ModalParametros = ({
  isOpen,
  onClose,
  parametro,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: parametro?.codigo || '',
      nombre: parametro?.nombre || '',
      grupo: parametro?.grupo || '',
      descripcion: parametro?.descripcion || '',
    },
  })

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: FormValues) => {
    if (loading) return
    try {
      setLoading(true)

      const resp = await sesionPeticion({
        url: `${Constantes.authUrl}/parametros${
          parametro ? `/${parametro.id}` : ''
        }`,
        method: parametro ? 'patch' : 'post',
        body: values,
      })

      Alerta({
        mensaje: InterpreteMensajes(resp),
        variant: 'success',
      })

      onSuccess()
      onClose()
    } catch (e) {
      imprimir('Error parámetro', e)
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  /* ================= JSX ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-black w-full max-w-lg rounded-lg shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b dark:border-gray-700">
          <div>
            <h2 className="font-bold text-lg">
              {parametro ? 'Editar parámetro' : 'Nuevo parámetro'}
            </h2>
            <p className="text-sm text-gray-500">
              Actualiza la información del parámetro
            </p>
          </div>

          <button onClick={onClose}>
            <IconX />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-5 grid grid-cols-1 gap-4">
            <FormInput
              label="Código"
              name="codigo"
              register={register}
              error={errors.codigo?.message}
              disabled={loading}
            />

            <FormInput
              label="Nombre"
              name="nombre"
              register={register}
              error={errors.nombre?.message}
              disabled={loading}
            />

            <FormInput
              label="Grupo"
              name="grupo"
              register={register}
              error={errors.grupo?.message}
              disabled={loading}
            />

            <FormTextarea
              label="Descripción"
              name="descripcion"
              rows={3}
              placeholder="Ingrese descripción"
              register={register}
              error={errors.descripcion?.message}
              disabled={loading}
            />
          </div>

          <ProgresoLineal mostrar={loading} />

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-5 py-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-outline-danger"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
