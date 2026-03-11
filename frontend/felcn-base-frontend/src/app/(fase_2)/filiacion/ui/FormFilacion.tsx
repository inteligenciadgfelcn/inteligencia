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
  estadoPersona: z.string().min(1, 'El estado de la persona es obligatorio'),
  lugarOperativo: z.string().min(1, 'El lugar del operativo es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  paterno: z.string().min(1, 'El apellido paterno es obligatorio'),
  materno: z.string().min(1, 'El apellido materno es obligatorio'),
  apEsposo: z.string().min(1, 'El apellido de esposo es obligatorio'),
  nacionalidad: z.string().min(1, 'La nacionalidad es obligatoria'),
  genero: z.string().min(1, 'El género es obligatorio'),
  profesionOcupacion: z
    .string()
    .min(1, 'La profesión u ocupación es obligatoria'),
  alias: z.string().min(1, 'El alias es obligatorio'),
  tipoDocumento: z.string().min(1, 'El tipo de documento es obligatorio'),
  numeroDocumento: z.string().min(1, 'El número de documento es obligatorio'),
  expedidoEn: z.string().min(1, 'El expedido en es obligatorio'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  estadoCivil: z.string().min(1, 'El estado civil es obligatorio'),
  lugarNacimiento: z.string().min(1, 'El lugar de nacimiento es obligatorio'),
  contratadoSegip: z
    .string()
    .min(1, 'El contratado con el SEGIP es obligatorio'),
  observacion: z.string().min(1, 'La observación es obligatoria'),
  tarjetaProntuario: z.string().min(1, 'La tarjeta prontuario es obligatoria'),
  condicionDeLaPersona: z
    .string()
    .min(1, 'La condición de la persona es obligatoria'),
  estatura: z.string().min(1, 'La estatura es obligatoria'),
  pesoCorporal: z.string().min(1, 'El peso corporal es obligatorio'),
  senalesParticulares: z
    .string()
    .min(1, 'Las señas particulares son obligatorias'),
  tatuajes: z.string().min(1, 'Los tatuajes son obligatorios'),
  tipoNariz: z.string().min(1, 'El tipo de nariz es obligatorio'),
  constitucion: z.string().min(1, 'La constitución es obligatoria'),
  colorPiel: z.string().min(1, 'El color de piel es obligatorio'),
  colorCabello: z.string().min(1, 'El color de cabello es obligatorio'),
  tipoCabello: z.string().min(1, 'El tipo de cabello es obligatorio'),
  colorOjos: z.string().min(1, 'El color de ojos es obligatorio'),
  tipoOjos: z.string().min(1, 'El tipo de ojos es obligatorio'),
  fotoFrontal: z.string().min(1, 'La foto frontal es obligatoria'),
  fotoPerfilIzquierdo: z
    .string()
    .min(1, 'La foto de perfil izquierdo es obligatoria'),
  fotoPerfilDerecho: z
    .string()
    .min(1, 'La foto de perfil derecho es obligatoria'),
})

type FormValues = z.infer<typeof formSchema>

/* ================= PROPS ================= */

interface Props {
  // caso?: CasoServicioTypeCRUD | null
  // onSuccess: () => void
}

/* ================= COMPONENT ================= */

export const FormFiliacion = () => {
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
  const onSubmit = async (values: FormValues) => { }

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="">
      {/* <div className="bg-white dark:bg-black w-full max-w-lg rounded-lg shadow-lg"> */}
      <div className="">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b dark:border-gray-700">
          <div>
            <h2 className="font-bold text-lg">Datos Personales</h2>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 p-4 gap-4">
            <div className="col-span-6">
              <InputWithPrefix
                name="estadoPersona"
                prefix="Estado Persona"
                register={register}
                error={errors.estadoPersona?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="lugarOperativo"
                prefix="Lugar del Operativo"
                register={register}
                error={errors.lugarOperativo?.message as string}
              />
            </div>
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
                prefix="Ap Paterno"
                register={register}
                error={errors.paterno?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="materno"
                prefix="Ap Materno"
                register={register}
                error={errors.materno?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="apEsposo"
                prefix="Ap Esposo"
                register={register}
                error={errors.apEsposo?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="nacionalidad"
                prefix="Nacionalidad"
                register={register}
                error={errors.nacionalidad?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="genero"
                prefix="Genero"
                register={register}
                error={errors.genero?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="profesionOcupacion"
                prefix="Profesión/Ocupación"
                register={register}
                error={errors.profesionOcupacion?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="alias"
                prefix="Alias"
                register={register}
                error={errors.alias?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="tipoDocumento"
                prefix="Tipo de Documento"
                register={register}
                error={errors.tipoDocumento?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="numeroDocumento"
                prefix="Número de Documento"
                register={register}
                error={errors.numeroDocumento?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="expedidoEn"
                prefix="Expedido en"
                register={register}
                error={errors.expedidoEn?.message as string}
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
                name="direccion"
                prefix="Direccion"
                register={register}
                error={errors.direccion?.message as string}
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
            <div className="col-span-6">
              <InputWithPrefix
                name="lugarNacimiento"
                prefix="Lugar de Nacimiento"
                register={register}
                error={errors.lugarNacimiento?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="contratadoSegip"
                prefix="Contratado con el SEGIP"
                register={register}
                error={errors.contratadoSegip?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="observacion"
                prefix="Observación"
                register={register}
                error={errors.observacion?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="tarjetaProntuario"
                prefix="Tarjeta Prontuario"
                register={register}
                error={errors.tarjetaProntuario?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="condicionDeLaPersona"
                prefix="Condicion de la Persona"
                register={register}
                error={errors.condicionDeLaPersona?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="estatura"
                prefix="Estatura"
                register={register}
                error={errors.estatura?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="pesoCorporal"
                prefix="Peso Corporal"
                register={register}
                error={errors.pesoCorporal?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="senalesParticulares"
                prefix="Señales Particulares"
                register={register}
                error={errors.senalesParticulares?.message as string}
              />
            </div>
            <div className="col-span-6">
              <InputWithPrefix
                name="tatuajes"
                prefix="Tatuajes"
                register={register}
                error={errors.tatuajes?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="tipoNariz"
                prefix="Tipo de Nariz"
                register={register}
                error={errors.tipoNariz?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="constitucion"
                prefix="Constitución"
                register={register}
                error={errors.constitucion?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="colorPiel"
                prefix="Color de Piel"
                register={register}
                error={errors.colorPiel?.message as string}
              />
            </div>
            <div className="col-span-3">
              <InputWithPrefix
                name="colorCabello"
                prefix="Color de Cabello"
                register={register}
                error={errors.colorCabello?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="tipoCabello"
                prefix="Tipo de Cabello"
                register={register}
                error={errors.tipoCabello?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="colorOjos"
                prefix="Color de Ojos"
                register={register}
                error={errors.colorOjos?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="tipoOjos"
                prefix="Tipo de Ojos"
                register={register}
                error={errors.tipoOjos?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fotoFrontal"
                prefix="Foto Frontal"
                register={register}
                error={errors.fotoFrontal?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fotoPerfilIzquierdo"
                prefix="Foto Perfil Izquierdo"
                register={register}
                error={errors.fotoPerfilIzquierdo?.message as string}
              />
            </div>
            <div className="col-span-4">
              <InputWithPrefix
                name="fotoPerfilDerecho"
                prefix="Foto Perfil Derecho"
                register={register}
                error={errors.fotoPerfilDerecho?.message as string}
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
