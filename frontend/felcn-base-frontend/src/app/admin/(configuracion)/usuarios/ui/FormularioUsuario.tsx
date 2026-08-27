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
import { RecursosPorRol } from './RecursosPorRol'
import { DialogLinkActivacion } from './DialogLinkActivacion'

interface FormularioUsuarioProps {
  usuarioId?: string
}

const formSchema = z
  .object({
    nombres: z.string().min(2, {
      message: 'El nombre es requerido.',
    }),
    primerApellido: z
      .string()
      .optional()
      .refine((value) => !value || value.trim().length >= 2, {
        message: 'El primer apellido debe tener al menos 2 caracteres.',
      }),
    segundoApellido: z
      .string()
      .optional()
      .refine((value) => !value || value.trim().length >= 2, {
        message: 'El segundo apellido debe tener al menos 2 caracteres.',
      }),
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
    otpHabilitado: z.boolean().default(false),
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
  .superRefine((values, ctx) => {
    if (!values.primerApellido?.trim() && !values.segundoApellido?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['primerApellido'],
        message: 'Debe ingresar al menos un apellido.',
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

export const FormularioUsuario = ({ usuarioId }: FormularioUsuarioProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [idUnidad, setIdUnidad] = useState<number | null>(null)
  const [idDistrital, setIdDistrital] = useState<number | null>(null)
  const [recursosExceptuados, setRecursosExceptuados] = useState<
    Record<string, string[]>
  >({})
  const [urlActivacion, setUrlActivacion] = useState<string | null>(null)
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

  // idRol -> idUsuarioRol (solo existe en edición; en alta el usuario_rol
  // todavía no se creó, RecursosPorRol lo maneja como catálogo sin excepciones)
  const idUsuarioRolPorRol: Record<string, string> = (
    usuario?.usuarioRol ?? []
  ).reduce(
    (acc: Record<string, string>, ur: any) => ({
      ...acc,
      [ur.rol.id]: ur.id,
    }),
    {}
  )

  const manejarCambioRecursos = (idRol: string, idsExcluidos: string[]) => {
    setRecursosExceptuados((previo) => ({ ...previo, [idRol]: idsExcluidos }))
  }

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
      otpHabilitado: false,
      idGrado: undefined as any,
      idGrupo: undefined as any,
      numeroPase: '',
    },
  })

  // Alta de usuario nuevo: el rol USUARIO viene preseleccionado por defecto.
  useEffect(() => {
    if (usuarioId || roles.length === 0) return
    if ((watch('roles') ?? []).length > 0) return
    const idUsuarioRol = roles.find((rol: RolType) => rol.rol === 'USUARIO')?.id
    if (idUsuarioRol) setValue('roles', [idUsuarioRol])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId, roles])

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
        otpHabilitado: usuario.otpHabilitado ?? false,
        idGrado: (usuario.idGrado ?? undefined) as any,
        idGrupo: (usuario.idGrupo ?? undefined) as any,
        numeroPase: usuario.numeroPase ?? '',
      })
      // Pre-populate cascade: unidad → distrital → grupo
      const unidadId = usuario.grupo?.distrital?.unidad?.id ?? null
      const distritalId = usuario.grupo?.distrital?.id ?? null
      setIdUnidad(unidadId)
      setIdDistrital(distritalId)
    }
  }, [usuario, reset])

  const onSubmit = async (values: FormValues) => {
    const idUsuarioRol = roles.find((rol: RolType) => rol.rol === 'USUARIO')?.id
    if (idUsuarioRol && !values.roles.includes(idUsuarioRol)) {
      confirm({
        titulo: 'Rol Usuario no asignado',
        texto:
          'Este usuario se guardará sin el rol Usuario. Es el rol base recomendado para cualquier cuenta — quitarlo es una decisión del administrador. ¿Desea continuar de todas formas?',
        variante: 'warning',
        textoConfirmar: 'Guardar igual',
        onConfirm: () => guardarUsuario(values),
      })
      return
    }
    await guardarUsuario(values)
  }

  const guardarUsuario = async (values: FormValues) => {
    const datos = trimPayload(values)

    // Solo se manda la excepción de los roles que siguen seleccionados —
    // si un rol se quitó del MultiSelect, su entrada acá queda descartada.
    const recursosExceptuadosAEnviar = Object.fromEntries(
      Object.entries(recursosExceptuados).filter(([idRol]) =>
        values.roles.includes(idRol)
      )
    )

    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios${usuarioId ? `/${usuarioId}` : ''}`,
        method: usuarioId ? 'patch' : 'post',
        body: {
          ...datos,
          numeroPase: datos.numeroPase === '' ? null : datos.numeroPase,
          recursosExceptuados: recursosExceptuadosAEnviar,
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
      if (!usuarioId && respuesta?.datos?.urlActivacion) {
        setUrlActivacion(respuesta.datos.urlActivacion)
      } else {
        router.back()
      }
    } catch (e) {
      imprimir(`Error al crear o actualizar usuario`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseLinkActivacion = () => {
    setUrlActivacion(null)
    router.back()
  }

  const handleCancel = () => {
    confirm({
      titulo: 'Cancelar cambios',
      texto: '¿Está seguro de cancelar? Se perderán todos los cambios no guardados.',
      variante: 'warning',
      onConfirm: () => {
        router.back()
      },
    })
  }

  const ciudadaniaDigitalActiva = watch('ciudadaniaDigital')
  const otpHabilitadoActivo = watch('otpHabilitado')
  const rolesSeleccionados = watch('roles') ?? []

  return (
    <div className="w-full px-4 py-6">
      <LoadingDialog
        show={loading}
        message={usuarioId ? 'Actualizando usuario...' : 'Guardando usuario...'}
      />
      <ConfirmDialog />
      <DialogLinkActivacion
        isOpen={!!urlActivacion}
        onClose={handleCloseLinkActivacion}
        url={urlActivacion ?? ''}
      />

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
                  disabled={loading}
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
                  Primer Apellido
                </label>
                <Input
                  id="primerApellido"
                  type="text"
                  className="w-full"
                  style={{ textTransform: 'uppercase' }}
                  error={!!errors.primerApellido}
                  disabled={loading}
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
                  disabled={loading}
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
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  Debe completar al menos uno de los dos apellidos.
                </span>
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
                  disabled={loading}
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
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                  Si el número tiene complemento, regístrelo tal cual. Ejemplo: 1234567-1A
                </span>
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
                  disabled={loading}
                  {...register('fechaNacimiento')}
                />
                {errors.fechaNacimiento && (
                  <span className="text-danger text-xs mt-1 block">
                    {errors.fechaNacimiento.message}
                  </span>
                )}
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
              
              {ciudadaniaDigitalActiva && (
                <div className="col-span-1 md:col-span-3 mt-2">
                  <div className="alert alert-warning bg-warning/10 text-warning border-warning/20 p-3 rounded-lg text-sm flex items-center gap-2">
                    <Icono>info</Icono>
                    <span>
                      Debe coincidir exactamente con la Cédula de Identidad: el sistema contrasta estos datos contra Ciudadanía Digital y, si difieren, el ingreso por esa vía quedará bloqueado.
                    </span>
                  </div>
                </div>
              )}

              {/* Doble factor de autenticación (OTP) */}
              <div className="col-span-1 flex flex-col justify-end pb-1">
                <Controller
                  name="otpHabilitado"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label="Habilitar doble factor de autenticación (2FA)"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={loading}
                    />
                  )}
                />
              </div>

              {otpHabilitadoActivo && (
                <div className="col-span-1 md:col-span-3 mt-2">
                  <div className="alert alert-info bg-info/10 text-info border-info/20 p-3 rounded-lg text-sm flex items-center gap-2">
                    <Icono>info</Icono>
                    <span>
                      Al iniciar sesión, el sistema pedirá además un código enviado por correo electrónico (o WhatsApp, si el usuario tiene teléfono registrado y ese canal configurado).
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección: Recursos por rol */}
          {rolesSeleccionados.length > 0 && (
            <div className="border-t border-[#ebedf2] dark:border-[#1b2e4b] pt-6">
              <h5 className="text-lg font-semibold mb-1 text-dark dark:text-white-light">
                Recursos por rol
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Por defecto cada rol habilita todos sus recursos. Solo si
                necesita una excepción puntual para este usuario, elija
                &quot;Personalizar&quot;.
              </p>
              <div className="space-y-4">
                {rolesSeleccionados.map((idRol) => {
                  const rolInfo = roles.find(
                    (rol: RolType) => rol.id === idRol
                  )
                  if (!rolInfo) return null
                  return (
                    <RecursosPorRol
                      key={idRol}
                      idRol={idRol}
                      codigoRol={rolInfo.rol}
                      nombreRol={rolInfo.nombre}
                      idUsuarioRol={idUsuarioRolPorRol[idRol]}
                      onChange={manejarCambioRecursos}
                    />
                  )
                })}
              </div>
            </div>
          )}

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
