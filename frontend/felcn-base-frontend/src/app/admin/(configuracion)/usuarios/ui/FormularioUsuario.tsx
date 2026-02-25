'use client'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { RolType} from '../types/usuariosCRUDTypes'
import {
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
})

type FormValues = z.infer<typeof formSchema>

export const FormularioUsuario = ({ usuarioId }: FormularioUsuarioProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const { Alerta } = useAlerts()
    const { sesionPeticion } = useSession()
    const router = useRouter()

    const obtenerUsuario = async () => {
        if (!usuarioId) return null
        const respuesta = await sesionPeticion({
            url: `${Constantes.baseUrl}/usuarios/${usuarioId}`,
        })
        return respuesta.datos
    }

    const obtenerRoles = async () => {
        const respuesta = await sesionPeticion({
            url: `${Constantes.baseUrl}/autorizacion/roles`,
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
            })
        }
    }, [usuario, reset])

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true)
            const respuesta = await sesionPeticion({
                url: `${Constantes.baseUrl}/usuarios${usuarioId ? `/${usuarioId}` : ''}`,
                method: usuarioId ? 'patch' : 'post',
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

    return (
        <Box>
            <Typography variant="h5" component="h1" fontWeight={'bold'} sx={{ mb: 3 }}>
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
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                                        <FormHelperText error>{errors.roles.message}</FormHelperText>
                                    )}
                                </Grid>
                            </Grid>

                            <Box display="flex" gap={2} justifyContent="flex-end" sx={{ mt: 2 }}>
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
