'use client'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { RolType } from '../types/usuariosCRUDTypes'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Chip,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAlerts, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { stringToDayjs, validarFechaFormato } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { Icono } from '@/components/Icono'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

interface FormularioUsuarioProps {
  usuarioId?: string
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
  ciudadaniaDigital: z.boolean().default(false),
  idGrado: z.number().nullable().optional(),
  idGrupo: z.number().nullable().optional(),
  numeroPase: z.string().nullable().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface SnapshotVerificacion {
  nroDocumento: string
  fechaNacimiento: string
}

export const FormularioUsuario = ({ usuarioId }: FormularioUsuarioProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [idUnidad, setIdUnidad] = useState<number | null>(null)
  const [idDistrital, setIdDistrital] = useState<number | null>(null)
  const [verificadoSegip, setVerificadoSegip] = useState<boolean>(false)
  const [verificandoSegip, setVerificandoSegip] = useState<boolean>(false)
  const [snapshotVerificado, setSnapshotVerificado] =
    useState<SnapshotVerificacion | null>(null)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const router = useRouter()

  const obtenerUsuario = async () => {
    if (!usuarioId) return null
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/usuarios/${usuarioId}`,
    })
    return respuesta.datos
  }

  const obtenerRoles = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/autorizacion/roles`,
    })
    return respuesta.datos
  }

  const { data: usuario } = useQuery({
    queryKey: ['usuario', usuarioId],
    queryFn: obtenerUsuario,
    enabled: !!usuarioId,
  })

  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: obtenerRoles,
  })

  const obtenerGrados = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/lookups/grados`,
    })
    return respuesta.datos ?? []
  }

  const obtenerUnidades = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/lookups/unidades`,
    })
    return respuesta.datos ?? []
  }

  const obtenerDistritales = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/lookups/distritales/unidad/${idUnidad}`,
    })
    return respuesta.datos ?? []
  }

  const obtenerGrupos = async () => {
    const respuesta = await sesionPeticion({
      url: `${Constantes.authUrl}/lookups/grupos/distrital/${idDistrital}`,
    })
    return respuesta.datos ?? []
  }

  const { data: grados = [] } = useQuery({
    queryKey: ['lookups-grados'],
    queryFn: obtenerGrados,
  })

  const { data: unidades = [] } = useQuery({
    queryKey: ['lookups-unidades'],
    queryFn: obtenerUnidades,
  })

  const { data: distritales = [] } = useQuery({
    queryKey: ['lookups-distritales', idUnidad],
    queryFn: obtenerDistritales,
    enabled: !!idUnidad,
  })

  const { data: grupos = [] } = useQuery({
    queryKey: ['lookups-grupos', idDistrital],
    queryFn: obtenerGrupos,
    enabled: !!idDistrital,
  })

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      nroDocumento: '',
      fechaNacimiento: '',
      correoElectronico: '',
      telefono: '',
      roles: [],
      ciudadaniaDigital: false,
      idGrado: null,
      idGrupo: null,
      numeroPase: '',
    },
  })

  useEffect(() => {
    if (usuario) {
      reset({
        nombres: usuario.persona.nombres,
        primerApellido: usuario.persona.primerApellido,
        segundoApellido: usuario.persona.segundoApellido,
        nroDocumento: usuario.persona.nroDocumento,
        fechaNacimiento: usuario.persona.fechaNacimiento,
        correoElectronico: usuario.correoElectronico,
        telefono: usuario.persona.telefono,
        roles: usuario.usuarioRol.map((value: any) => value.rol.id),
        ciudadaniaDigital: usuario.ciudadaniaDigital ?? false,
        idGrado: usuario.idGrado ?? null,
        idGrupo: usuario.idGrupo ?? null,
        numeroPase: usuario.numeroPase ?? '',
      })
      // Pre-populate cascade: unidad → distrital → grupo
      const unidadId = usuario.grupo?.distrital?.unidad?.id ?? null
      const distritalId = usuario.grupo?.distrital?.id ?? null
      setIdUnidad(unidadId)
      setIdDistrital(distritalId)
      // Usuario con ciudadanía digital ya tenía datos verificados al crearlo
      if (usuario.ciudadaniaDigital) {
        setVerificadoSegip(true)
        setSnapshotVerificado({
          nroDocumento: usuario.persona.nroDocumento,
          fechaNacimiento: usuario.persona.fechaNacimiento,
        })
      }
    }
  }, [usuario, reset])

  // Datos que determinan si el snapshot de verificación sigue vigente
  const nroDocumentoActual = watch('nroDocumento')
  const fechaNacimientoActual = watch('fechaNacimiento')

  const datosModificadosDesdeVerificacion =
    verificadoSegip &&
    snapshotVerificado !== null &&
    (nroDocumentoActual !== snapshotVerificado.nroDocumento ||
      fechaNacimientoActual !== snapshotVerificado.fechaNacimiento)

  // Resetear verificación si el usuario edita los campos clave después de haber verificado
  useEffect(() => {
    if (datosModificadosDesdeVerificacion) {
      setVerificadoSegip(false)
      setSnapshotVerificado(null)
    }
  }, [nroDocumentoActual, fechaNacimientoActual, datosModificadosDesdeVerificacion])

  const verificarConSegip = async () => {
    const nroDocumento = watch('nroDocumento')
    const fechaNacimiento = watch('fechaNacimiento')
    const nombres = watch('nombres')
    const primerApellido = watch('primerApellido')
    const segundoApellido = watch('segundoApellido')

    if (!nroDocumento || !fechaNacimiento) {
      Alerta({
        mensaje: 'Ingrese el número de documento y fecha de nacimiento antes de verificar.',
        variant: 'warning',
      })
      return
    }

    // Convertir de YYYY-MM-DD a dd/MM/yyyy requerido por la API
    const [year, month, day] = fechaNacimiento.split('-')
    const fechaFormateada = `${day}/${month}/${year}`

    try {
      setVerificandoSegip(true)
      const response = await fetch(
        `${Constantes.consultaPersonaUrl}/v1/persona`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': Constantes.consultaPersonaApiKey,
          },
          body: JSON.stringify({
            numero_documento: nroDocumento,
            fecha_nacimiento: fechaFormateada,
            nombre: nombres || undefined,
            primer_apellido: primerApellido || undefined,
            segundo_apellido: segundoApellido || undefined,
          }),
        }
      )

      const data = await response.json()

      if (data.success && data.objeto) {
        setVerificadoSegip(true)
        setSnapshotVerificado({ nroDocumento, fechaNacimiento })
        Alerta({
          mensaje: `Persona verificada: ${data.objeto.nombres} ${data.objeto.primer_apellido} ${data.objeto.segundo_apellido ?? ''}`.trim(),
          variant: 'success',
        })
      } else {
        setVerificadoSegip(false)
        setSnapshotVerificado(null)
        Alerta({
          mensaje:
            data.mensaje ??
            'No se encontró la persona con los datos proporcionados.',
          variant: 'error',
        })
      }
    } catch (e) {
      imprimir('Error verificando con SEGIP', e)
      Alerta({
        mensaje: 'Error al conectar con el servicio de verificación.',
        variant: 'error',
      })
    } finally {
      setVerificandoSegip(false)
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (values.ciudadaniaDigital && !verificadoSegip) {
      Alerta({
        mensaje:
          'Para habilitar Ciudadanía Digital debe verificar los datos con el SEGIP.',
        variant: 'error',
      })
      return
    }

    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios${usuarioId ? `/${usuarioId}` : ''}`,
        method: usuarioId ? 'patch' : 'post',
        body: {
          ...values,
          numeroPase: values.numeroPase === '' ? null : values.numeroPase,
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
      router.push('/admin/usuarios')
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/usuarios')
  }

  const ciudadaniaDigitalActiva = watch('ciudadaniaDigital')

  return (
    <Box>
      <Typography
        variant="h5"
        component="h1"
        fontWeight={'bold'}
        sx={{ mb: 3 }}
      >
        {usuarioId ? 'Editar Usuario' : 'Nuevo Usuario'}
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display={'flex'} flexDirection={'column'} gap={3}>
              <Typography variant="h6" fontWeight={'600'}>
                Datos personales
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'nroDocumento'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Nro. Documento *
                  </InputLabel>
                  <TextField
                    {...register('nroDocumento')}
                    id="nroDocumento"
                    fullWidth
                    size="small"
                    error={!!errors.nroDocumento}
                    helperText={errors.nroDocumento?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'nombre'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Nombre *
                  </InputLabel>
                  <TextField
                    {...register('nombres')}
                    id="nombre"
                    fullWidth
                    size="small"
                    error={!!errors.nombres}
                    helperText={errors.nombres?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'primerApellido'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Primer Apellido *
                  </InputLabel>
                  <TextField
                    {...register('primerApellido')}
                    id="primerApellido"
                    fullWidth
                    size="small"
                    error={!!errors.primerApellido}
                    helperText={errors.primerApellido?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'segundoApellido'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Segundo Apellido
                  </InputLabel>
                  <TextField
                    {...register('segundoApellido')}
                    id="segundoApellido"
                    fullWidth
                    size="small"
                    error={!!errors.segundoApellido}
                    helperText={errors.segundoApellido?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'fechaNacimiento'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Fecha de Nacimiento *
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
                            field.onChange(
                              date ? date.format('YYYY-MM-DD') : ''
                            )
                          }
                          slotProps={{
                            textField: {
                              id: 'fechaNacimiento',
                              fullWidth: true,
                              size: 'small',
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

              {/* Verificación SEGIP */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  color={verificadoSegip ? 'success' : 'primary'}
                  onClick={verificarConSegip}
                  disabled={loading || verificandoSegip}
                  startIcon={
                    verificandoSegip ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Icono>
                        {verificadoSegip ? 'verified_user' : 'fact_check'}
                      </Icono>
                    )
                  }
                >
                  {verificandoSegip
                    ? 'Verificando...'
                    : verificadoSegip
                      ? 'Datos verificados con el SEGIP'
                      : 'Verificar datos con el SEGIP'}
                </Button>

                {verificadoSegip && (
                  <Chip
                    color="success"
                    size="small"
                    icon={<Icono>check_circle</Icono>}
                    label="Verificado"
                  />
                )}

                {!verificadoSegip && (
                  <Typography variant="caption" color="text.secondary">
                    Opcional — requerido para habilitar Ciudadanía Digital
                  </Typography>
                )}
              </Box>

              <Typography variant="h6" fontWeight={'600'}>
                Datos de contacto
              </Typography>
              <Grid container direction="row" spacing={2}>
                <Grid size={{ xs: 12, xl: 6 }}>
                  <InputLabel
                    htmlFor={'correoElectronico'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Correo Electrónico *
                  </InputLabel>
                  <TextField
                    {...register('correoElectronico')}
                    id="correoElectronico"
                    fullWidth
                    size="small"
                    type="email"
                    error={!!errors.correoElectronico}
                    helperText={errors.correoElectronico?.message}
                    disabled={loading}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'telefono'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Teléfono
                  </InputLabel>
                  <TextField
                    {...register('telefono')}
                    id="telefono"
                    fullWidth
                    size="small"
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                    disabled={loading}
                    type="tel"
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight={'600'}>
                Datos de usuario
              </Typography>

              <Grid container direction="row" spacing={2}>
                <Grid size={12}>
                  <InputLabel
                    htmlFor={'roles'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Roles *
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
                          const role = roles.find((r: RolType) => r.id === id)
                          return role ? (
                            <Chip key={id} label={role.nombre} size="small" />
                          ) : null
                        })}
                      </Box>
                    )}
                    error={!!errors.roles}
                    disabled={loading}
                  >
                    {roles.map((rol: RolType) => (
                      <MenuItem key={rol.id} value={rol.id}>
                        <Checkbox checked={watch('roles').includes(rol.id)} />
                        <ListItemText primary={rol.nombre} />
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.roles && (
                    <FormHelperText error>
                      {errors.roles.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid size={12}>
                  <Controller
                    name="ciudadaniaDigital"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={loading}
                          />
                        }
                        label="Habilitar autenticación con Ciudadanía Digital"
                      />
                    )}
                  />
                  {ciudadaniaDigitalActiva && !verificadoSegip && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      La Ciudadanía Digital requiere datos oficiales del SEGIP.
                      Debe verificar los datos personales antes de guardar.
                    </Alert>
                  )}
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight={'600'}>
                Datos FELCN
              </Typography>

              <Grid container spacing={2}>
                {/* Grado — independiente */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'idGrado'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Grado
                  </InputLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      id="idGrado"
                      value={watch('idGrado') ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValue('idGrado', val === '' ? null : Number(val), {
                          shouldValidate: true,
                        })
                      }}
                      displayEmpty
                      disabled={loading}
                    >
                      <MenuItem value="">
                        <em>Sin grado</em>
                      </MenuItem>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {grados.map((g: any) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.abreviatura} — {g.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Número de Pase */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'numeroPase'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Número de Pase
                  </InputLabel>
                  <TextField
                    {...register('numeroPase')}
                    id="numeroPase"
                    fullWidth
                    size="small"
                    error={!!errors.numeroPase}
                    helperText={errors.numeroPase?.message}
                    disabled={loading}
                    inputProps={{ maxLength: 20 }}
                  />
                </Grid>

                {/* Unidad — estado local, controla cascada */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'idUnidad'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Unidad
                  </InputLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      id="idUnidad"
                      value={idUnidad ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        const newId = val === '' ? null : Number(val)
                        setIdUnidad(newId)
                        setIdDistrital(null)
                        setValue('idGrupo', null)
                      }}
                      displayEmpty
                      disabled={loading}
                    >
                      <MenuItem value="">
                        <em>Sin unidad</em>
                      </MenuItem>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {unidades.map((u: any) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Distrital — dependiente de Unidad, estado local */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'idDistrital'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Distrital
                  </InputLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      id="idDistrital"
                      value={idDistrital ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        const newId = val === '' ? null : Number(val)
                        setIdDistrital(newId)
                        setValue('idGrupo', null)
                      }}
                      displayEmpty
                      disabled={loading || !idUnidad}
                    >
                      <MenuItem value="">
                        <em>
                          {idUnidad ? 'Sin distrital' : 'Seleccione una unidad'}
                        </em>
                      </MenuItem>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {distritales.map((d: any) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Grupo — dependiente de Distrital, se envía al backend */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <InputLabel
                    htmlFor={'idGrupo'}
                    sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
                  >
                    Grupo
                  </InputLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      id="idGrupo"
                      value={watch('idGrupo') ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValue('idGrupo', val === '' ? null : Number(val), {
                          shouldValidate: true,
                        })
                      }}
                      displayEmpty
                      disabled={loading || !idDistrital}
                    >
                      <MenuItem value="">
                        <em>
                          {idDistrital
                            ? 'Sin grupo'
                            : 'Seleccione un distrital'}
                        </em>
                      </MenuItem>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {grupos.map((g: any) => (
                        <MenuItem key={g.id} value={g.id}>
                          {g.descripcion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box
                display="flex"
                gap={2}
                justifyContent="flex-end"
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={handleCancel}
                  startIcon={<Icono>close</Icono>}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  disabled={loading}
                  type="submit"
                  startIcon={<Icono>save</Icono>}
                >
                  {usuarioId ? 'Actualizar' : 'Guardar'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
      <ProgresoLineal mostrar={loading} />
    </Box>
  )
}
