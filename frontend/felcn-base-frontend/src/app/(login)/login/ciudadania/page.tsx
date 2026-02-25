'use client'
import { useCallback, useEffect, useRef } from 'react'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { imprimir } from '@/utils/imprimir'
import { delay, guardarCookie, InterpreteMensajes } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Box } from '@mui/material'
import { useAlerts } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import { useQuery } from '@tanstack/react-query'
import { ParsedUrlQuery } from 'querystring'

export default function CiudadaniaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { Alerta } = useAlerts()
  const { cargarUsuarioManual } = useAuth()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const procesadoRef = useRef(false)

  const parametros = Object.fromEntries(searchParams.entries())

  const manejarError = useCallback(
    async (mensaje: string) => {
      Alerta({ mensaje, variant: 'error' })
      mostrarFullScreen()
      await delay(1000)
      router.replace('/login')
      ocultarFullScreen()
    },
    [Alerta, mostrarFullScreen, router, ocultarFullScreen]
  )

  const autorizarCiudadania = useCallback(
    async (params: ParsedUrlQuery) => {
      if (Object.keys(params).length === 0 || searchParams.has('error')) {
        router.replace('/login')
        return null
      }

      const respuesta = await Servicios.get({
        url: `${Constantes.baseUrl}/ciudadania-autorizar`,
        body: {},
        params: params,
        headers: {
          accept: 'application/json',
        },
      })

      if (respuesta?.url) {
        const error = new URL(respuesta.url)
        throw new Error(
          error.searchParams.get('mensaje') || 'Error en autenticación'
        )
      }

      return respuesta
    },
    [router, searchParams]
  )

  const { data, error, isLoading } = useQuery({
    queryKey: ['autorizarCiudadania', parametros],
    queryFn: () => autorizarCiudadania(parametros),
    enabled: Object.keys(parametros).length > 0,
    retry: false,
  })

  useEffect(() => {
    if (isLoading) {
      mostrarFullScreen()
    } else {
      ocultarFullScreen()
    }
  }, [isLoading, mostrarFullScreen, ocultarFullScreen])

  useEffect(() => {
    if (error && !procesadoRef.current) {
      procesadoRef.current = true
      manejarError(InterpreteMensajes(error)).catch(imprimir)
    }
  }, [error, manejarError])

  useEffect(() => {
    if (data && !procesadoRef.current) {
      procesadoRef.current = true
      const procesarRespuesta = async () => {
        imprimir(`Sesión Autorizada`, data)
        guardarCookie('token', data.access_token)
        await cargarUsuarioManual()
      }
      procesarRespuesta().catch(imprimir)
    }
  }, [data, cargarUsuarioManual, router])

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <FullScreenLoading mensaje={'Ingresando con Ciudadanía'} />
    </Box>
  )
}
