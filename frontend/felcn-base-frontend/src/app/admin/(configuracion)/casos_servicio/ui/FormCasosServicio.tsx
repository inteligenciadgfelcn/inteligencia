'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import IconX from '@/components/Icon/IconX'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import SelectWithIconField from '@/components/form/FormSelectWithIconField'
import FormInput from '@/components/form/FormInput'

import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { menuIconMap } from '@/components/sidebar/menuIconMap'
import FormTextarea from '@/components/form/FormTextarea'
import { CasoServicioTypeCRUD } from '../types/CasoServicioType'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'

/* ================= VALIDACIÓN ================= */
const datosPersonaSchema = z.object({
  nombreCompleto: z.string().min(1, 'Nombre completo obligatorio'),
  nroCelular: z.string().min(1, 'Número de celular obligatorio'),
})

export const formSchema = z.object({
  codigoServicio: z.string().min(1, 'Código de servicio obligatorio'),
  nroPase: z.string().min(1, 'Número de pase obligatorio'),
  departamento: z.string().min(1, 'Departamento obligatorio'),
  unidad: z.string().min(1, 'Unidad obligatoria'),
  distrital: z.string().min(1, 'Distrital obligatorio'),
  grupo: z.string().min(1, 'Grupo obligatorio'),
  nroRegistro: z.string().min(1, 'Número de registro obligatorio'),
  nombreOperativo: z.string().min(1, 'Nombre del operativo obligatorio'),
  fechaHoraOperativo: z
    .string()
    .min(1, 'Fecha y hora del operativo obligatoria'),
  quienRealiza: datosPersonaSchema,
  asignadoA: datosPersonaSchema,
  fiscalAsignado: datosPersonaSchema,
})

type FormValues = z.infer<typeof formSchema>

/* ================= PROPS ================= */

interface Props {
  caso?: CasoServicioTypeCRUD | null
  onSuccess: () => void
}

/* ================= COMPONENT ================= */

export const FormCasosServicio = ({ caso, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()

  const iconsKey: string[] = Object.keys(menuIconMap)
  const iconOptions = iconsKey.map((i) => ({
    value: i,
    label: i,
  }))

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoServicio: caso?.codigoServicio || '',
      nroPase: caso?.nroPase || '',
      departamento: caso?.departamento || '',
      unidad: caso?.unidad || '',
      distrital: caso?.distrital || '',
      grupo: caso?.grupo || '',
      nroRegistro: caso?.nroRegistro || '',
      nombreOperativo: caso?.nombreOperativo || '',
      fechaHoraOperativo: caso?.fechaHoraOperativo || '',
      quienRealiza: {
        nombreCompleto: caso?.quienRealiza?.nombreCompleto || '',
        nroCelular: caso?.quienRealiza?.nroCelular || '',
      },
      asignadoA: {
        nombreCompleto: caso?.asignadoA?.nombreCompleto || '',
        nroCelular: caso?.asignadoA?.nroCelular || '',
      },
      fiscalAsignado: {
        nombreCompleto: caso?.fiscalAsignado?.nombreCompleto || '',
        nroCelular: caso?.fiscalAsignado?.nroCelular || '',
      },
    },
  })

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: FormValues) => {
    if (loading) return
    // try {
    //   setLoading(true)

    //   const payload = {
    //     label: values.label,
    //     url: values.url,
    //     nombre: values.nombre,
    //     propiedades: {
    //       orden: values.orden,
    //       descripcion: values.descripcion,
    //       icono: values.esSeccion ? undefined : values.icono,
    //     },
    //     modulo: values.esSeccion
    //       ? null
    //       : values.moduloPadreId
    //         ? { id: values.moduloPadreId }
    //         : null,
    //   }

    //   const resp = await sesionPeticion({
    //     url: `${Constantes.baseUrl}/autorizacion/modulos${
    //       modulo?.id ? `/${modulo.id}` : ''
    //     }`,
    //     method: modulo?.id ? 'patch' : 'post',
    //     body: payload,
    //   })

    //   Alerta({
    //     mensaje: InterpreteMensajes(resp),
    //     variant: 'success',
    //   })

    //   onSuccess()
    //   onClose()
    // } catch (e) {
    //   imprimir('Error módulo', e)
    //   Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="">
      {/* <div className="bg-white dark:bg-black w-full max-w-lg rounded-lg shadow-lg"> */}
      <div className="">
        {/* HEADER */}
        {/* <div className="flex justify-between items-center px-5 py-4 border-b dark:border-gray-700">
          <div>
            <h2 className="font-bold text-lg">
              {caso?.id ? 'Editar Caso' : 'Nuevo Caso'}
            </h2>
            <p className="text-sm text-gray-500">
              Complete la información del caso
            </p>
          </div>

          <button onClick={onClose}>
            <IconX />
          </button>
        </div> */}

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 p-4 gap-4">
            <div className="col-span-6">
              <InputWithPrefix
                name="codigoServicio"
                prefix="Código de servicio"
                register={register}
                error={errors.codigoServicio?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="nroPase"
                prefix="Numero de Pase"
                register={register}
                error={errors.nroPase?.message as string}
              />
            </div>
            <div className="col-span-12">
              <InputWithPrefix
                name="departamento"
                prefix="Departamento"
                register={register}
                error={errors.departamento?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="unidad"
                prefix="Unidad"
                register={register}
                error={errors.unidad?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="distrital"
                prefix="Distrital"
                register={register}
                error={errors.distrital?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="grupo"
                prefix="Grupo"
                register={register}
                error={errors.grupo?.message as string}
              />
            </div>
            <div className="col-span-12">
              <InputWithPrefix
                name="nroRegistro"
                prefix="Numero de Registro"
                register={register}
                error={errors.nroRegistro?.message as string}
              />
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
            <div className="col-span-6">
              <InputWithPrefix
                name="quienRealiza.nombreCompleto"
                prefix="Quien realiza la solicitud"
                register={register}
                error={errors.quienRealiza?.nombreCompleto?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="quienRealiza.nroCelular"
                prefix="Nro. Celular"
                icon="phone"
                register={register}
                error={errors.quienRealiza?.nroCelular?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="asignadoA.nombreCompleto"
                prefix="Asignado al caso"
                register={register}
                error={errors.asignadoA?.nombreCompleto?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="asignadoA.nroCelular"
                prefix="Nro. Celular"
                icon="phone"
                register={register}
                error={errors.asignadoA?.nroCelular?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="fiscalAsignado.nombreCompleto"
                prefix="Fiscal asignado"
                register={register}
                error={errors.fiscalAsignado?.nombreCompleto?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="fiscalAsignado.nroCelular"
                prefix="Nro. Celular"
                icon="phone"
                register={register}
                error={errors.fiscalAsignado?.nroCelular?.message as string}
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
