'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import {
  dateToStringAmPm,
  formatDate2ToBackend,
  nowDateToString,
} from '@/utils/fechas'
import { useDepartments } from '../hooks/use.departments'
import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import { Departamento } from '../services/departments.service'
import { useUnities } from '../hooks/use.unities'
import { Unidad } from '../services/unities.service'
import { useDistritales } from '../hooks/use.distritales'
import { Distrital } from '../services/distrital.service'
import { useGroups } from '../hooks/use.groups'
import { Grupo } from '../services/group.service'
import {
  getNumeroRegistro,
  verificarServicioUsuario,
} from '../services/registro.service'
import { useUsers } from '../hooks/use.users'
import { Usuario } from '../services/users.service'
import { AsignacionTable } from '../types/asignacion.table'
import { useAuth } from '@/context/AuthProvider'

/* ================= VALIDACIÓN ================= */
const selectSchema = (message: string) =>
  z.preprocess(
    (val) => (val === null ? undefined : val),
    z.object(
      {
        value: z.number(),
        label: z.string(),
        original: z.any(),
      },
      { required_error: message }
    )
  )

export const formSchema = z.object({
  codigoServicio: z.string().min(1, 'Código de servicio obligatorio'),
  nroPase: z.string().min(1, 'Número de pase obligatorio'),
  departamento: selectSchema('Departamento obligatorio'),
  unidad: selectSchema('Unidad obligatoria'),
  distrital: selectSchema('Distrital obligatoria'),
  grupo: selectSchema('Grupo obligatorio'),
  nroRegistro: z.string().min(1, 'Número de registro obligatorio'),
  nombreOperativo: z.string().min(1, 'Nombre del operativo obligatorio'),
  fechaHoraOperativo: z
    .string()
    .min(1, 'Fecha y hora del operativo obligatoria'),
  quienRealiza: selectSchema('Quien realiza la solicitud obligatorio'),
  quienRealizaNum: z
    .string()
    .min(1, 'Número de celular de quien realiza la solicitud obligatorio'),
  asignadoA: selectSchema('Asignado al caso obligatorio'),
  asignadoANum: z
    .string()
    .min(1, 'Número de celular de asignado al caso obligatorio'),
  fiscalAsignado: z.string().min(1, 'Fiscal asignado obligatorio'),
  fiscalAsignadoNum: z
    .string()
    .min(1, 'Número de celular de fiscal asignado obligatorio'),
})

export type FormValues = z.infer<typeof formSchema>

/* ================= PROPS ================= */

interface Props {
  asignacion?: AsignacionTable | null
  onSuccess: () => void
}

