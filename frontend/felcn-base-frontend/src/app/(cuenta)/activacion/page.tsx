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
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { useQuery } from '@tanstack/react-query'

export default function ActivacionPage() {
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()
  const router = useRouter()
  const searchParams = useSearchParams()

  const codigoActivar = searchParams.get('q') || ''

  const activarCuenta = async () => {
    await delay(1000)
    return await Servicios.patch({
      url: `${Constantes.baseUrl}/usuarios/cuenta/activacion`,
      body: {
        codigo: codigoActivar,
      },
    })
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ['activarCuenta', codigoActivar],
    queryFn: activarCuenta,
    enabled: !!codigoActivar,
  })

  useEffect(() => {
    if (isLoading) {
      mostrarFullScreen()
    } else {
      ocultarFullScreen()
    }
  }, [isLoading, mostrarFullScreen, ocultarFullScreen])

  useEffect(() => {
    imprimir(`codigoActivar`, codigoActivar)
  }, [codigoActivar])

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

  return (
    <>
      <title>{`Activación de cuenta - ${siteName()}`}</title>
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
            {!error && !isLoading && (
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <Icono fontSize={'large'} color={'success'}>
                  check_circle
                </Icono>
                <Box height={'20px'} />
                <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
                  Cuenta Activa
                </Typography>
                <Box height={'20px'} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {mensaje}
                </Typography>
                <Box height={'20px'} />
              </Box>
            )}
            {error && !isLoading && (
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <Icono fontSize={'large'} color={'error'}>
                  cancel
                </Icono>
                <Box height={'20px'} />
                <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
                  Error al activar cuenta
                </Typography>
                <Box height={'20px'} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {mensaje}
                </Typography>
                <Box height={'20px'} />
              </Box>
            )}
            {isLoading && (
              <Box>
                <Typography>procesando..</Typography>
                <Box height={'20px'} />
                <ProgresoLineal mostrar={isLoading} />
              </Box>
            )}
            {!isLoading && (
              <Button
                type="submit"
                variant="contained"
                onClick={() => {
                  redireccionarInicio().finally()
                }}
              >
                <Typography>Ir al inicio</Typography>
              </Button>
            )}
          </Box>
        </Card>
      </Grid>
    </>
  )
}
