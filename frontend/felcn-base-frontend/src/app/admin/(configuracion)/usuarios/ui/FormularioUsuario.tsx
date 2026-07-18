'use client'
import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { RolType } from '../types/usuariosCRUDTypes'
import { useAlerts, useSession, useConfirmDialog } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { trimPayload } from '@/utils/trimPayload'
import { Constantes } from '@/config/Constantes'
import { validarFechaFormato } from '@/utils/fechas'
import { imprimir } from '@/utils/imprimir'
import { Icono } from '@/components/Icono'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { MultiSelect } from '@/components/form/FormMultiSelect'
import { LoadingDialog } from '@/components/modales/LoadingDialog'

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
  idGrado: z.preprocess(
    (val) => (val === null || val === '' || val === undefined) ? undefined : Number(val),
    z.number({ required_error: 'El grado es requerido.' })
  ),
  idGrupo: z.preprocess(
    (val) => (val === null || val === '' || val === undefined) ? undefined : Number(val),
    z.number({ required_error: 'El grupo es requerido.' })
  ),
  numeroPase: z.string().min(1, {
    message: 'El número de pase es requerido.',
  }),
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
  const { confirm, ConfirmDialog } = useConfirmDialog()
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
      idGrado: undefined as any,
      idGrupo: undefined as any,
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
        idGrado: (usuario.idGrado ?? undefined) as any,
        idGrupo: (usuario.idGrupo ?? undefined) as any,
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

  const limpiarDatosPersonales = () => {
    setValue('nombres', '', { shouldValidate: true })
    setValue('primerApellido', '', { shouldValidate: true })
    setValue('segundoApellido', '', { shouldValidate: true })
    setValue('nroDocumento', '', { shouldValidate: true })
    setValue('fechaNacimiento', '', { shouldValidate: true })
    setVerificadoSegip(false)
    setSnapshotVerificado(null)
  }

  const onSubmit = async (values: FormValues) => {
    if (!usuarioId && !verificadoSegip) {
      Alerta({
        mensaje:
          'Debe verificar los datos personales con el SEGIP antes de registrar un nuevo usuario.',
        variant: 'error',
      })
      return
    }

    if (values.ciudadaniaDigital && !verificadoSegip) {
      Alerta({
        mensaje:
          'Para habilitar Ciudadanía Digital debe verificar los datos con el SEGIP.',
        variant: 'error',
      })
      return
    }

    const datos = trimPayload(values)

    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios${usuarioId ? `/${usuarioId}` : ''}`,
        method: usuarioId ? 'patch' : 'post',
        body: {
          ...datos,
          numeroPase: datos.numeroPase === '' ? null : datos.numeroPase,
          persona: {
            nombres: datos.nombres,
            primerApellido: datos.primerApellido,
            segundoApellido: datos.segundoApellido,
            nroDocumento: datos.nroDocumento,
            fechaNacimiento: datos.fechaNacimiento,
            telefono: datos.telefono === '' ? null : datos.telefono,
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
    confirm({
      titulo: 'Cancelar cambios',
      texto: '¿Está seguro de cancelar? Se perderán todos los cambios no guardados.',
      variante: 'warning',
      onConfirm: () => {
        router.push('/admin/usuarios')
      },
    })
  }

  const ciudadaniaDigitalActiva = watch('ciudadaniaDigital')
  const deshabilitarDatosPersonales = !usuarioId && verificadoSegip

  return (
    <div className="w-full px-4 py-6">
      <LoadingDialog
        show={loading}
        message={usuarioId ? 'Actualizando usuario...' : 'Guardando usuario...'}
      />
      <LoadingDialog
        show={verificandoSegip}
        message="Verificando datos con el SEGIP..."
      />
      <ConfirmDialog />

      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-dark dark:text-white-light">
          {usuarioId ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {usuarioId ? 'Actualice la información del usuario en el sistema.' : 'Registre la información para crear un nuevo usuario.'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección: Datos personales */}
          <div>
            <h5 className="text-lg font-semibold mb-4 text-dark dark:text-white-light">
              Datos personales
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Nombres */}
              <div className="col-span-1">
                <label htmlFor="nombres" className="mb-1 block text-sm font-medium">
                  Nombre <span className="text-danger">*</span>
                </label>
                <Input
                  id="nombres"
                  type="text"
                  className="w-full"
                  style={{ textTransform: 'uppercase' }}
                  error={!!errors.nombres}
                  disabled={loading || deshabilitarDatosPersonales}
                  {...register('nombres', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase()
                    },
                  })}
                />
                {errors.nombres && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.nombres.message}
                  </span>
                )}
              </div>

              {/* Primer Apellido */}
              <div className="col-span-1">
                <label htmlFor="primerApellido" className="mb-1 block text-sm font-medium">
                  Primer Apellido <span className="text-danger">*</span>
                </label>
                <Input
                  id="primerApellido"
                  type="text"
                  className="w-full"
                  style={{ textTransform: 'uppercase' }}
                  error={!!errors.primerApellido}
                  disabled={loading || deshabilitarDatosPersonales}
                  {...register('primerApellido', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase()
                    },
                  })}
                />
                {errors.primerApellido && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.primerApellido.message}
                  </span>
                )}
              </div>

              {/* Segundo Apellido */}
              <div className="col-span-1">
                <label htmlFor="segundoApellido" className="mb-1 block text-sm font-medium">
                  Segundo Apellido
                </label>
                <Input
                  id="segundoApellido"
                  type="text"
                  className="w-full"
                  style={{ textTransform: 'uppercase' }}
                  error={!!errors.segundoApellido}
                  disabled={loading || deshabilitarDatosPersonales}
                  {...register('segundoApellido', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase()
                    },
                  })}
                />
                {errors.segundoApellido && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.segundoApellido.message}
                  </span>
                )}
              </div>

              {/* Nro Documento */}
              <div className="col-span-1">
                <label htmlFor="nroDocumento" className="mb-1 block text-sm font-medium">
                  Nro. Documento <span className="text-danger">*</span>
                </label>
                <Input
                  id="nroDocumento"
                  type="text"
                  className="w-full"
                  style={{ textTransform: 'uppercase' }}
                  error={!!errors.nroDocumento}
                  disabled={loading || deshabilitarDatosPersonales}
                  {...register('nroDocumento', {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase()
                    },
                  })}
                />
                {errors.nroDocumento && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.nroDocumento.message}
                  </span>
                )}
              </div>

              {/* Fecha Nacimiento */}
              <div className="col-span-1">
                <label htmlFor="fechaNacimiento" className="mb-1 block text-sm font-medium">
                  Fecha de Nacimiento <span className="text-danger">*</span>
                </label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  className="w-full"
                  error={!!errors.fechaNacimiento}
                  disabled={loading || deshabilitarDatosPersonales}
                  {...register('fechaNacimiento')}
                />
                {errors.fechaNacimiento && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.fechaNacimiento.message}
                  </span>
                )}
              </div>

              {/* Botón de verificación SEGIP / Limpiar datos */}
              <div className="col-span-1 flex flex-col justify-end pb-1">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={verificadoSegip ? 'success' : 'primary'}
                    onClick={verificarConSegip}
                    disabled={loading || verificandoSegip || deshabilitarDatosPersonales}
                    className="w-full"
                    icon={<Icono>{verificadoSegip ? 'verified_user' : 'check'}</Icono>}
                  >
                    {verificandoSegip
                      ? 'Verificando...'
                      : verificadoSegip
                        ? 'Verificado'
                        : 'Verificar con SEGIP'}
                  </Button>

                  {deshabilitarDatosPersonales && (
                    <Button
                      type="button"
                      variant="outline-danger"
                      onClick={limpiarDatosPersonales}
                      disabled={loading}
                      title="Limpiar datos"
                      icon={<Icono>delete</Icono>}
                    >
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Datos de contacto */}
          <div className="border-t border-[#ebedf2] dark:border-[#1b2e4b] pt-6">
            <h5 className="text-lg font-semibold mb-4 text-dark dark:text-white-light">
              Datos de contacto
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Correo Electrónico */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="correoElectronico" className="mb-1 block text-sm font-medium">
                  Correo Electrónico <span className="text-danger">*</span>
                </label>
                <Input
                  id="correoElectronico"
                  type="email"
                  className="w-full"
                  error={!!errors.correoElectronico}
                  disabled={loading}
                  {...register('correoElectronico')}
                />
                {errors.correoElectronico && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.correoElectronico.message}
                  </span>
                )}
              </div>

              {/* Teléfono */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="telefono" className="mb-1 block text-sm font-medium">
                  Teléfono
                </label>
                <Input
                  id="telefono"
                  type="tel"
                  className="w-full"
                  error={!!errors.telefono}
                  disabled={loading}
                  {...register('telefono')}
                />
                {errors.telefono && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.telefono.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sección: Datos de usuario */}
          <div className="border-t border-[#ebedf2] dark:border-[#1b2e4b] pt-6">
            <h5 className="text-lg font-semibold mb-4 text-dark dark:text-white-light">
              Datos de usuario
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Roles */}
              <div className="col-span-1 md:col-span-2">
                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      label="Roles *"
                      options={roles.map((rol: RolType) => ({
                        value: rol.id,
                        label: rol.nombre,
                      }))}
                      value={field.value}
                      onChange={(values) => field.onChange(values)}
                      placeholder="Seleccione uno o más roles..."
                      isDisabled={loading}
                      error={errors.roles?.message}
                    />
                  )}
                />
              </div>

              {/* Ciudadanía Digital */}
              <div className="col-span-1 flex flex-col justify-end pb-1">
                <Controller
                  name="ciudadaniaDigital"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label="Habilitar autenticación con Ciudadanía Digital"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={loading}
                    />
                  )}
                />
              </div>
              
              {ciudadaniaDigitalActiva && !verificadoSegip && (
                <div className="col-span-1 md:col-span-3 mt-2">
                  <div className="alert alert-warning bg-warning/10 text-warning border-warning/20 p-3 rounded-lg text-sm flex items-center gap-2">
                    <Icono>settings</Icono>
                    <span>
                      La Ciudadanía Digital requiere datos oficiales del SEGIP. Debe verificar los datos personales antes de guardar.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección: Estructura dentro de la FELCN */}
          <div className="border-t border-[#ebedf2] dark:border-[#1b2e4b] pt-6">
            <h5 className="text-lg font-semibold mb-4 text-dark dark:text-white-light">
              Estructura dentro de la FELCN
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Unidad */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="idUnidad" className="mb-1 block text-sm font-medium">
                  Unidad <span className="text-danger">*</span>
                </label>
                <Select
                  id="idUnidad"
                  options={unidades.map((u: any) => ({
                    value: u.id,
                    label: u.descripcion,
                  }))}
                  placeholder="Sin unidad"
                  value={idUnidad ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    const newId = val === '' ? null : Number(val)
                    setIdUnidad(newId)
                    setIdDistrital(null)
                    setValue('idGrupo', undefined as any)
                  }}
                  disabled={loading}
                  className="w-full"
                />
              </div>

              {/* Distrital */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="idDistrital" className="mb-1 block text-sm font-medium">
                  Distrital <span className="text-danger">*</span>
                </label>
                <Select
                  id="idDistrital"
                  options={distritales.map((d: any) => ({
                    value: d.id,
                    label: d.descripcion,
                  }))}
                  placeholder={idUnidad ? 'Sin distrital' : 'Seleccione una unidad'}
                  value={idDistrital ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    const newId = val === '' ? null : Number(val)
                    setIdDistrital(newId)
                    setValue('idGrupo', undefined as any)
                  }}
                  disabled={loading || !idUnidad}
                  className="w-full"
                />
              </div>

              {/* Grupo */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="idGrupo" className="mb-1 block text-sm font-medium">
                  Grupo <span className="text-danger">*</span>
                </label>
                <Select
                  id="idGrupo"
                  options={grupos.map((g: any) => ({
                    value: g.id,
                    label: g.descripcion,
                  }))}
                  placeholder={idDistrital ? 'Sin grupo' : 'Seleccione un distrital'}
                  value={watch('idGrupo') ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    setValue('idGrupo', (val === '' ? undefined : Number(val)) as any, {
                      shouldValidate: true,
                    })
                  }}
                  disabled={loading || !idDistrital}
                  className="w-full"
                  error={!!errors.idGrupo}
                />
                {errors.idGrupo && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.idGrupo.message}
                  </span>
                )}
              </div>

              {/* Grado */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="idGrado" className="mb-1 block text-sm font-medium">
                  Grado <span className="text-danger">*</span>
                </label>
                <Select
                  id="idGrado"
                  options={grados.map((g: any) => ({
                    value: g.id,
                    label: `${g.abreviatura} — ${g.descripcion}`,
                  }))}
                  placeholder="Sin grado"
                  value={watch('idGrado') ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    setValue('idGrado', (val === '' ? undefined : Number(val)) as any, {
                      shouldValidate: true,
                    })
                  }}
                  disabled={loading}
                  className="w-full"
                  error={!!errors.idGrado}
                />
                {errors.idGrado && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.idGrado.message}
                  </span>
                )}
              </div>

              {/* Número de Pase */}
              <div className="col-span-1 md:col-span-1">
                <label htmlFor="numeroPase" className="mb-1 block text-sm font-medium">
                  Número de Pase <span className="text-danger">*</span>
                </label>
                <Input
                  id="numeroPase"
                  type="text"
                  maxLength={20}
                  uppercase
                  className="w-full"
                  error={!!errors.numeroPase}
                  disabled={loading}
                  {...register('numeroPase')}
                />
                {errors.numeroPase && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.numeroPase.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-end border-t border-[#ebedf2] dark:border-[#1b2e4b] pt-6">
            <Button
              type="button"
              variant="outline-danger"
              disabled={loading}
              onClick={handleCancel}
              icon={<Icono>close</Icono>}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={<Icono>save</Icono>}
            >
              {usuarioId ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
