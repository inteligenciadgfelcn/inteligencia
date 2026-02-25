import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PoliticaCRUDType } from '@/app/admin/(configuracion)/politicas/types/PoliticasCRUDTypes'
import { RolType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'
import { useAlerts, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import IconX from '@/components/Icon/IconX'
import SelectWithIconField from '@/components/form/FormSelectWithIconField'
import FormInput from '@/components/form/FormInput'
import { MultiSelect } from '@/components/form/FormMultiSelect'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

/* ================= VALIDACIÓN ================= */

const formSchema = z.object({
  sujeto: z.string().min(1, { message: 'El sujeto es requerido' }),
  objeto: z.string().min(1, { message: 'El objeto es requerido' }),
  acciones: z
    .array(z.string())
    .min(1, { message: 'Al menos una acción es requerida' }),
  app: z.enum(['frontend', 'backend'], { message: 'La App es requerida' }),
})

type FormValues = z.infer<typeof formSchema>

/* ================= PROPS ================= */

export interface Props {
  isOpen: boolean
  onClose: () => void
  politica?: PoliticaCRUDType | null
  roles: RolType[]
  onSuccess: () => void
}

/* ================= COMPONENT ================= */

export const ModalPolitica = ({
  onClose,
  politica,
  roles,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()

  /* ================= OPCIONES ================= */

  const opcionesRoles = roles.map((r) => ({
    value: r.rol,
    label: r.rol,
  }))

  const opcionesApp = ['frontend', 'backend'].map((app) => ({
    value: app,
    label: app,
  }))

  const opcionesAccionesFrontend = ['create', 'read', 'update', 'delete']
  const opcionesAccionesBackend = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

  /* ================= FORM ================= */

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sujeto: politica?.sujeto,
      objeto: politica?.objeto,
      acciones: politica?.accion ? politica.accion.split('|') : [],
      app: politica?.app as 'frontend' | 'backend',
    },
  })

  /* ================= WATCH ================= */

  const valorSujeto = watch('sujeto')
  const valorApp = watch('app')
  const valorAcciones = watch('acciones')

  /* ================= ACCIONES SEGÚN APP ================= */

  const opcionesAcciones = (
    valorApp === 'frontend'
      ? opcionesAccionesFrontend
      : valorApp === 'backend'
        ? opcionesAccionesBackend
        : []
  ).map((accion) => ({
    value: accion,
    label: accion,
  }))

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: FormValues) => {
    if (loading) return
    try {
      setLoading(true)

      const submitData = {
        ...values,
        accion: values.acciones.join('|'),
      }

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/politicas`,
        method: politica ? 'patch' : 'post',
        body: submitData,
        params: politica,
      })

      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })

      onSuccess()
      onClose()
    } catch (e) {
      imprimir('Error al crear o actualizar política', e)
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  /* ================= JSX ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-black w-full max-w-lg rounded-lg shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b dark:border-gray-700">
          <div>
            <h2 className="font-bold text-lg">
              {politica ? 'Editar política' : 'Nueva política'}
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
            <SelectWithIconField
              label="Sujeto"
              name="sujeto"
              options={opcionesRoles}
              register={register}
              value={valorSujeto || ''}
              error={errors.sujeto?.message}
              disabled={loading}
            />

            <FormInput
              label="Objeto"
              name="objeto"
              register={register}
              error={errors.objeto?.message}
              disabled={loading}
            />

            <SelectWithIconField
              label="App"
              name="app"
              options={opcionesApp}
              register={register}
              value={valorApp || ''}
              error={errors.app?.message}
              disabled={loading}
            />

            <MultiSelect
              label="Acción"
              options={opcionesAcciones}
              value={valorAcciones}
              isDisabled={loading}
              error={errors.acciones?.message}
              onChange={(values) => {
                setValue('acciones', values)
                if (values.length > 0) clearErrors('acciones')
              }}
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
