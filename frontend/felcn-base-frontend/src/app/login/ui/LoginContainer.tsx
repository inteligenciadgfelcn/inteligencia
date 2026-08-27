'use client'

import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import IconMail from '@/components/Icon/IconMail'
import IconLockDots from '@/components/Icon/IconLockDots'

import { useAuth } from '@/context/AuthProvider'
import { OAuthButton } from './OAuthButton'
import { Constantes } from '@/config/Constantes'
import IconEye from '@/components/Icon/IconEye'
import { OtpCodeInput } from '@/components/form/OtpCodeInput'

/* VALIDACIONES */
const formSchema = z.object({
  usuario: z.string().min(1, 'Usuario requerido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
})

type FormValues = z.infer<typeof formSchema>

const otpSchema = z.object({
  codigo: z
    .string()
    .min(6, 'El código debe tener 6 dígitos')
    .max(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'Solo dígitos'),
})

type OtpFormValues = z.infer<typeof otpSchema>

export default function LoginContainer() {
  const router = useRouter()
  const { ingresar, progresoLogin, otpPendiente, verificarOtp, cancelarOtp } =
    useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const {
    control: controlOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp },
    reset: resetOtp,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { codigo: '' },
  })

  const iniciarSesion = async (data: FormValues) => {
    await ingresar(data)
  }

  const confirmarOtp = async (data: OtpFormValues) => {
    await verificarOtp(data.codigo)
  }

  const volverALogin = () => {
    resetOtp()
    cancelarOtp()
  }

  if (otpPendiente) {
    return (
      <div className="w-full max-w-[420px] rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary">
            Verificación en dos pasos
          </h1>
          <p className="text-white-dark">
            {otpPendiente.canal === 'WHATSAPP'
              ? `Te enviamos un código por WhatsApp a ${otpPendiente.destinoOfuscado}`
              : `Te enviamos un código a tu correo ${otpPendiente.destinoOfuscado}`}
          </p>
        </div>

        <form
          onSubmit={handleSubmitOtp(confirmarOtp)}
          className="space-y-5"
        >
          <div>
            <label className="mb-0 block text-center text-white-dark">
              Código de verificación
            </label>
            <Controller
              name="codigo"
              control={controlOtp}
              render={({ field }) => (
                <OtpCodeInput
                  value={field.value}
                  onChange={(codigo) => {
                    field.onChange(codigo)
                    if (codigo.length === 6) {
                      handleSubmitOtp(confirmarOtp)()
                    }
                  }}
                  disabled={mounted ? progresoLogin : false}
                  autoFocus
                />
              )}
            />
            <p className="text-danger text-sm text-center">
              {errorsOtp.codigo?.message}
            </p>
          </div>

          <button
            type="submit"
            disabled={mounted ? progresoLogin : false}
            className="btn btn-gradient w-full uppercase"
          >
            {mounted && progresoLogin ? 'Verificando...' : 'Verificar'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={volverALogin}
              className="text-primary text-sm font-semibold"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[420px] rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">
      {/* TITULO */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary">
          Inicio de sesión
        </h1>
        <p className="text-white-dark">Ingresa tus credenciales</p>
      </div>

      <form onSubmit={handleSubmit(iniciarSesion)} className="space-y-5">
        {/* USUARIO */}
        <div>
          <label className="mb-0 block text-white-dark">Usuario</label>
          <div className="relative">
            <input {...register('usuario')} className="form-input ps-10" />
            <span className="absolute start-4 top-1/2 -translate-y-1/2">
              <IconMail />
            </span>
          </div>
          <p className="text-danger text-sm">{errors.usuario?.message}</p>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="mb-0 block text-white-dark">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('contrasena')}
              className="form-input ps-10"
            />
            <span className="absolute start-4 top-1/2 -translate-y-1/2">
              <IconLockDots />
            </span>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-white-dark hover:text-primary"
            >
              {showPassword ? <IconLockDots /> : <IconEye />}
            </button>
          </div>
          <p className="text-danger text-sm">{errors.contrasena?.message}</p>
        </div>

        {/* OLVIDO */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => router.push('/recuperacion')}
            className="text-primary text-sm font-semibold"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* BOTON LOGIN */}
        <button
          type="submit"
          disabled={mounted ? progresoLogin : false}
          className="btn btn-gradient w-full uppercase"
        >
          {mounted && progresoLogin ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        {/* DIVIDER */}
        <div className="relative my-7 text-center">
          <span className="absolute inset-x-0 top-1/2 h-px bg-white-light"></span>
          <span className="relative bg-white px-2 text-white-dark uppercase font-bold">
            O
          </span>
        </div>

        {/* CIUDADANIA*/}
        <div className="w-full flex justify-center">
          <OAuthButton
            text="Ingresa con Ciudadanía"
            logoSrc="/logo_ciudadania_redondo.svg"
            onClick={() => {
              window.location.href = `${Constantes.authUrl}/ciudadania-auth`
            }}
          />
        </div>

        {/* REGISTER */}
        <div className="text-center">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-primary underline">
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  )
}
