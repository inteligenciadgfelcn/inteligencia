'use client'
import { useState } from 'react'
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
import { Box, Card, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Icono } from '@/components/Icono'
import Button from '@mui/material/Button'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import { useAlerts } from '@/hooks'

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
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const irAlLogin = () => {
    router.replace('/login')
  }

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
            width: '100%',
          }}
        >
          {!codigoActivar ? (
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
                Link inválido
              </Typography>
              <Box height={'20px'} />
              <Typography variant="body2" color="text.secondary" align="center">
                Este link de activación no es válido. Solicitá uno nuevo al
                administrador.
              </Typography>
            </Box>
          ) : activada ? (
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
                Cuenta activada
              </Typography>
              <Box height={'20px'} />
              <Typography variant="body2" color="text.secondary" align="center">
                Ya podés iniciar sesión con tu usuario y la contraseña que
                definiste.
              </Typography>
              <Box height={'20px'} />
              <Button type="button" variant="contained" onClick={irAlLogin}>
                Ir al inicio
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              display={'flex'}
              flexDirection={'column'}
              gap={2}
            >
              <Typography
                sx={{ fontWeight: '600' }}
                variant={'subtitle2'}
                align="center"
              >
                Definí tu contraseña
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Para activar tu cuenta, elegí una contraseña segura.
              </Typography>
              <TextField
                label="Contraseña"
                type="password"
                fullWidth
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              {watch('password') && (
                <NivelSeguridadPass pass={watch('password')} />
              )}
              <TextField
                label="Confirmar contraseña"
                type="password"
                fullWidth
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
              <ProgresoLineal mostrar={loading} />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Activando...' : 'Activar cuenta'}
              </Button>
            </Box>
          )}
        </Card>
      </Grid>
    </>
  )
}
