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
import InputWithPrefix from '@/components/form/FormInputWithPrefix'

/* ================= VALIDACIÓN ================= */
export const formSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  paterno: z.string().min(1, 'El apellido paterno es obligatorio'),
  materno: z.string().min(1, 'El apellido materno es obligatorio'),
  apEsposo: z.string().min(1, 'El apellido de esposo es obligatorio'),
  pais: z.string().min(1, 'El país es obligatorio'),
  genero: z.string().min(1, 'El género es obligatorio'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  estadoCivil: z.string().min(1, 'El estado civil es obligatorio'),
  serie: z.string().min(1, 'La serie es obligatoria'),
  seccion: z.string().min(1, 'La sección es obligatoria'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  observacion: z.string().min(1, 'La observación es obligatoria'),
  tarjeta: z.string().min(1, 'La tarjeta es obligatoria'),
  condicionDeLaPersona: z
    .string()
    .min(1, 'La condición de la persona es obligatoria'),
})

type FormValues = z.infer<typeof formSchema>

/* ================= PROPS ================= */

interface Props {
  // caso?: CasoServicioTypeCRUD | null
  // onSuccess: () => void
}

/* ================= COMPONENT ================= */

export const FormFileacion = () => {
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
    defaultValues: {},
  })

  /* ================= SUBMIT ================= */
  const onSubmit = async (values: FormValues) => {}

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="">
      {/* <div className="bg-white dark:bg-black w-full max-w-lg rounded-lg shadow-lg"> */}
      <div className="">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b dark:border-gray-700">
          <div>
            <h2 className="font-bold text-lg">{'Resultado'}</h2>
            <p className="text-sm text-gray-500">
              Complete la información restante
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 p-4 gap-4">
            <div className="col-span-3">
              <InputWithPrefix
                name="nombre"
                prefix="Nombre(s)"
                register={register}
                error={errors.nombre?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="paterno"
                prefix="Paterno"
                register={register}
                error={errors.paterno?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="materno"
                prefix="Materno"
                register={register}
                error={errors.materno?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="apEsposo"
                prefix="Apellido Esposo"
                register={register}
                error={errors.apEsposo?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="pais"
                prefix="Pais"
                register={register}
                error={errors.pais?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="genero"
                prefix="Genero"
                register={register}
                error={errors.genero?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fechaNacimiento"
                prefix="Fecha de Nacimiento"
                register={register}
                error={errors.fechaNacimiento?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="estadoCivil"
                prefix="Estado Civil"
                register={register}
                error={errors.estadoCivil?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="serie"
                prefix="Serie"
                register={register}
                error={errors.serie?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="seccion"
                prefix="Seccion"
                register={register}
                error={errors.seccion?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fotoFrente"
                prefix="Foto Frente"
                register={register}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fotoPerfilIzq"
                prefix="Foto Perfil Izq"
                register={register}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fotoPerfilDer"
                prefix="Foto Perfil Der"
                register={register}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="tarjeta"
                prefix="Tarjeta"
                register={register}
                error={errors.tarjeta?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="condicionDeLaPersona"
                prefix="Condicion de la Persona"
                register={register}
                error={errors.condicionDeLaPersona?.message as string}
              />
            </div>
            <div className="col-span-12">
              <InputWithPrefix
                name="direccion"
                prefix="Direccion"
                register={register}
                error={errors.direccion?.message as string}
              />
            </div>
            <div className="col-span-12">
              <InputWithPrefix
                name="observacion"
                prefix="Observaciones"
                register={register}
                error={errors.observacion?.message as string}
              />
            </div>
          </div>

          {/* <ProgresoLineal mostrar={loading} /> */}

          {/* FOOTER */}
          {/* <div className="flex justify-end gap-3 px-5 py-4 border-t dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              Guardar
            </button>
          </div> */}
        </form>
      </div>
    </div>
  )
}
