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
  actualizarAsignacion,
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
  mode?: 'create' | 'edit'
  onSuccess: () => void
}

/* ================= COMPONENT ================= */
export const FormRegistro = ({
  asignacion,
  mode = 'create',
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false)
  const [verificandoServicio, setVerificandoServicio] = useState(true)
  const [usuarioConServicio, setUsuarioConServicio] = useState(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const { usuario, estaEnServicio, codigoIcia } = useAuth()

  imprimir('Usuario en form', usuario)
  imprimir('esta en servicio', estaEnServicio)
  imprimir('codigo icia', codigoIcia)

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
      codigoServicio: '',
      nroPase: usuario?.numeroPase || '',
      departamento: undefined,
      unidad: undefined,
      distrital: undefined,
      grupo: undefined,
      nroRegistro: '',
      nombreOperativo: '',
      fechaHoraOperativo: nowDateToString(),
      quienRealiza: undefined,
      asignadoA: undefined,
      fiscalAsignado: '',
      quienRealizaNum: '',
      asignadoANum: '',
      fiscalAsignadoNum: '',
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
      const dept = departamentos?.find(
        (d) => d.abreviatura === asignacion.departamento?.idDepartamento
      )
      const unid = unidades?.find(
        (u) =>
          u.abreviaturaIcia?.trim() ===
          asignacion.unidad?.idUnidad?.trim()
      )

      reset({
        codigoServicio: asignacion?.codigoServicio || '',
        nroPase: usuario?.numeroPase || '',
        departamento: dept
          ? { value: dept.idDepartamento, label: dept.descripcion, original: dept }
          : asignacion?.departamento
            ? {
                value: Number(asignacion.departamento.idDepartamento) || 0,
                label: asignacion.departamento.descripcion,
                original: undefined as any,
              }
            : undefined,
        unidad: unid
          ? { value: unid.id, label: unid.descripcion, original: unid }
          : asignacion?.unidad
            ? {
                value: 0,
                label: asignacion.unidad.descripcion,
                original: undefined as any,
              }
            : undefined,
        distrital: asignacion?.siii?.id_distrital
          ? {
              value: asignacion.siii.id_distrital,
              label: String(asignacion.siii.id_distrital),
            }
          : undefined,
        grupo: asignacion?.siii?.id_grupo
          ? {
              value: asignacion.siii.id_grupo,
              label: String(asignacion.siii.id_grupo),
            }
          : undefined,
        nroRegistro: asignacion?.nroOperativo || '',
        nombreOperativo: asignacion?.nombreCaso || '',
        fechaHoraOperativo: asignacion?.fechaOperativo
          ? dateToStringAmPm(asignacion.fechaOperativo)
          : nowDateToString(),
        quienRealiza: asignacion?.nombreSolicitud
          ? {
              value: Number(asignacion.siii?.telefono_solicitud) || 0,
              label: asignacion.nombreSolicitud,
            }
          : undefined,
        asignadoA: asignacion?.siii?.asignado_caso
          ? {
              value: Number(asignacion.siii.telefono_asignado) || 0,
              label: asignacion.siii.asignado_caso,
            }
          : undefined,
        fiscalAsignado: asignacion?.fiscalAsignado || '',
        quienRealizaNum: asignacion?.siii?.telefono_solicitud || '',
        asignadoANum: asignacion?.siii?.telefono_asignado || '',
        fiscalAsignadoNum: asignacion?.siii?.telefono_fiscal || '',
      })
    }
  }, [asignacion, departamentos, unidades])

  useEffect(() => {
    if (asignacion?.siii?.id_distrital && distritales?.length) {
      const dist = distritales.find(
        (d) => d.id === asignacion.siii.id_distrital
      )
      if (dist) {
        setValue('distrital', {
          value: dist.id,
          label: dist.descripcion,
          original: dist,
        })
      }
    }
  }, [distritales, asignacion, setValue])

  useEffect(() => {
    if (asignacion?.siii?.id_grupo && grupos?.length) {
      const grp = grupos.find(
        (g) => g.id === asignacion.siii.id_grupo
      )
      if (grp) {
        setValue('grupo', {
          value: grp.id,
          label: grp.descripcion,
          original: grp,
        })
      }
    }
  }, [grupos, asignacion, setValue])

  useEffect(() => {
    if (!asignacion) {
      resetField('distrital')
      resetField('grupo')
    }
  }, [unidadSeleccionada, resetField, asignacion])

  useEffect(() => {
    if (!asignacion) {
      resetField('grupo')
    }
  }, [distritalSeleccionado, resetField, asignacion])

  useEffect(() => {
    if (!asignacion) {
      resetField('quienRealiza')
      resetField('asignadoA')
    }
  }, [grupoSeleccionado, resetField, asignacion])

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

      if (mode === 'edit' && asignacion?.idAsignacion) {
        const payload = {
          nombreCaso: values.nombreOperativo,
          telefonoSolicitud: values.quienRealizaNum,
          fiscalAsignado: values.fiscalAsignado,
          telefonoFiscal: values.fiscalAsignadoNum,
          fechaSolicitud: formatDate2ToBackend(values.fechaHoraOperativo),
        }

        await actualizarAsignacion(asignacion.idAsignacion, payload)

        Alerta({
          mensaje: InterpreteMensajes({
            mensaje: 'Caso actualizado correctamente',
          }),
          variant: 'success',
        })

        onSuccess()
      } else {
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

        await sesionPeticion({
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
      }
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
                isDisable={mode === 'edit'}
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
                isDisable={mode === 'edit'}
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
                isDisable={mode === 'edit' || !unidadSeleccionada}
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
                isDisable={mode === 'edit' || !distritalSeleccionado || !unidadSeleccionada}
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
                {mode !== 'edit' && (
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
                )}
                <div className="flex-1">
                  <InputWithPrefix
                    name="nroRegistro"
                    prefix=""
                    register={register}
                    readOnly={mode === 'edit'}
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
                isDisable={mode === 'edit' || !grupoSeleccionado}
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
              />
            </div>
            <div className="col-span-8">
              <AsyncSearchSelect<Usuario>
                control={control}
                name="asignadoA"
                prefix="Asignado al caso"
                error={errors.asignadoA?.message as string}
                originalData={usuarios ?? []}
                isDisable={mode === 'edit' || !grupoSeleccionado}
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
                readOnly={mode === 'edit'}
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
