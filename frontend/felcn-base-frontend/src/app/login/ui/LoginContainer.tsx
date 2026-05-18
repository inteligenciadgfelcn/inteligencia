'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
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

/* VALIDACIONES */
const formSchema = z.object({
  usuario: z.string().min(1, 'Usuario requerido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginContainer() {
  const router = useRouter()
  const { ingresar, progresoLogin } = useAuth()
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

  const iniciarSesion = async (data: FormValues) => {
    await ingresar(data)
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
