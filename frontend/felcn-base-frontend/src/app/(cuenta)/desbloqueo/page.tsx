'use client'
import { useEffect } from 'react'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { imprimir } from '@/utils/imprimir'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Icono } from '@/components/Icono'
import { useQuery } from '@tanstack/react-query'
import LoginCoverVristo from '@/app/login/ui/LoginCoverVristo'

export default function DesbloqueoPage() {
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const router = useRouter()
  const searchParams = useSearchParams()

  const codigoDesbloqueo = searchParams.get('q') || ''

  const desbloquearCuenta = async () => {
    await delay(1000)
    return await Servicios.get({
      url: `${Constantes.authUrl}/usuarios/cuenta/desbloqueo`,
      params: {
        id: codigoDesbloqueo,
      },
    })
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['desbloquearCuenta', codigoDesbloqueo],
    queryFn: desbloquearCuenta,
    enabled: !!codigoDesbloqueo,
    retry: false,
  })

  useEffect(() => {
    if (error) {
      router.replace('/login')
    }
  }, [error, router])

  useEffect(() => {
    if (isLoading) {
      mostrarFullScreen()
    } else {
      ocultarFullScreen()
    }
  }, [isLoading, mostrarFullScreen, ocultarFullScreen])

  useEffect(() => {
    imprimir(`codigoDesbloqueo`, codigoDesbloqueo)
  }, [codigoDesbloqueo])

  const redireccionarInicio = async () => {
    mostrarFullScreen()
    await delay(1000)
    router.replace('/login')
    ocultarFullScreen()
  }

  const mensaje = error
    ? InterpreteMensajes(error)
    : data
      ? InterpreteMensajes(data)
      : ''

  if (isLoading) {
    return null
  }

  return (
    <>
      <title>{`Desbloqueo tu cuenta - ${siteName()}`}</title>
      <LoginCoverVristo>
        <div className="w-full max-w-[420px] rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">
          <div className="flex flex-col items-center gap-4 text-center">
            <Icono fontSize="large">
              {error ? 'cancel' : 'lock_open'}
            </Icono>
            <h1 className="text-2xl font-extrabold text-primary">
              {error ? 'Error al desbloquear cuenta' : 'Cuenta desbloqueada'}
            </h1>
            <p className="text-white-dark">{mensaje}</p>
            <button
              type="button"
              className="btn btn-gradient w-full uppercase"
              onClick={() => {
                redireccionarInicio().finally()
              }}
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </LoginCoverVristo>
    </>
  )
}
