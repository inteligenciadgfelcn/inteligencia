import React, { useState } from 'react'
import { useAlerts } from '@/hooks'
import { useRouter } from 'next/navigation'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useForm } from 'react-hook-form'
import { delay, encodeBase64, InterpreteMensajes, seguridadPass } from '@/utils'
import { Servicios } from '@/services'
import { imprimir } from '@/utils/imprimir'
import { Constantes } from '@/config/Constantes'
import { Icono } from '@/components/Icono'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import IconLockDots from '@/components/Icon/IconLockDots'
import IconEye from '@/components/Icon/IconEye'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface CambioPassParams {
  code: string
}

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .refine(
        async (newPassword) => {
          const { score } = await seguridadPass(newPassword)
          return score === 4
        },
        {
          message: 'La contraseña no es muy segura',
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof formSchema>

export const CambioPass = ({ code }: CambioPassParams) => {
  const { Alerta } = useAlerts()
  const [indicadorTareaRealizada, setIndicadorTareaRealizada] =
    useState<boolean>(false)
  const router = useRouter()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const [loading, setLoading] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    handleSubmit,
    watch,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (params: FormValues) => {
    try {
      setLoading(true)
      await delay(1000)
      const respuesta = await Servicios.peticion({
        url: `${Constantes.authUrl}/usuarios/cuenta/nueva-contrasena`,
        method: 'patch',
        body: {
          codigo: code,
          contrasenaNueva: encodeBase64(encodeURI(params.password)),
        },
      })
      imprimir(InterpreteMensajes(respuesta))
      setIndicadorTareaRealizada(true)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const redireccionarInicio = async () => {
    mostrarFullScreen()
    await delay(500)
    router.replace('/login')
    ocultarFullScreen()
  }

  if (indicadorTareaRealizada) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Icono fontSize="large">check_circle</Icono>
        <h1 className="text-2xl font-extrabold text-primary">
          Nueva contraseña
        </h1>
        <p className="text-white-dark">
          Recuperaste tu cuenta, inicia sesión con tu nueva contraseña
        </p>
        <button
          type="button"
          className="btn btn-gradient w-full uppercase"
          onClick={redireccionarInicio}
        >
          Ir al inicio
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary">
          Crea una nueva contraseña
        </h1>
        <p className="text-white-dark">
          Las contraseñas deben tener 8 caracteres o más, y usar palabras,
          números, símbolos y letras mayúsculas poco comunes.
        </p>
      </div>

      <div>
        <label className="mb-0 block text-white-dark">Nueva contraseña</label>
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
        <p className="text-danger text-sm">{errors.password?.message}</p>
        {watch('password') && <NivelSeguridadPass pass={watch('password')} />}
      </div>

      <div>
        <label className="mb-0 block text-white-dark">
          Repita su nueva contraseña
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
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        {loading ? 'Modificando...' : 'Modificar'}
      </button>

      <button
        type="button"
        onClick={redireccionarInicio}
        disabled={loading}
        className="btn btn-outline-primary w-full uppercase"
      >
        Cancelar
      </button>
    </form>
  )
}
