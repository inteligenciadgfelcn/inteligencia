import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { RolType, UsuarioCRUDType } from '../types/usuariosCRUDTypes'
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  FormHelperText,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAlerts, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { stringToDayjs, validarFechaFormato } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { Icono } from '@/components/Icono'
import {
  TransitionSlide,
  TransitionZoom,
} from '@/components/modales/Animations'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

interface ModalUsuariosProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioCRUDType | null
  roles: RolType[]
  onSuccess: () => void
}

const formSchema = z.object({
  nombres: z.string().min(2, {
    message: 'El nombre es requerido.',
  }),
  primerApellido: z.string().min(2, {
    message: 'El primer apellido es requerido.',
  }),
  segundoApellido: z.string().optional(),
  nroDocumento: z.string().min(5, {
    message: 'El número de documento debe tener al menos 5 caracteres.',
  }),
  fechaNacimiento: z.string().refine(
    (date) => {
      return validarFechaFormato(date, 'YYYY-MM-DD')
    },
    {
      message: 'Fecha de nacimiento inválida',
    }
  ),
  // usuario: z.string().min(3, {
  //   message: 'El nombre de usuario debe tener al menos 3 caracteres.',
  // }),
  correoElectronico: z.string().email({
    message: 'Debe ser un correo electrónico válido.',
  }),
  telefono: z
    .string()
    .nullable()
    .refine(
      (value) => value === null || value === '' || /^[6-7]\d{7}$/.test(value),
      {
        message: 'Debe ser un teléfono válido',
      }
    )
    .optional(),
  roles: z.array(z.string()).min(1, {
    message: 'Debe seleccionar al menos un rol.',
  }),
})

type FormValuea = z.infer<typeof formSchema>

