'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useAlerts, useSession } from '@/hooks'
import { encodeBase64, InterpreteMensajes, seguridadPass } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'

import IconX from '@/components/Icon/IconX'
import IconLockDots from '@/components/Icon/IconLockDots'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import IconEye from '@/components/Icon/IconEye'

/* ---------------- VALIDACIONES ---------------- */

const formSchema = z
  .object({
    oldPassword: z.string().min(1, 'Debe ingresar su contraseña anterior'),
    newPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .refine(async (p) => {
        const { score } = await seguridadPass(p)
        return score === 4
      }, { message: 'La contraseña no es muy segura' }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
  })

type FormValues = z.infer<typeof formSchema>

interface CambioPassModalProps {
  isOpen: boolean
  onClose: () => void
}

/* ---------------- COMPONENTE ---------------- */

export const CambioPassModal = ({ isOpen, onClose }: CambioPassModalProps) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()

  const [loading, setLoading] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)

      const resp = await sesionPeticion({
        url: `${Constantes.baseUrl}/usuarios/cuenta/contrasena`,
        method: 'patch',
        body: {
          contrasenaActual: encodeBase64(encodeURI(data.oldPassword)),
          contrasenaNueva: encodeBase64(encodeURI(data.newPassword)),
        },
      })

      Alerta({ mensaje: InterpreteMensajes(resp), variant: 'success' })
      onClose()
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">

      <div className="panel w-full max-w-lg animate__animated animate__zoomIn">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-white-light dark:border-dark/50 pb-4 mb-6">
          <div>
            <h5 className="text-lg font-semibold">Cambio de contraseña</h5>
            <p className="text-sm text-white-dark">
              Actualiza tu contraseña de acceso
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white-dark hover:text-danger"
          >
            <IconX />
          </button>
        </div>

        {/* INFO */}
        <ul className="text-sm text-white-dark mb-6 list-disc pl-5">
          <li>Mínimo 8 caracteres.</li>
          <li>Debe contener letras, números y símbolos.</li>
        </ul>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* OLD */}
          <div>
            <label className="form-label">Contraseña actual</label>

            <div className="relative">
              <IconLockDots className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dark" />

              <input
                type={showOld ? 'text' : 'password'}
                {...register('oldPassword')}
                className="form-input ps-10"
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-white-dark"
              >
                {showOld ? <IconEye /> : <IconEye />}
              </button>
            </div>

            <p className="text-danger text-sm">
              {errors.oldPassword?.message}
            </p>
          </div>

          {/* NEW */}
          <div>
            <label className="form-label">Nueva contraseña</label>

            <div className="relative">
              <IconLockDots className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dark" />

              <input
                type={showNew ? 'text' : 'password'}
                {...register('newPassword')}
                className="form-input ps-10"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-white-dark"
              >
                {showNew ? <IconEye /> : <IconEye />}
              </button>
            </div>

            <p className="text-danger text-sm">
              {errors.newPassword?.message}
            </p>
          </div>

          {watch('newPassword') && (
            <NivelSeguridadPass pass={watch('newPassword')} />
          )}

          {/* CONFIRM */}
          <div>
            <label className="form-label">Confirmar contraseña</label>

            <div className="relative">
              <IconLockDots className="absolute left-3 top-1/2 -translate-y-1/2 text-white-dark" />

              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword')}
                className="form-input ps-10"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-white-dark"
              >
                {showConfirm ? <IconEye /> : <IconEye />}
              </button>
            </div>

            <p className="text-danger text-sm">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <ProgresoLineal mostrar={loading} />

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-5 border-t border-white-light dark:border-dark/50">

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Guardando...' : 'Modificar'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}
