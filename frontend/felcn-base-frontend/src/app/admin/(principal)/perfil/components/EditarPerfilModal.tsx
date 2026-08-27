'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import * as z from 'zod'
import { useAlerts, useSession } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { Constantes } from '@/config/Constantes'
import { trimPayload } from '@/utils/trimPayload'
import { UsuarioType } from '@/app/login/types/loginTypes'
import { useAuth } from '@/context/AuthProvider'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'

import IconUser from '@/components/Icon/IconUser'
import IconMail from '@/components/Icon/IconMail'
import IconPhone from '@/components/Icon/IconPhone'
import IconX from '@/components/Icon/IconX'
import IconSave from '@/components/Icon/IconSave'

/* ========================= */

interface EditarPerfilModalProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioType | null
}

const schema = z
  .object({
    nombres: z.string().min(1, 'El nombre es requerido'),
    primerApellido: z.string().min(1, 'El primer apellido es requerido'),
    segundoApellido: z.string().optional(),
    correoElectronico: z.string().email('Correo inválido'),
    telefono: z.string().optional(),
    idGrado: z.preprocess(
      (val) => (val === '' || val === null ? undefined : Number(val)),
      z.number().optional()
    ),
    idGrupo: z.preprocess(
      (val) => (val === '' || val === null ? undefined : Number(val)),
      z.number().optional()
    ),
    numeroPase: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    // La Estructura FELCN solo se completa una vez: si se toca algún campo,
    // deben ir los 3 juntos (ver fechaPerfilCompletado en el backend).
    const algunoCargado = !!values.idGrado || !!values.idGrupo || !!values.numeroPase
    if (!algunoCargado) return

    if (!values.idGrado) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['idGrado'], message: 'El grado es requerido' })
    }
    if (!values.idGrupo) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['idGrupo'], message: 'El grupo es requerido' })
    }
    if (!values.numeroPase?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['numeroPase'], message: 'El número de pase es requerido' })
    }
  })

type FormValues = z.infer<typeof schema>

/* ========================= */

