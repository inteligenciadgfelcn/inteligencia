'use client'
import { useEffect } from 'react'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { imprimir } from '@/utils/imprimir'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Box, Card, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Icono } from '@/components/Icono'
import Button from '@mui/material/Button'
import { useQuery } from '@tanstack/react-query'

export default function DesbloqueoPage() {
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const router = useRouter()
  const searchParams = useSearchParams()

  const codigoDesbloqueo = searchParams.get('q') || ''

  const desbloquearCuenta = async () => {
    await delay(1000)
    return await Servicios.get({
      url: `${Constantes.baseUrl}/usuarios/cuenta/desbloqueo`,
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
    return null // O puedes mostrar un indicador de carga si lo prefieres
  }

  return (
    <>
      <title>{`Desbloqueo tu cuenta - ${siteName()}`}</title>
      <Grid
        container
        justifyContent="center"
        alignItems={'start'}
        mt={3}
        style={{ minHeight: '100vh' }}
      >
        <Card
          sx={{
            borderRadius: 4,
            p: 4,
            maxWidth: '450px',
          }}
        >
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Icono fontSize={'large'}> lock_open</Icono>
            <Box height={'20px'} />
            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              {error ? 'Error al desbloquear cuenta' : 'Cuenta desbloqueada'}
            </Typography>
            <Box height={'20px'} />
            <Typography variant="body2" color="text.secondary" align="center">
              {mensaje}
            </Typography>
            <Box height={'20px'} />
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                redireccionarInicio().finally()
              }}
            >
              <Typography>Ir al inicio</Typography>
            </Button>
          </Box>
        </Card>
      </Grid>
    </>
  )
}
