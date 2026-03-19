'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import IconMail from '@/components/Icon/IconMail'
import IconLockDots from '@/components/Icon/IconLockDots'

import { encodeBase64, InterpreteMensajes, seguridadPass } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { formatoFecha, validarFechaFormato } from '@/utils/fechas'
import { useAlerts } from '@/hooks'
import { useRouter } from 'next/navigation'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import { BASE_PATH } from '@/imageLoader'

/* VALIDACIONES*/

const schema = z
  .object({
    nroDocumento: z.string().min(1, 'Ingrese Nro. Documento'),
    nombres: z.string().min(1, 'Ingrese nombres'),
    primerApellido: z.string().min(1, 'Ingrese primer apellido'),
    segundoApellido: z.string().optional(),
    fechaNacimiento: z
      .string()
      .refine((d) => validarFechaFormato(d, 'YYYY-MM-DD'), {
        message: 'Fecha inválida',
      }),
    correoElectronico: z.string().email('Correo inválido'),
    telefono: z.string().optional(),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .refine(async (p) => {
        const { score } = await seguridadPass(p)
        return score === 4
      }, { message: 'Contraseña insegura' }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'No coinciden',
  })

type FormData = z.infer<typeof schema>

/* COMPONENTE */

export default function RegisterVristo() {
  const { Alerta } = useAlerts()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const resp = await Servicios.peticion({
        url: `${Constantes.authUrl}/usuarios/crear-cuenta`,
        method: 'post',
        body: {
          correoElectronico: data.correoElectronico,
          contrasenaNueva: encodeBase64(encodeURI(data.password)),
          persona: {
            nombres: data.nombres,
            primerApellido: data.primerApellido,
            segundoApellido: data.segundoApellido,
            nroDocumento: data.nroDocumento,
            telefono: data.telefono || null,
            fechaNacimiento: formatoFecha(data.fechaNacimiento, 'YYYY-MM-DD'),
          },
        },
      })

      Alerta({
        mensaje: InterpreteMensajes(resp),
        variant: 'success',
      })

      router.replace('/login')
    } catch (e) {
      Alerta({
        mensaje: InterpreteMensajes(e),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6"
      style={{ backgroundImage: `url(${BASE_PATH}/assets/images/auth/map.png)` }}
    >
      <div className="w-full max-w-[520px] rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">

        {/* TÍTULO */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary">
            Crear Cuenta
          </h1>
          <p className="text-white-dark">
            Complete el formulario para registrarse
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* DOCUMENTO */}
          <div>
            <label className="mb-0 block text-white-dark">
              Nro. Documento
            </label>
            <input
              {...register('nroDocumento')}
              className="form-input"
            />
            <p className="text-danger text-sm">
              {errors.nroDocumento?.message}
            </p>
          </div>

          {/* NOMBRES */}
          <div>
            <label className="mb-0 block text-white-dark">
              Nombres
            </label>
            <input
              {...register('nombres')}
              className="form-input"
            />
            <p className="text-danger text-sm">
              {errors.nombres?.message}
            </p>
          </div>

          {/* APELLIDOS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-0 block text-white-dark">
                Primer Apellido
              </label>
              <input
                {...register('primerApellido')}
                className="form-input"
              />
            </div>

            <div>
              <label className="mb-0 block text-white-dark">
                Segundo Apellido
              </label>
              <input
                {...register('segundoApellido')}
                className="form-input"
              />
            </div>
          </div>

          {/* FECHA */}
          <div>
            <label className="mb-0 block text-white-dark">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              {...register('fechaNacimiento')}
              className="form-input"
            />
            <p className="text-danger text-sm">
              {errors.fechaNacimiento?.message}
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-0 block text-white-dark">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                {...register('correoElectronico')}
                className="form-input ps-10"
              />
              <span className="absolute start-4 top-1/2 -translate-y-1/2">
                <IconMail />
              </span>
            </div>
            <p className="text-danger text-sm">
              {errors.correoElectronico?.message}
            </p>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-0 block text-white-dark">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                className="form-input ps-10"
              />
              <span className="absolute start-4 top-1/2 -translate-y-1/2">
                <IconLockDots />
              </span>
            </div>
            <p className="text-danger text-sm">
              {errors.password?.message}
            </p>
          </div>

          {watch('password') && (
            <NivelSeguridadPass pass={watch('password')} />
          )}

          {/* CONFIRM */}
          <div>
            <label className="mb-0 block text-white-dark">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                {...register('confirmPassword')}
                className="form-input ps-10"
              />
              <span className="absolute start-4 top-1/2 -translate-y-1/2">
                <IconLockDots />
              </span>
            </div>
            <p className="text-danger text-sm">
              {errors.confirmPassword?.message}
            </p>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-gradient w-full uppercase"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          {/* LINK */}
          <div className="text-center">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-primary underline">
              Iniciar sesión
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}
