'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import {
  encodeBase64,
  InterpreteMensajes,
  seguridadPass,
  siteName,
} from '@/utils'
import { Icono } from '@/components/Icono'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import { useAlerts } from '@/hooks'
import IconLockDots from '@/components/Icon/IconLockDots'
import IconEye from '@/components/Icon/IconEye'
import LoginCoverVristo from '@/app/login/ui/LoginCoverVristo'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .refine(
        async (p) => {
          const { score } = await seguridadPass(p)
          return score === 4
        },
        { message: 'Contraseña insegura' }
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'No coinciden',
  })

type FormData = z.infer<typeof schema>

export default function ActivacionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { Alerta } = useAlerts()
  const codigoActivar = searchParams.get('q') || ''

  const [loading, setLoading] = useState(false)
  const [activada, setActivada] = useState(false)
  const [linkVencido, setLinkVencido] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      await Servicios.patch({
        url: `${Constantes.authUrl}/usuarios/cuenta/activacion`,
        body: {
          codigo: codigoActivar,
          contrasenaNueva: encodeBase64(encodeURI(data.password)),
        },
      })
      setActivada(true)
    } catch (e) {
      const mensaje = InterpreteMensajes(e)
      if (mensaje.includes('venció')) {
        setLinkVencido(true)
      } else {
        Alerta({ mensaje, variant: 'error' })
      }
    } finally {
      setLoading(false)
    }
  }

  const irAlLogin = () => {
    router.replace('/login')
  }

  useEffect(() => {
    if (!linkVencido) return
    const timeout = setTimeout(irAlLogin, 6000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkVencido])

  return (
    <>
      <title>{`Activación de cuenta - ${siteName()}`}</title>
      <LoginCoverVristo>
        <div className="w-full max-w-[420px] rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">
          {!codigoActivar || linkVencido ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <Icono fontSize="large">cancel</Icono>
              <h1 className="text-2xl font-extrabold text-primary">
                {linkVencido ? 'Enlace vencido' : 'Enlace inválido'}
              </h1>
              <p className="text-white-dark">
                {linkVencido
                  ? 'Este enlace de activación venció. Será redirigido al inicio en unos segundos; solicite uno nuevo desde el panel de administración.'
                  : 'Este enlace de activación no es válido. Solicite uno nuevo al administrador.'}
              </p>
              <button
                type="button"
                className="btn btn-gradient w-full uppercase"
                onClick={irAlLogin}
              >
                Ir al inicio
              </button>
            </div>
          ) : activada ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <Icono fontSize="large">check_circle</Icono>
              <h1 className="text-2xl font-extrabold text-primary">
                Cuenta activada
              </h1>
              <p className="text-white-dark">
                Ya puede iniciar sesión con su usuario y la contraseña
                definida.
              </p>
              <button
                type="button"
                className="btn btn-gradient w-full uppercase"
                onClick={irAlLogin}
              >
                Ir al inicio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-primary">
                  Establezca su contraseña
                </h1>
                <p className="text-white-dark">
                  Para activar su cuenta, defina una contraseña segura.
                </p>
              </div>

              <div>
                <label className="mb-0 block text-white-dark">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    disabled={loading}
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
                <p className="text-danger text-sm">
                  {errors.password?.message}
                </p>
                {watch('password') && (
                  <NivelSeguridadPass pass={watch('password')} />
                )}
              </div>

              <div>
                <label className="mb-0 block text-white-dark">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    disabled={loading}
                    className="form-input ps-10"
                  />
                  <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <IconLockDots />
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-white-dark hover:text-primary"
                  >
                    {showConfirmPassword ? <IconLockDots /> : <IconEye />}
                  </button>
                </div>
                <p className="text-danger text-sm">
                  {errors.confirmPassword?.message}
                </p>
              </div>

              <ProgresoLineal mostrar={loading} />

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gradient w-full uppercase"
              >
                {loading ? 'Activando...' : 'Activar cuenta'}
              </button>
            </form>
          )}
        </div>
      </LoginCoverVristo>
    </>
  )
}
