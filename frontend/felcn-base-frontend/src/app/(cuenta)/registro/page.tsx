'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useAlerts } from '@/hooks'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Icono } from '@/components/Icono'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import LoginCoverVristo from '@/app/login/ui/LoginCoverVristo'

const formSchema = z.object({
  correoElectronico: z.string().email({
    message: 'Debe ser un correo electrónico válido.',
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function RegistroPage() {
  const [mensaje, setMensaje] = useState<string>('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const router = useRouter()
  const { Alerta } = useAlerts()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { correoElectronico: '' },
  })

  const solicitarAcceso = async ({ correoElectronico }: FormValues) => {
    try {
      setCargando(true)
      await delay(1000)

      const respuesta = await Servicios.post({
        url: `${Constantes.authUrl}/usuarios/solicitudes-registro/acceso`,
        body: { correoElectronico: correoElectronico.trim() },
      })

      setMensaje(InterpreteMensajes(respuesta))
      setEnviado(true)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  const irAlInicio = async () => {
    mostrarFullScreen()
    await delay(500)
    router.replace('/login')
    ocultarFullScreen()
  }

  return (
    <>
      <title>{`Crear Cuenta - ${siteName()}`}</title>
      <LoginCoverVristo>
        <div className="w-full max-w-[420px] rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">
          {enviado ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <Icono fontSize="large">mark_email_unread</Icono>
              <h1 className="text-2xl font-extrabold text-primary">
                Revise su correo
              </h1>

              <p className="text-white-dark">{mensaje}</p>

              <button
                type="button"
                className="btn btn-gradient w-full uppercase"
                onClick={irAlInicio}
              >
                Ir al inicio
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(solicitarAcceso)}
              className="space-y-5"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-primary">
                  Crear Cuenta
                </h1>
                <p className="text-white-dark">
                  Ingrese su correo electrónico institucional o personal para
                  iniciar su preregistro. Le enviaremos un enlace para
                  completar el formulario.
                </p>
              </div>

              <div>
                <label className="mb-0 block text-white-dark">
                  Correo electrónico
                </label>

                <input
                  {...register('correoElectronico')}
                  disabled={cargando}
                  className="form-input"
                />

                <p className="text-danger text-sm">
                  {errors.correoElectronico?.message}
                </p>
              </div>

              <ProgresoLineal mostrar={cargando} />

              <button
                type="submit"
                disabled={cargando}
                className="btn btn-gradient w-full uppercase"
              >
                {cargando ? 'Enviando...' : 'Enviar enlace de preregistro'}
              </button>

              <div className="text-center">
                ¿Ya tiene cuenta?{' '}
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={irAlInicio}
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          )}
        </div>
      </LoginCoverVristo>
    </>
  )
}
