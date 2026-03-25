'use client'

import { useEffect } from 'react'
import LoginContainer from '@/app/login/ui/LoginContainer'
import LoginCoverVristo from '@/app/login/ui/LoginCoverVristo'
import { Constantes } from '@/config/Constantes'
import { imprimir } from '@/utils/imprimir'
import { useAlerts } from '@/hooks'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { delay, InterpreteMensajes } from '@/utils'
import { Servicios } from '@/services'
import { useQuery } from '@tanstack/react-query'

export default function LoginPage() {
  const { Alerta } = useAlerts()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const obtenerEstado = async () => {
    await delay(800)

    const respuesta = await Servicios.get({
      url: `${Constantes.authUrl}/estado`,
      body: {},
      headers: {
        accept: 'application/json',
      },
    })

    imprimir('Estado backend OK', respuesta)
    return respuesta
  }

  const { isLoading, error } = useQuery({
    queryKey: ['estado'],
    queryFn: obtenerEstado,
    retry: false,
  })

  useEffect(() => {
    isLoading ? mostrarFullScreen() : ocultarFullScreen()
  }, [isLoading, mostrarFullScreen, ocultarFullScreen])

  useEffect(() => {
    if (error) {
      imprimir('Error estado', error)
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    }
  }, [error, Alerta])

  return (
    <LoginCoverVristo>
      <LoginContainer />
    </LoginCoverVristo>
  )
}
