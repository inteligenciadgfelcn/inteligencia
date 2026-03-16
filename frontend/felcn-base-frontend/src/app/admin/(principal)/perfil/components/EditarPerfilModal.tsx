'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAlerts, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { UsuarioType } from '@/app/login/types/loginTypes'
import { useAuth } from '@/context/AuthProvider'

import IconUser from '@/components/Icon/IconUser'
import IconMail from '@/components/Icon/IconMail'
import IconPhone from '@/components/Icon/IconPhone'
import IconX from '@/components/Icon/IconX'
import IconSave from '@/components/Icon/IconSave'

/* ========================= */

interface EditarPerfilModalProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioType | null
}

const schema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  primerApellido: z.string().min(1, 'El primer apellido es requerido'),
  segundoApellido: z.string().optional(),
  correoElectronico: z.string().email('Correo inválido'),
  telefono: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

/* ========================= */

export const EditarPerfilModal = ({
  isOpen,
  onClose,
  usuario,
}: EditarPerfilModalProps) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const { actualizarPerfilCompleto } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombres: usuario?.persona.nombres || '',
      primerApellido: usuario?.persona.primerApellido || '',
      segundoApellido: usuario?.persona.segundoApellido || '',
      correoElectronico: usuario?.correoElectronico || '',
      telefono: usuario?.persona.telefono || '',
    },
  })

  if (!isOpen) return null

  const onSubmit = async (values: FormValues) => {
    try {
      await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/cuenta/perfil`,
        method: 'patch',
        body: values,
      })

      await actualizarPerfilCompleto()

      Alerta({ mensaje: 'Perfil actualizado correctamente', variant: 'success' })
      onClose()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">

      <div className="panel w-full max-w-xl animate__animated animate__zoomIn">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-white-light dark:border-dark/50 pb-4 mb-6">
          <div>
            <h5 className="text-lg font-semibold">Editar Perfil</h5>
            <p className="text-sm text-white-dark">
              Actualiza tu información personal
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white-dark hover:text-danger"
          >
            <IconX />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* DATOS PERSONALES */}
          <div>
            <h6 className="font-semibold mb-3">Datos personales</h6>

            <div className="space-y-4">

              {/* NOMBRES */}
              <div>
                <label className="mb-0 block text-white-dark">
                  Nombres
                </label>

                <div className="relative">
                  <IconUser className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark" />
                  <input
                    {...register('nombres')}
                    disabled={isSubmitting}
                    className="form-input ps-10"
                  />
                </div>

                <p className="text-danger text-sm">
                  {errors.nombres?.message}
                </p>
              </div>

              {/* APELLIDOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="mb-0 block text-white-dark">
                    Primer Apellido
                  </label>

                  <input
                    {...register('primerApellido')}
                    disabled={isSubmitting}
                    className="form-input"
                  />

                  <p className="text-danger text-sm">
                    {errors.primerApellido?.message}
                  </p>
                </div>

                <div>
                  <label className="mb-0 block text-white-dark">
                    Segundo Apellido
                  </label>

                  <input
                    {...register('segundoApellido')}
                    disabled={isSubmitting}
                    className="form-input"
                  />
                </div>

              </div>

            </div>
          </div>

          {/* CONTACTO */}
          <div>
            <h6 className="font-semibold mb-3">Contacto</h6>

            <div className="space-y-4">

              {/* EMAIL */}
              <div>
                <label className="mb-0 block text-white-dark">
                  Correo electrónico
                </label>

                <div className="relative">
                  <IconMail className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark" />
                  <input
                    {...register('correoElectronico')}
                    disabled={isSubmitting}
                    type="email"
                    className="form-input ps-10"
                  />
                </div>

                <p className="text-danger text-sm">
                  {errors.correoElectronico?.message}
                </p>
              </div>

              {/* TELEFONO */}
              <div>
                <label className="mb-0 block text-white-dark">
                  Teléfono
                </label>

                <div className="relative">
                  <IconPhone className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark" />
                  <input
                    {...register('telefono')}
                    disabled={isSubmitting}
                    type="tel"
                    className="form-input ps-10"
                  />
                </div>

                <p className="text-danger text-sm">
                  {errors.telefono?.message}
                </p>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white-light dark:border-dark/50">

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isSubmitting}
            >
              <IconSave />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>

          </div>

        </form>

      </div>
    </div>
  )
}