/* ================= COMPONENT ================= */
export const FormRegistro = ({ asignacion, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false)
  const [verificandoServicio, setVerificandoServicio] = useState(true)
  const [usuarioConServicio, setUsuarioConServicio] = useState(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const { usuario } = useAuth()

  imprimir('Usuario en form', usuario)

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    trigger,
    control,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoServicio: asignacion?.codigoServicio || '',
      nroPase: usuario?.numeroPase || '',
      departamento: asignacion?.departamento
        ? {
            value: asignacion.departamento?.idDepartamento,
            label: asignacion.departamento?.descripcion,
          }
        : undefined,
      // unidad: asignacion?.grupo
      //   ? {
      //       value: asignacion.grupo.distrital.unidad.idUnidad,
      //       label: asignacion.grupo.distrital.unidad.descripcion,
      //     }
      //   : undefined,
      // distrital: asignacion?.grupo
      //   ? {
      //       value: asignacion.grupo.distrital.idDistrital,
      //       label: asignacion.grupo.distrital.descripcion,
      //     }
      //   : undefined,
      // grupo: asignacion?.grupo
      //   ? {
      //       value: asignacion.grupo.idGrupo,
      //       label: asignacion.grupo.descripcion,
      //     }
      //   : undefined,
      nroRegistro: asignacion?.nroOperativo || '',
      nombreOperativo: asignacion?.nombreCaso || '',
      fechaHoraOperativo: asignacion?.fechaSolicitud
        ? dateToStringAmPm(asignacion.fechaSolicitud)
        : nowDateToString(),
      quienRealiza: asignacion?.nombreSolicitud
        ? {
            value: Number(asignacion.telefonoSolicitud),
            label: asignacion.nombreSolicitud,
          }
        : undefined,
      asignadoA: asignacion?.asignado
        ? {
            value: Number(asignacion.telefonoAsignado),
            label: asignacion.asignado,
          }
        : undefined,
      fiscalAsignado: asignacion?.fiscalAsignado || '',
      quienRealizaNum: asignacion?.telefonoSolicitud || '',
      asignadoANum: asignacion?.telefonoAsignado || '',
      fiscalAsignadoNum: asignacion?.telefonoFiscal || '',
    },
  })

  const unidadSeleccionada = useWatch({ control, name: 'unidad' })
  const distritalSeleccionado = useWatch({ control, name: 'distrital' })
  const grupoSeleccionado = useWatch({ control, name: 'grupo' })

  imprimir('form values', watch())

  const { data: departamentos } = useDepartments()
  const { data: unidades } = useUnities()
  const { data: distritales } = useDistritales(unidadSeleccionada?.value)
  const { data: grupos } = useGroups(distritalSeleccionado?.value)
  const { data: usuarios } = useUsers(grupoSeleccionado?.value)

  useEffect(() => {
    if (asignacion) {
      // reset({
      //   codigoServicio: asignacion?.codigoServicio || '',
      //   nroPase: asignacion?.usuario || '',
      //   departamento: asignacion?.departamento
      //     ? {
      //         value: asignacion.departamento?.idDepartamento,
      //         label: asignacion.departamento?.descripcion,
      //       }
      //     : undefined,
      //   unidad: asignacion?.unidad
      //     ? {
      //         value: asignacion.unidad.idUnidad,
      //         label: asignacion.unidad.descripcion,
      //       }
      //     : undefined,
      //   distrital: asignacion?.grupo
      //     ? {
      //         value: asignacion.grupo.distrital.idDistrital,
      //         label: asignacion.grupo.distrital.descripcion,
      //       }
      //     : undefined,
      //   grupo: asignacion?.grupo
      //     ? {
      //         value: asignacion.grupo.idGrupo,
      //         label: asignacion.grupo.descripcion,
      //       }
      //     : undefined,
      //   nroRegistro: asignacion?.nroOperativo || '',
      //   nombreOperativo: asignacion?.nombreCaso || '',
      //   fechaHoraOperativo: asignacion?.fechaSolicitud
      //     ? dateUtcToString(asignacion.fechaSolicitud)
      //     : nowDateToString(),
      //   quienRealiza: asignacion?.nombreSolicitud
      //     ? {
      //         value: Number(asignacion.telefonoSolicitud),
      //         label: asignacion.nombreSolicitud,
      //       }
      //     : undefined,
      //   asignadoA: asignacion?.asignado
      //     ? {
      //         value: Number(asignacion.telefonoAsignado),
      //         label: asignacion.asignado,
      //       }
      //     : undefined,
      //   fiscalAsignado: asignacion?.fiscalAsignado || '',
      //   quienRealizaNum: asignacion?.telefonoSolicitud || '',
      //   asignadoANum: asignacion?.telefonoAsignado || '',
      //   fiscalAsignadoNum: asignacion?.telefonoFiscal || '',
      // })
    }
  }, [asignacion])

  useEffect(() => {
    resetField('distrital')
    resetField('grupo')
  }, [unidadSeleccionada, resetField])

  useEffect(() => {
    resetField('grupo')
  }, [distritalSeleccionado, resetField])

  useEffect(() => {
    resetField('quienRealiza')
    resetField('asignadoA')
  }, [grupoSeleccionado, resetField])

  useEffect(() => {
    const verificarServicio = async () => {
      if (!usuario?.numeroPase) {
        setUsuarioConServicio(false)
        setVerificandoServicio(false)
        return
      }

      try {
        setVerificandoServicio(true)

        const response = await verificarServicioUsuario(usuario.numeroPase)
        const enServicio = Boolean(response?.enServicio)

        setUsuarioConServicio(enServicio)

        if (enServicio && response.codigoServicio) {
          setValue('codigoServicio', response.codigoServicio, {
            shouldValidate: true,
          })
          setValue('nroPase', usuario.numeroPase, {
            shouldValidate: true,
          })
        }
      } catch (error) {
        imprimir('Error verificando servicio del usuario', error)
        setUsuarioConServicio(false)
      } finally {
        setVerificandoServicio(false)
      }
    }

    verificarServicio()
  }, [usuario?.numeroPase, setValue])

  /* ================= SUBMIT ================= */
  const onSubmit = async (values: FormValues) => {
    if (loading) return

    try {
      setLoading(true)
      //     {
      //   "idDepartamento": 1,
      //   "idGrupo": 2,
      //   "nombreCaso": "Operativo Antinarcóticos",
      //   "fechaSolicitud": "12-05-2025 16:00",
      //   "nombreSolicitud": "Juan Marquez",
      //   "telefonoSolicitud": "71234567",
      //   "asignado": "Juan Pérez",
      //   "telefonoAsignado": "70000000",
      //   "fiscalAsignado": "Dra. María López",
      //   "telefonoFiscal": "72000000"
      // }
      const payload = {
        codigoServicio: values.codigoServicio,
        usuario: values.nroPase,
        idDepartamento: values.departamento.original.abreviatura,
        idGrupo: values.grupo.value,
        nombreCaso: values.nombreOperativo,
        fechaSolicitud: formatDate2ToBackend(values.fechaHoraOperativo),
        nombreSolicitud: values.quienRealiza.label,
        telefonoSolicitud: values.quienRealizaNum,
        asignado: values.asignadoA.label,
        telefonoAsignado: values.asignadoANum,
        fiscalAsignado: values.fiscalAsignado,
        telefonoFiscal: values.fiscalAsignadoNum,
        numeroPaseSolicitud: values.quienRealiza.original?.numeroPase,
      }

      const resp = await sesionPeticion({
        url: `${Constantes.baseUrl}/asignaciones`,
        method: 'post',
        body: payload,
      })

      Alerta({
        mensaje: InterpreteMensajes({
          mensaje: 'Caso registrado correctamente',
        }),
        variant: 'success',
      })

      const tmpCodigoServicio = values.codigoServicio
      reset()
      setValue('codigoServicio', tmpCodigoServicio)
      onSuccess()
    } catch (e) {
      imprimir('Error módulo', e)
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAsignarNumeroRegistro = async () => {
    const fieldsToValidate: (keyof FormValues)[] = [
      'codigoServicio',
      'nroPase',
      'departamento',
      'unidad',
      'distrital',
      'grupo',
    ]

    // Validar solo los campos requeridos para asignar número de registro
    const isValid = await trigger(fieldsToValidate)
    console.log(`${isValid}, ${fieldsToValidate}`)

    if (!isValid) {
      return
    }

    const departamento = watch('departamento')
    const grupo = watch('grupo')

    try {
      setLoading(true)

      const response = await getNumeroRegistro(
        departamento!.original.abreviatura,
        grupo!.value
      )

      Alerta({
        mensaje: InterpreteMensajes({
          mensaje: 'Número de registro asignado correctamente',
        }),
        variant: 'success',
      })

      // Si la respuesta contiene el número de registro, actualizarlo en el form
      if (response) {
        setValue('nroRegistro', response)
      }
    } catch (error) {
      imprimir('Error asignando número de registro', error)
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (verificandoServicio) {
    return (
      <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-6 text-center">
        <p className="text-base font-semibold text-primary">
          Verificando servicio asignado...
        </p>
      </div>
    )
  }

  if (!usuarioConServicio) {
    return (
      <div className="rounded-md border border-danger/20 bg-danger/5 px-4 py-6 text-center">
        <p className="text-base font-semibold text-danger">
          No tienes un servicio asignado
        </p>
      </div>
    )
  }

  return (
    <div className="panel">
      <div className="">
        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 p-4 gap-4">
            <div className="col-span-6">
              <InputWithPrefix
                name="codigoServicio"
                prefix="Código de servicio"
                register={register}
                readOnly
                error={errors.codigoServicio?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="nroPase"
                prefix="Numero de Pase"
                readOnly
                register={register}
                error={errors.nroPase?.message as string}
              />
            </div>
            <div className="col-span-8">
              <AsyncSearchSelect<Departamento>
                name="departamento"
                control={control}
                prefix="Departamento"
                error={errors.departamento?.message}
                originalData={departamentos ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idDepartamento,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-4"></div>
            <div className="col-span-4">
              <AsyncSearchSelect<Unidad>
                name="unidad"
                control={control}
                prefix="Unidad"
                error={errors.unidad?.message}
                originalData={unidades ?? []}
                mapOption={(item) => {
                  return {
                    label: item.descripcion,
                    value: item.id,
                    original: item,
                  }
                }}
              />
            </div>
            <div className="col-span-4">
              <AsyncSearchSelect<Distrital>
                name="distrital"
                control={control}
                prefix="Distrital"
                error={errors.distrital?.message}
                originalData={distritales ?? []}
                isDisable={!unidadSeleccionada}
                mapOption={(item) => {
                  return {
                    label: item.descripcion,
                    value: item.id,
                    original: item,
                  }
                }}
              />
            </div>
            <div className="col-span-4">
              <AsyncSearchSelect<Grupo>
                name="grupo"
                control={control}
                prefix="Grupo"
                error={errors.grupo?.message}
                originalData={grupos ?? []}
                isDisable={!distritalSeleccionado || !unidadSeleccionada}
                mapOption={(item) => {
                  return {
                    label: item.descripcion,
                    value: item.id,
                    original: item,
                  }
                }}
              />
            </div>
            <div className="col-span-12">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAsignarNumeroRegistro}
                  disabled={loading}
                  className="btn btn-primary self-end whitespace-nowrap h-7 text-sm"
                >
                  <span className="text-sm font-normal">
                    ASIGNAR NUMERO DE REGISTRO
                  </span>
                </button>
                <div className="flex-1">
                  <InputWithPrefix
                    name="nroRegistro"
                    prefix=""
                    register={register}
                    error={errors.nroRegistro?.message as string}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="nombreOperativo"
                prefix="Nombre operativo"
                register={register}
                error={errors.nombreOperativo?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="fechaHoraOperativo"
                prefix="Fecha y hora del operativo"
                register={register}
                error={errors.fechaHoraOperativo?.message as string}
              />
            </div>
            <div className="col-span-8">
              <AsyncSearchSelect<Usuario>
                control={control}
                name="quienRealiza"
                prefix="Quien realiza la solicitud"
                error={errors.quienRealiza?.message as string}
                originalData={usuarios ?? []}
                isDisable={!grupoSeleccionado}
                mapOption={(item) => {
                  return {
                    label: `${item.nombreCompleto}`.toUpperCase(),
                    value: Number(item.idUsuario),
                    original: item,
                  }
                }}
                onValueChange={(option) => {
                  if (option) {
                    setValue('quienRealizaNum', option.original.telefono)
                  } else {
                    resetField('quienRealizaNum')
                  }
                }}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="quienRealizaNum"
                prefix="Nro. Celular"
                icon="phone"
                register={register}
                error={errors.quienRealizaNum?.message as string}
                readOnly
              />
            </div>
            <div className="col-span-8">
              <AsyncSearchSelect<Usuario>
                control={control}
                name="asignadoA"
                prefix="Asignado al caso"
                error={errors.asignadoA?.message as string}
                originalData={usuarios ?? []}
                isDisable={!grupoSeleccionado}
                mapOption={(item) => {
                  return {
                    label: `${item.nombreCompleto}`.toUpperCase(),
                    value: Number(item.idUsuario),
                    original: item,
                  }
                }}
                onValueChange={(option) => {
                  if (option) {
                    setValue('asignadoANum', option.original.telefono)
                  } else {
                    resetField('asignadoANum')
                  }
                }}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="asignadoANum"
                prefix="Nro. Celular"
                icon="phone"
                register={register}
                error={errors.asignadoANum?.message as string}
              />
            </div>
            <div className="col-span-8">
              <InputWithPrefix
                name="fiscalAsignado"
                prefix="Fiscal asignado"
                register={register}
                error={errors.fiscalAsignado?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fiscalAsignadoNum"
                prefix="Nro. Celular"
                icon="phone"
                register={register}
                onlyNumbers
                error={errors.fiscalAsignadoNum?.message as string}
              />
            </div>
          </div>

          {/* <ProgresoLineal mostrar={loading} /> */}

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-5 py-4 border-t dark:border-gray-700">
            {/* <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-outline-danger"
            >
              Cancelar
            </button> */}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
