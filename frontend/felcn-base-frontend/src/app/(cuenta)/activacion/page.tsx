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
import Footer from '@/components/layouts/Footer'
import {
  Box,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Icono } from '@/components/Icono'
import Button from '@mui/material/Button'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import { useAlerts } from '@/hooks'
import { Visibility, VisibilityOff } from '@mui/icons-material'

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
          {!codigoActivar || linkVencido ? (
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
                {linkVencido ? 'Enlace vencido' : 'Enlace inválido'}
              </Typography>
              <Box height={'20px'} />
              <Typography variant="body2" color="text.secondary" align="center">
                {linkVencido
                  ? 'Este enlace de activación venció. Será redirigido al inicio en unos segundos; solicite uno nuevo desde el panel de administración.'
                  : 'Este enlace de activación no es válido. Solicite uno nuevo al administrador.'}
              </Typography>
              <Box height={'20px'} />
              <Button type="button" variant="contained" onClick={irAlLogin}>
                Ir al inicio
              </Button>
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
                Ya puede iniciar sesión con su usuario y la contraseña
                definida.
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
                Establezca su contraseña
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Para activar su cuenta, defina una contraseña segura.
              </Typography>
              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {watch('password') && (
                <NivelSeguridadPass pass={watch('password')} />
              )}
              <TextField
                label="Confirmar contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <ProgresoLineal mostrar={loading} />
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Activando...' : 'Activar cuenta'}
              </Button>
            </Box>
          )}
        </Card>
      </Grid>
      <Footer />
    </>
  )
}