export const ModalUsuarios = ({
  isOpen,
  onClose,
  usuario,
  roles,
  onSuccess,
}: ModalUsuariosProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValuea>({
    resolver: zodResolver(formSchema),
    defaultValues: usuario
      ? {
          nombres: usuario.persona.nombres,
          primerApellido: usuario.persona.primerApellido,
          segundoApellido: usuario.persona.segundoApellido,
          nroDocumento: usuario.persona.nroDocumento,
          fechaNacimiento: usuario.persona.fechaNacimiento,
          // usuario: usuario.usuario,
          correoElectronico: usuario.correoElectronico,
          telefono: usuario.persona.telefono,
          roles: usuario.usuarioRol.map((value) => value.rol.id),
        }
      : {
          nombres: '',
          primerApellido: '',
          segundoApellido: '',
          nroDocumento: '',
          fechaNacimiento: '',
          // usuario: '',
          correoElectronico: '',
          telefono: '',
          roles: [],
        },
  })

  const onSubmit = async (values: FormValuea) => {
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios${usuario ? `/${usuario.id}` : ''}`,
        method: usuario ? 'patch' : 'post',
        body: {
          ...values,
          persona: {
            nombres: values.nombres,
            primerApellido: values.primerApellido,
            segundoApellido: values.segundoApellido,
            nroDocumento: values.nroDocumento,
            fechaNacimiento: values.fechaNacimiento,
            telefono: values.telefono === '' ? null : values.telefono,
          },
        },
      })
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      onSuccess()
      onClose()
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth="sm"
      open={isOpen}
      scroll={'body'}
      onClose={onClose}
      TransitionComponent={fullScreen ? TransitionSlide : TransitionZoom}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ fontWeight: '600', fontSize: 18 }}>
            {usuario ? 'Editar usuario' : 'Nuevo usuario'}
          </Typography>
          <IconButton onClick={onClose} color="inherit">
            <Icono color="inherit">close</Icono>
          </IconButton>
        </Grid>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              Datos personales
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel
                  htmlFor={'nroDocumento'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Nro. Documento
                </InputLabel>
                <TextField
                  {...register('nroDocumento')}
                  id="nroDocumento"
                  fullWidth
                  error={!!errors.nroDocumento}
                  helperText={errors.nroDocumento?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel
                  htmlFor={'nombre'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Nombre
                </InputLabel>
                <TextField
                  {...register('nombres')}
                  id="nombre"
                  fullWidth
                  error={!!errors.nombres}
                  helperText={errors.nombres?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel
                  htmlFor={'primerApellido'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Primer Apellido
                </InputLabel>
                <TextField
                  {...register('primerApellido')}
                  id="primerApellido"
                  fullWidth
                  error={!!errors.primerApellido}
                  helperText={errors.primerApellido?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel
                  htmlFor={'segundoApellido'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Segundo Apellido
                </InputLabel>
                <TextField
                  {...register('segundoApellido')}
                  id="segundoApellido"
                  fullWidth
                  error={!!errors.segundoApellido}
                  helperText={errors.segundoApellido?.message}
                  disabled={loading}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel
                  htmlFor={'fechaNacimiento'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Fecha de Nacimiento
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <Controller
                    name="fechaNacimiento"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        desktopModeMediaQuery={''}
                        value={
                          field.value
                            ? stringToDayjs(field.value, 'YYYY-MM-DD')
                            : null
                        }
                        onChange={(date) =>
                          field.onChange(date ? date.format('YYYY-MM-DD') : '')
                        }
                        slotProps={{
                          textField: {
                            id: 'fechaNacimiento',
                            fullWidth: true,
                            error: !!errors.fechaNacimiento,
                            helperText: errors.fechaNacimiento?.message,
                            disabled: loading,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              Datos de contacto
            </Typography>
            <Grid container direction="row" spacing={2}>
              <Grid size={{ xs: 12, xl: 6 }}>
                <InputLabel
                  htmlFor={'correoElectronico'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Correo Electrónico
                </InputLabel>
                <TextField
                  {...register('correoElectronico')}
                  id="correoElectronico"
                  fullWidth
                  type="email"
                  error={!!errors.correoElectronico}
                  helperText={errors.correoElectronico?.message}
                  disabled={loading}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InputLabel
                  htmlFor={'telefono'}
                  sx={{ color: 'text.primary', fontWeight: '500' }}
                >
                  Teléfono
                </InputLabel>
                <TextField
                  {...register('telefono')}
                  id="telefono"
                  fullWidth
                  error={!!errors.telefono}
                  helperText={errors.telefono?.message}
                  disabled={loading}
                  type="tel"
                />
              </Grid>
            </Grid>
            <Typography sx={{ fontWeight: '600' }} variant={'subtitle2'}>
              Datos de usuario
            </Typography>

            <Grid container direction="row" spacing={2}>
              <Grid size={12}>
                <InputLabel
                  htmlFor={'roles'}
                  sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                >
                  Roles
                </InputLabel>
                <Select
                  {...register('roles')}
                  id="roles"
                  fullWidth
                  multiple
                  size="small"
                  value={watch('roles')}
                  onChange={(event) => {
                    const value = event.target.value as string[]
                    setValue('roles', value, { shouldValidate: true })
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((id) => {
                        const role = roles.find((r) => r.id === id)
                        return role ? (
                          <Chip key={id} label={role.nombre} size="small" />
                        ) : null
                      })}
                    </Box>
                  )}
                  error={!!errors.roles}
                  disabled={loading}
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol.id} value={rol.id}>
                      <Checkbox checked={watch('roles').includes(rol.id)} />
                      <ListItemText primary={rol.nombre} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.roles && (
                  <FormHelperText error>{errors.roles.message}</FormHelperText>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <ProgresoLineal mostrar={loading} />
        <DialogActions>
          <Box
            sx={{
              p: '8px 16px',
              width: { xs: '100%', md: 'auto' },
              display: 'flex',
              flexDirection: {
                xs: 'column-reverse',
                md: 'row',
              },
              gap: 1,
            }}
          >
            <Button
              variant={'outlined'}
              disabled={loading}
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              variant={'contained'}
              disabled={loading}
              type={'submit'}
            >
              Guardar
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}