export const EditarPerfilModal = ({
  isOpen,
  onClose,
  usuario,
}: EditarPerfilModalProps) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const { actualizarPerfilCompleto } = useAuth()

  const perfilCompleto = !!usuario?.fechaPerfilCompletado

  const [idUnidad, setIdUnidad] = useState<number | null>(
    usuario?.grupo?.distrital?.unidad?.id ?? null
  )
  const [idDistrital, setIdDistrital] = useState<number | null>(
    usuario?.grupo?.distrital?.id ?? null
  )

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombres: usuario?.persona.nombres || '',
      primerApellido: usuario?.persona.primerApellido || '',
      segundoApellido: usuario?.persona.segundoApellido || '',
      correoElectronico: usuario?.correoElectronico || '',
      telefono: usuario?.persona.telefono || '',
      idGrado: usuario?.idGrado ?? undefined,
      idGrupo: usuario?.idGrupo ?? undefined,
      numeroPase: usuario?.numeroPase || '',
    },
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
    enabled: !perfilCompleto,
  })
  const { data: unidades = [] } = useQuery({
    queryKey: ['lookups-unidades'],
    queryFn: obtenerUnidades,
    enabled: !perfilCompleto,
  })
  const { data: distritales = [] } = useQuery({
    queryKey: ['lookups-distritales', idUnidad],
    queryFn: obtenerDistritales,
    enabled: !perfilCompleto && !!idUnidad,
  })
  const { data: grupos = [] } = useQuery({
    queryKey: ['lookups-grupos', idDistrital],
    queryFn: obtenerGrupos,
    enabled: !perfilCompleto && !!idDistrital,
  })

  if (!isOpen) return null

  const onSubmit = async (values: FormValues) => {
    try {
      const { idGrado, idGrupo, numeroPase, ...datosPersonales } = values

      await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/cuenta/perfil`,
        method: 'patch',
        body: {
          ...trimPayload(datosPersonales),
          ...(!perfilCompleto && { idGrado, idGrupo, numeroPase }),
        },
      })

      await actualizarPerfilCompleto()

      Alerta({
        mensaje: 'Perfil actualizado correctamente',
        variant: 'success',
      })
      onClose()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="panel w-full max-w-xl animate__animated animate__zoomIn">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-white-light dark:border-dark/50 pb-4 mb-6">
          <div>
            <h5 className="text-lg font-semibold">Editar Perfil</h5>
            <p className="text-sm text-white-dark">
              Actualiza tu información personal
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white-dark hover:text-danger"
          >
            <IconX />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* DATOS PERSONALES */}
          <div>
            <h6 className="font-semibold mb-3">Datos personales</h6>

            <div className="space-y-4">
              {/* NOMBRES */}
              <div>
                <label className="mb-0 block text-white-dark">Nombres</label>

                <div className="relative">
                  <IconUser className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark" />
                  <input
                    {...register('nombres', {
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase()
                      },
                    })}
                    disabled={isSubmitting}
                    className="form-input ps-10"
                  />
                </div>

                <p className="text-danger text-sm">{errors.nombres?.message}</p>
              </div>

              {/* APELLIDOS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-0 block text-white-dark">
                    Primer Apellido
                  </label>

                  <input
                    {...register('primerApellido', {
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase()
                      },
                    })}
                    disabled={isSubmitting}
                    className="form-input"
                  />

                  <p className="text-danger text-sm">
                    {errors.primerApellido?.message}
                  </p>
                </div>

                <div>
                  <label className="mb-0 block text-white-dark">
                    Segundo Apellido
                  </label>

                  <input
                    {...register('segundoApellido', {
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase()
                      },
                    })}
                    disabled={isSubmitting}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CONTACTO */}
          <div>
            <h6 className="font-semibold mb-3">Contacto</h6>

            <div className="space-y-4">
              {/* EMAIL */}
              <div>
                <label className="mb-0 block text-white-dark">
                  Correo electrónico
                </label>

                <div className="relative">
                  <IconMail className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark" />
                  <input
                    {...register('correoElectronico')}
                    disabled={isSubmitting}
                    type="email"
                    className="form-input ps-10"
                  />
                </div>

                <p className="text-danger text-sm">
                  {errors.correoElectronico?.message}
                </p>
              </div>

              {/* TELEFONO */}
              <div>
                <label className="mb-0 block text-white-dark">Teléfono</label>

                <div className="relative">
                  <IconPhone className="absolute start-4 top-1/2 -translate-y-1/2 text-white-dark" />
                  <input
                    {...register('telefono')}
                    disabled={isSubmitting}
                    type="tel"
                    className="form-input ps-10"
                  />
                </div>

                <p className="text-danger text-sm">
                  {errors.telefono?.message}
                </p>
              </div>
            </div>
          </div>

          {/* ESTRUCTURA FELCN */}
          <div>
            <h6 className="font-semibold mb-3">Estructura dentro de la FELCN</h6>

            {perfilCompleto ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-white-dark">Grado</span>
                  {usuario?.grado?.descripcion || '-'}
                </div>
                <div>
                  <span className="block text-white-dark">Grupo</span>
                  {usuario?.grupo?.descripcion || '-'}
                </div>
                <div>
                  <span className="block text-white-dark">Número de Pase</span>
                  {usuario?.numeroPase || '-'}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-md border-l-4 border-warning bg-warning/10 p-3 text-sm text-warning">
                  Verifique que la información sea correcta antes de
                  confirmar. Una vez confirmada, no podrá modificarse
                  directamente — cualquier corrección posterior deberá
                  solicitarse a un administrador del sistema.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-0 block text-white-dark">Unidad</label>
                    <Select
                      options={unidades.map((u: any) => ({
                        value: u.id,
                        label: u.descripcion,
                      }))}
                      placeholder="Seleccione una unidad"
                      value={idUnidad ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setIdUnidad(val === '' ? null : Number(val))
                        setIdDistrital(null)
                        setValue('idGrupo', undefined as any)
                      }}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">
                      Distrital
                    </label>
                    <Select
                      options={distritales.map((d: any) => ({
                        value: d.id,
                        label: d.descripcion,
                      }))}
                      placeholder={idUnidad ? 'Seleccione un distrital' : 'Seleccione una unidad'}
                      value={idDistrital ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setIdDistrital(val === '' ? null : Number(val))
                        setValue('idGrupo', undefined as any)
                      }}
                      disabled={isSubmitting || !idUnidad}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">Grupo</label>
                    <Select
                      options={grupos.map((g: any) => ({
                        value: g.id,
                        label: g.descripcion,
                      }))}
                      placeholder={idDistrital ? 'Seleccione un grupo' : 'Seleccione un distrital'}
                      value={watch('idGrupo') ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValue('idGrupo', (val === '' ? undefined : Number(val)) as any, {
                          shouldValidate: true,
                        })
                      }}
                      disabled={isSubmitting || !idDistrital}
                      className="w-full"
                      error={!!errors.idGrupo}
                    />
                    {errors.idGrupo && (
                      <span className="text-danger text-xs mt-1 block">
                        {errors.idGrupo.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">Grado</label>
                    <Select
                      options={grados.map((g: any) => ({
                        value: g.id,
                        label: `${g.abreviatura} — ${g.descripcion}`,
                      }))}
                      placeholder="Seleccione un grado"
                      value={watch('idGrado') ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValue('idGrado', (val === '' ? undefined : Number(val)) as any, {
                          shouldValidate: true,
                        })
                      }}
                      disabled={isSubmitting}
                      className="w-full"
                      error={!!errors.idGrado}
                    />
                    {errors.idGrado && (
                      <span className="text-danger text-xs mt-1 block">
                        {errors.idGrado.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">
                      Número de Pase
                    </label>
                    <Input
                      type="text"
                      maxLength={20}
                      uppercase
                      className="w-full"
                      error={!!errors.numeroPase}
                      disabled={isSubmitting}
                      {...register('numeroPase')}
                    />
                    {errors.numeroPase && (
                      <span className="text-danger text-xs mt-1 block">
                        {errors.numeroPase.message}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white-light dark:border-dark/50">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isSubmitting}
            >
              <IconSave />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
