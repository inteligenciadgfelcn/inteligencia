import {
  AlertTitle,
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
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
import Typography from '@mui/material/Typography'
import { NivelSeguridadPass } from '@/components/utils/NivelSeguridadPass'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Visibility, VisibilityOff } from '@mui/icons-material'

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
        url: `${Constantes.baseUrl}/usuarios/cuenta/nueva-contrasena`,
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

  return (
    <Box>
      {!indicadorTareaRealizada && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            gap={2}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              gap={1}
            >
              <Icono fontSize={'large'}>password</Icono>
              <AlertTitle>Crea una nueva contraseña</AlertTitle>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              align="inherit"
              paddingLeft={2}
            >
              <li>Las contraseñas deben tener 8 caracteres o más.</li>
              <li>
                Las buenas contraseñas son difíciles de adivinar y usan
                palabras, números, símbolos y letras mayúsculas poco comunes.
              </li>
            </Typography>

            <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
              <Grid size={12}>
                <InputLabel
                  htmlFor={'contrasenaNueva'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Nueva contraseña
                </InputLabel>
                <TextField
                  {...register('password')}
                  id="contrasenaNueva"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={loading}
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
              </Grid>

              {watch('password') && (
                <Grid size={12}>
                  <NivelSeguridadPass pass={watch('password')} />
                </Grid>
              )}
              <Grid size={12}>
                <InputLabel
                  htmlFor={'contrasenaConfirmacion'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Repita su nueva contraseña
                </InputLabel>
                <TextField
                  {...register('confirmPassword')}
                  id="contrasenaConfirmacion"
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  disabled={loading}
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
              </Grid>
            </Grid>
            <ProgresoLineal mostrar={loading} />
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={0.5}
              alignSelf={'stretch'}
            >
              <Button
                variant={'contained'}
                disabled={loading}
                type={'submit'}
                fullWidth
              >
                Modificar
              </Button>
              <Button
                variant={'outlined'}
                onClick={redireccionarInicio}
                disabled={loading}
                fullWidth
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </form>
      )}
      {indicadorTareaRealizada && (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
        >
          <Icono fontSize={'large'} color={'success'}>
            check_circle
          </Icono>
          <Typography sx={{ fontWeight: '600' }}>Nueva contraseña</Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Recuperaste tu cuenta, inicia sesión con tu nueva contraseña
          </Typography>
          <Button
            type="button"
            variant="contained"
            onClick={redireccionarInicio}
          >
            <Typography sx={{ fontWeight: '600' }}>Ir al inicio</Typography>
          </Button>
        </Box>
      )}
    </Box>
  )
}
