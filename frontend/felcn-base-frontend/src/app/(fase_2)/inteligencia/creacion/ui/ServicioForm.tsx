'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAlerts } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import {
  formatDateToBackend,
  nowDateToString,
  tomorrowDateToString,
} from '@/utils/fechas'
import { useUsersInteligencia } from '../../servicio/hooks/use.users.inteligencia'
import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import { Usuario } from '../../servicio/services/users.service'
import {
  CreateServiceBody,
  postGenerarServicio,
  postServicio,
} from '../services/creacion.service'
import { LoadingDialog } from '@/components/modales/LoadingDialog'

/* ================= VALIDACIÓN ================= */
const selectSchema = (message: string) =>
  z.preprocess(
    (val) => (val === null ? undefined : val),
    z.object(
      {
        value: z.number(),
        label: z.string(),
      },
      { required_error: message }
    )
  )

export const formSchema = z.object({
  entrante: selectSchema('Personal entrante obligatorio'),
  entrantePase: z.string().min(1, 'Número de pase es obligatorio'),
  emergencia: selectSchema('Personal de emergencia obligatorio'),
  emergenciaPase: z.string().min(1, 'Número de pase es obligatorio'),
  fechaHoraIngreso: z.string().min(1, 'Fecha y hora del ingreso obligatoria'),
  fechaHoraSalida: z.string().min(1, 'Fecha y hora de salida obligatoria'),
  codigoServicio: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema>

/* ================= COMPONENT ================= */
export const ServicioForm = () => {
  const [loading, setLoading] = useState(false)
  const { Alerta } = useAlerts()

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaHoraIngreso: nowDateToString(),
      fechaHoraSalida: tomorrowDateToString(),
    },
  })

  imprimir('form values', watch())

  const { data: usuarios } = useUsersInteligencia()

  const handleGenCode = async () => {
    const fechaIngreso = watch('fechaHoraIngreso')
    const fechaSalida = watch('fechaHoraSalida')

    setLoading(true)
    const code = await postGenerarServicio({
      fechaIngreso: formatDateToBackend(fechaIngreso),
      fechaSalida: formatDateToBackend(fechaSalida),
    })

    setValue('codigoServicio', code)
    setLoading(false)
  }

  /* ================= SUBMIT ================= */
  const onSubmit = async (values: FormValues) => {
    if (loading) return

    try {
      setLoading(true)
      const strFechaHoraIngreso = formatDateToBackend(values.fechaHoraIngreso)
      const strFechaHoraSalida = formatDateToBackend(values.fechaHoraSalida)

      const payload: CreateServiceBody = {
        usuarioPrincipal: values.entrantePase,
        usuarioEmergencia: values.emergenciaPase,
        fechaIngreso: new Date(strFechaHoraIngreso).toISOString(),
        fechaSalida: new Date(strFechaHoraSalida).toISOString(),
      }

      const resp = await postServicio(payload)

      if (resp.mensaje) {
        Alerta({
          mensaje: InterpreteMensajes({
            mensaje: `${resp.mensaje} (${resp.servicio.codigoServicio})`,
          }),
          variant: 'error',
        })
        return
      } else {
        Alerta({
          mensaje: InterpreteMensajes({
            mensaje: `Servicio creado exitosamente`,
          }),
          variant: 'success',
        })

        setValue('codigoServicio', resp.servicio.codigoServicio)
      }
    } catch (e) {
      imprimir('Error servicio', e)
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoadingDialog show={loading} />
      <div className="">
        <div className="">
          {/* Breadcumb */}
          <div className="mb-5">
            <ol className="flex text-primary font-semibold dark:text-white-dark">
              <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
                <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
                  Inicio
                </button>
              </li>
              <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
                <button className="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
                  Creación de servicios
                </button>
              </li>
            </ol>
          </div>
          {/* End breadcum */}

          <div className="panel flex items-center p-3 text-primary mb-5">
            <span className="text-lg font-semibold">
              Formulario de creación de codigos de servicios
            </span>
          </div>
          {/* FORM */}
          <div className="panel">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="col-span-1 sm:col-span-8">
                  <AsyncSearchSelect<Usuario>
                    control={control}
                    name="entrante"
                    prefix="Servicio entrante"
                    error={errors.entrante?.message as string}
                    originalData={usuarios ?? []}
                    mapOption={(item) => {
                      return {
                        label: `${item.nombreCompleto}`.toUpperCase(),
                        value: Number(item.usuario),
                        original: item,
                      }
                    }}
                    onValueChange={(option) => {
                      if (option) {
                        setValue('entrantePase', option.original.numeroPase)
                      } else {
                        resetField('entrantePase')
                      }
                    }}
                  />
                </div>
                <div className="col-span-1 sm:col-span-4">
                  <InputWithPrefix
                    name="entrantePase"
                    prefix="Numero de Pase"
                    register={register}
                    error={errors.entrantePase?.message as string}
                    readOnly
                  />
                </div>
                <div className="col-span-1 sm:col-span-8">
                  <AsyncSearchSelect<Usuario>
                    control={control}
                    name="emergencia"
                    prefix="Servicio de emergencia"
                    error={errors.emergencia?.message as string}
                    originalData={usuarios ?? []}
                    mapOption={(item) => {
                      return {
                        label: `${item.nombreCompleto}`.toUpperCase(),
                        value: Number(item.usuario),
                        original: item,
                      }
                    }}
                    onValueChange={(option) => {
                      if (option) {
                        setValue('emergenciaPase', option.original.numeroPase)
                      } else {
                        resetField('emergenciaPase')
                      }
                    }}
                  />
                </div>
                <div className="col-span-1 sm:col-span-4">
                  <InputWithPrefix
                    name="emergenciaPase"
                    prefix="Numero de Pase"
                    register={register}
                    error={errors.emergenciaPase?.message as string}
                    readOnly
                  />
                </div>
                <div className="col-span-1 sm:col-span-8">
                  <InputWithPrefix
                    name="fechaHoraIngreso"
                    prefix="Fecha y hora de Ingreso al Servicio"
                    register={register}
                    error={errors.fechaHoraIngreso?.message as string}
                  />
                </div>
                <div className="hidden sm:block sm:col-span-4"></div>
                <div className="col-span-1 sm:col-span-8">
                  <InputWithPrefix
                    name="fechaHoraSalida"
                    prefix="Fecha y hora de Salida del Servicio"
                    register={register}
                    error={errors.fechaHoraSalida?.message as string}
                  />
                </div>
                <div className="hidden sm:block sm:col-span-4"></div>
                <div className="col-span-1 sm:col-span-3">
                  <button
                    type="button"
                    disabled={loading}
                    className="btn btn-secondary btn-sm w-full"
                    onClick={handleGenCode}
                  >
                    {loading && (
                      <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                    )}
                    Asignar codigo de servicio
                  </button>
                </div>
                <div className="col-span-1 sm:col-span-5">
                  <InputWithPrefix
                    name="codigoServicio"
                    register={register}
                    readOnly
                    error={errors.codigoServicio?.message as string}
                  />
                </div>
              </div>

              {/* <ProgresoLineal mostrar={loading} /> */}

              {/* FOOTER */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 px-5 py-4 dark:border-gray-700">
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
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Guardar codigo de servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
