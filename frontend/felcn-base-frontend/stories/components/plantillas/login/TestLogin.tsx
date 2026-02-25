import type { NextPage } from 'next'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import Image from 'next/image'
import camion from './../../../assets/envio-camion.png'
import { useState } from 'react'
import { Icono } from '@/components/Icono'
import { delay } from '@/utils'
import { useForm } from 'react-hook-form'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { OAuthButton } from '@/app/login/ui/OAuthButton'

const formSchema = z.object({
  usuario: z.string().min(1, { message: 'Este campo es requerido' }),
  contrasena: z.string().min(1, { message: 'Este campo es requerido' }),
})
type FormValues = z.infer<typeof formSchema>

const TestLogin: NextPage = () => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))

  const [modalLogin, setModalLogin] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const cerrarModalLogin = async () => {
    setModalLogin(false)
    await delay(500)
  }
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuario: 'ADMINISTRADOR-TECNICO',
      contrasena: '123',
    },
  })

  const onSubmit = () => {
    setModalLogin(false)
  }

  const progresoLogin = false

  return (
    <Box>
      <Grid
        size={{
          xl: 6,
          md: 5,
          xs: 12,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={sm || xs ? '30vh' : '80vh'}
          color={'primary'}
        >
          <Box
            display="flex"
            flexDirection={'column'}
            border={1}
            borderColor={'ActiveCaption'}
            width={{ xs: '85%', sm: '320px' }}
            borderRadius={3}
            paddingY={4}
            paddingX={xs ? 2 : 5}
          >
            <Grid size={12}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection={sm || xs ? 'column' : 'row'}
              >
                <Image
                  src={camion}
                  alt={'login'}
                  width="60"
                  height="60"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
                <Box width={10}></Box>
                <Typography
                  variant={'h6'}
                  component="h6"
                  fontWeight={'500'}
                  align={sm || xs ? 'center' : 'left'}
                >
                  Sistema de Delivery
                </Typography>
              </Box>
            </Grid>
            <Grid size={12}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexDirection="column"
                mt={2}
              >
                <Typography
                  variant={'body1'}
                  component="h6"
                  fontWeight={'500'}
                  align="center"
                >
                  Acceso para Administradores
                </Typography>
                <Box width={10}></Box>
                <Typography
                  variant={'body2'}
                  component="h6"
                  fontWeight={'300'}
                  align="center"
                >
                  Al ingresar tendrás acceso a los siguientes módulos
                </Typography>
              </Box>
            </Grid>
            <Grid
              display={'flex'}
              mt={3}
              justifyContent={'start'}
              flexDirection={'column'}
              size={12}
            >
              <Box
                display="flex"
                alignItems="start"
                //flexDirection={sm || xs ? 'row' : 'column'}
                flexDirection="row"
              >
                <Icono
                  fontSize={'large'}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  local_shipping
                </Icono>
                <Box width={20}></Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" fontWeight={'600'} fontSize={15}>
                    Gestión de pedidos
                  </Typography>
                  <Typography variant="body1" fontWeight={300} fontSize={13}>
                    Organización y logística de pedidos
                  </Typography>
                </Box>
              </Box>
              <Box height={20}></Box>
              <Box
                display="flex"
                alignItems="start"
                //flexDirection={sm || xs ? 'row' : 'column'}
                flexDirection="row"
              >
                <Icono
                  fontSize={'large'}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  scale
                </Icono>
                <Box width={20}></Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" fontWeight={'600'} fontSize={15}>
                    Reglas de pesos
                  </Typography>
                  <Typography variant="body1" fontWeight={300} fontSize={13}>
                    Establecer rangos de peso para transporte
                  </Typography>
                </Box>
              </Box>
              <Box height={20}></Box>
              <Box
                display="flex"
                alignItems="start"
                //flexDirection={sm || xs ? 'row' : 'column'}
                flexDirection="row"
              >
                <Icono
                  fontSize={'large'}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  map
                </Icono>
                <Box width={20}></Box>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" fontWeight={'600'} fontSize={15}>
                    Zonas de operación
                  </Typography>
                  <Typography variant="body1" fontWeight={300} fontSize={13}>
                    Definir áreas donde se realizaran las entregas
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid paddingX={6} size={20}>
              <Box sx={{ height: 30 }}></Box>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: theme.palette.primary.main,
                }}
                onClick={() => setModalLogin(true)}
              >
                <Typography sx={{ fontWeight: '600' }}>
                  Iniciar sesión
                </Typography>
              </Button>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Dialog
        fullWidth={true}
        open={modalLogin}
        onClose={cerrarModalLogin}
        maxWidth="xs"
        scroll="body"
      >
        <DialogTitle>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            p={0}
          >
            <Box />
            <IconButton onClick={cerrarModalLogin} color={'inherit'}>
              <Icono color={'inherit'}>close</Icono>
            </IconButton>
          </Grid>
        </DialogTitle>
        {/* <LoginContainer /> */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display={'grid'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{ borderRadius: 12 }}
            padding={0}
            mb={2}
          >
            <Typography align={'center'} sx={{ fontWeight: '600' }}>
              Inicio de Sesión
            </Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography
                fontSize={14}
                variant={'body1'}
                color={'text.secondary'}
              >
                Ingresa tus credenciales para iniciar sesión
              </Typography>
            </Box>

            <InputLabel
              htmlFor={'usuario'}
              sx={{ color: 'text.primary', fontWeight: '500' }}
            >
              Usuario
            </InputLabel>
            <TextField
              {...register('usuario')}
              id="usuario"
              fullWidth
              error={!!errors.usuario}
              helperText={errors.usuario?.message}
            />
            <Box sx={{ mt: 1, mb: 1 }}></Box>
            <InputLabel
              htmlFor={'contrasena'}
              sx={{ color: 'text.primary', fontWeight: '500', mt: 2 }}
            >
              Contraseña
            </InputLabel>
            <TextField
              {...register('contrasena')}
              id="contrasena"
              fullWidth
              size="medium"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.contrasena}
              helperText={errors.contrasena?.message}
              disabled={progresoLogin}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ mt: 0.5, mb: 0.5 }}>
              <ProgresoLineal mostrar={progresoLogin} />
            </Box>
            <Box display="flex" flex="1" justifyContent="start">
              <Button
                onClick={async () => { }}
                size={'small'}
                variant={'text'}
                disabled={progresoLogin}
                color={'primary'}
              >
                <Typography fontSize={'small'} sx={{ fontWeight: '600' }}>
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Button>
            </Box>
            <Box sx={{ height: 15 }}></Box>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={progresoLogin}
            >
              <Typography sx={{ fontWeight: '600' }}>Iniciar sesión</Typography>
            </Button>

            <Box sx={{ pt: 2, pb: 2 }}>
              <Divider>
                <Typography color="text.secondary">O</Typography>
              </Divider>
            </Box>
            <OAuthButton
              fullWidth
              logoSrc={`logo_ciudadania_redondo${theme.palette.mode === 'dark' ? '_N' : ''}.svg`}
              disabled={progresoLogin}
              altText={'Ingresar con Ciudadanía'}
              text="Ingresar con Ciudadanía"
            >
              <Typography sx={{ fontWeight: '600', pl: 1, pr: 1 }}>
                Ingresa con Ciudadanía
              </Typography>
            </OAuthButton>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" textAlign="center" fontSize={14}>
                ¿No tienes una cuenta?{' '}
                <Button
                  variant="text"
                  sx={{ p: 0 }}
                  disabled={progresoLogin}
                  onClick={async () => { }}
                >
                  Regístrate
                </Button>
              </Typography>
            </Box>
          </Box>
        </form>
      </Dialog>
    </Box>
  )
}
export default TestLogin
