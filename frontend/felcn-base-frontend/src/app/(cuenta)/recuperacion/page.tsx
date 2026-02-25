'use client'

import { useEffect, useState } from 'react'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAlerts } from '@/hooks'
import { useForm } from 'react-hook-form'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Icono } from '@/components/Icono'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { CambioPass } from '@/app/login/ui/CambioPass'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

/*VALIDACION*/

const formSchema = z.object({
  correoElectronico: z.string().email({
    message: 'Debe ser un correo electrónico válido.',
  }),
})

type FormValues = z.infer<typeof formSchema>

/*COMPONENTE*/

export default function RecuperacionPage() {
  const [mensaje, setMensaje] = useState<string>('')
  const [code, setCode] = useState<string | undefined>('')

  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const [indicadorCarga, setIndicadorCarga] = useState<boolean>(false)
  const [indicadorTareaRealizada, setIndicadorTareaRealizada] =
    useState<boolean>(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { Alerta } = useAlerts()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      correoElectronico: '',
    },
  })

  useEffect(() => {
    const codigoDesbloqueo = searchParams.get('q')
    if (codigoDesbloqueo)
      validarRecuperarPeticion({ codigo: codigoDesbloqueo ?? '' }).finally()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*LOGICA ORIGINAL*/

  const recuperarPeticion = async ({ correoElectronico }: FormValues) => {
    try {
      setIndicadorCarga(true)
      await delay(1000)

      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/usuarios/recuperar`,
        body: { correoElectronico },
      })

      setMensaje(InterpreteMensajes(respuesta))
      setIndicadorTareaRealizada(true)
    } catch (e) {
      setMensaje(InterpreteMensajes(e))
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setIndicadorCarga(false)
    }
  }

  const validarRecuperarPeticion = async ({ codigo }: { codigo: string }) => {
    try {
      setIndicadorCarga(true)
      await delay(1000)

      const respuesta = await Servicios.post({
        url: `${Constantes.baseUrl}/usuarios/validar-recuperar`,
        body: { codigo },
      })

      setCode(respuesta?.datos?.code)
      setMensaje(InterpreteMensajes(respuesta))
      setIndicadorTareaRealizada(true)
    } catch (e) {
      setMensaje(InterpreteMensajes(e))
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
      await redireccionarInicio()
    } finally {
      setIndicadorCarga(false)
    }
  }

  const redireccionarInicio = async () => {
    mostrarFullScreen()
    await delay(500)
    router.replace('/login')
    ocultarFullScreen()
  }

  /* UI VRISTO*/

  return (
    <>
      <title>{`Recupera tu cuenta - ${siteName()}`}</title>
      <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center px-6">
        <div className="w-full max-w-[520px] rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">
          {!code && (
            <>
              {indicadorTareaRealizada ? (

                <div className="flex flex-col items-center gap-4 text-center">
                  <Icono fontSize="large">mark_email_unread</Icono>
                  <h1 className="text-2xl font-extrabold text-primary">
                    ¡Mensaje enviado!
                  </h1>

                  <p className="text-white-dark">
                    {mensaje}
                  </p>

                  <button
                    type="button"
                    className="btn btn-gradient w-full uppercase"
                    onClick={redireccionarInicio}
                  >
                    Ir al inicio
                  </button>

                </div>

              ) : (

                <form onSubmit={handleSubmit(recuperarPeticion)} className="space-y-5">

                  <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-primary">
                      Recupera tu cuenta
                    </h1>
                    <p className="text-white-dark">
                      Ingresa tu correo electrónico para recibir un enlace
                    </p>
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">
                      Correo electrónico
                    </label>

                    <input
                      {...register('correoElectronico')}
                      disabled={indicadorCarga}
                      className="form-input"
                    />

                    <p className="text-danger text-sm">
                      {errors.correoElectronico?.message}
                    </p>
                  </div>

                  <ProgresoLineal mostrar={indicadorCarga} />

                  <button
                    type="submit"
                    disabled={indicadorCarga}
                    className="btn btn-gradient w-full uppercase"
                  >
                    Enviar enlace
                  </button>

                  <button
                    type="button"
                    disabled={indicadorCarga}
                    onClick={redireccionarInicio}
                    className="btn btn-outline-primary w-full uppercase"
                  >
                    Cancelar
                  </button>

                </form>

              )}
            </>
          )}

          {code && <CambioPass code={code} />}

        </div>
      </div>
    </>
  )
}
