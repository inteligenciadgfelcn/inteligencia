'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import {
  ColorCabello,
  getColorCabellos,
} from '../services/color.cabello.service'
import { ColorOjo, getColorOjos } from '../services/color.ojos.service'
import { ColorPiel, getColorPieles } from '../services/color.piel.service'
import {
  ConstitucionCorporal,
  getConstitucionesCorporales,
} from '../services/constitucion.corporal.service'
import {
  TipoDocumento,
  getTiposDocumento,
} from '../services/document.type.service'
import {
  EstadoCivil,
  getEstadosCiviles,
} from '../services/estado.civil.service'
import { Profesion, getProfesiones } from '../services/profesion.service'
import { TipoCabello, getTiposCabello } from '../services/tipo.cabello.service'
import { TipoNariz, getTiposNariz } from '../services/tipo.nariz.service'
import { TipoOjos, getTiposOjos } from '../services/tipo.ojos.service'

import FileInputWithPreview from '@/components/form/FormInputFileWithPrefix'
import { CasbinTypes } from '@/types'
import { getPaises, Pais } from '../services/pais.service'
import { FiliacionPersonaTable } from '../type/filiacion.persona.table'

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
  estadoPersona: selectSchema('El estado de la persona es obligatorio'),
  lugarOperativo: z.string().min(1, 'El lugar del operativo es obligatorio'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  paterno: z.string().min(1, 'El apellido paterno es obligatorio'),
  materno: z.string().optional(),
  apEsposo: z.string().optional(),
  nacionalidad: selectSchema('La nacionalidad es obligatoria'),
  genero: selectSchema('El género es obligatorio'),
  profesionOcupacion: selectSchema('La profesión u ocupación es obligatoria'),
  alias: z.string().min(1, 'El alias es obligatorio'),
  tipoDocumento: selectSchema('El tipo de documento es obligatorio'),
  numeroDocumento: z.string().optional(),
  expedidoEn: z.string().min(1, 'El expedido en es obligatorio'),
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  direccion: z.string().min(1, 'La dirección es obligatoria'),
  estadoCivil: selectSchema('El estado civil es obligatorio'),
  lugarNacimiento: z.string().min(1, 'El lugar de nacimiento es obligatorio'),
  contratadoSegip: selectSchema('El contratado con el SEGIP es obligatorio'),
  observacion: z.string().optional(),
  tarjetaProntuario: selectSchema('La tarjeta prontuario es obligatoria'),
  condicionDeLaPersona: selectSchema(
    'La condición de la persona es obligatoria'
  ),
  estatura: z.string().min(1, 'La estatura es obligatoria'),
  pesoCorporal: z.string().min(1, 'El peso corporal es obligatorio'),
  senalesParticulares: z
    .string()
    .min(1, 'Las señas particulares son obligatorias'),
  tatuajes: z.string().optional(),
  tipoNariz: selectSchema('El tipo de nariz es obligatorio'),
  constitucion: selectSchema('La constitución es obligatoria'),
  colorPiel: selectSchema('El color de piel es obligatorio'),
  colorCabello: selectSchema('El color de cabello es obligatorio'),
  tipoCabello: selectSchema('El tipo de cabello es obligatorio'),
  colorOjos: selectSchema('El color de ojos es obligatorio'),
  tipoOjos: selectSchema('El tipo de ojos es obligatorio'),
  fotoFrontal: z.custom<File>((value) => value instanceof File, {
    message: 'La foto frontal es obligatoria',
  }),
  fotoPerfilIzquierdo: z.custom<File>((value) => value instanceof File, {
    message: 'La foto de perfil izquierdo es obligatoria',
  }),
  fotoPerfilDerecho: z.custom<File>((value) => value instanceof File, {
    message: 'La foto de perfil derecho es obligatoria',
  }),
})

type FormValues = z.infer<typeof formSchema>

interface OpcionBasica {
  id: number
  descripcion: string
}

const ESTADO_PERSONA_OPTIONS: OpcionBasica[] = [
  { id: 1, descripcion: 'Arrestado' },
  { id: 2, descripcion: 'Aprehendido' },
  { id: 3, descripcion: 'LGI o Perdida de Dominio' },
  { id: 4, descripcion: 'Principal aprendido' },
]

const GENERO_OPTIONS: OpcionBasica[] = [
  { id: 1, descripcion: 'Masculino' },
  { id: 2, descripcion: 'Femenino' },
]

const CONTRATADO_SEGIP_OPTIONS: OpcionBasica[] = [
  { id: 1, descripcion: 'Si' },
  { id: 2, descripcion: 'No' },
]

const TARJETA_PRONTUARIO_OPTIONS: OpcionBasica[] = [
  { id: 1, descripcion: 'Si' },
  { id: 2, descripcion: 'No' },
]

const CONDICION_PERSONA_OPTIONS: OpcionBasica[] = [
  { id: 1, descripcion: 'Vivo' },
  { id: 2, descripcion: 'Fallecido' },
]

interface Props {
  persona?: FiliacionPersonaTable
}

/* ================= COMPONENT ================= */
export const FormFiliacion = ({ persona }: Props) => {
  // TODO: Cambiar a false
  const [permisos, setPermisos] = useState<CasbinTypes>({
    read: true,
    create: true,
    update: true,
    delete: true,
  })

  /* PERMISOS */
  // TODO: Descomentar esta seccion
  // const definirPermisos = useCallback(async () => {
  //   const p = await permisoUsuario(pathname)
  //   setPermisos(p)
  // }, [permisoUsuario, pathname])

  // useEffect(() => {
  //   definirPermisos()
  // }, [definirPermisos])

  const { data: coloresCabello } = useQuery({
    queryKey: ['filiacion', 'color-cabello'],
    queryFn: getColorCabellos,
    placeholderData: keepPreviousData,
  })

  const { data: coloresOjos } = useQuery({
    queryKey: ['filiacion', 'color-ojos'],
    queryFn: getColorOjos,
    placeholderData: keepPreviousData,
  })

  const { data: coloresPiel } = useQuery({
    queryKey: ['filiacion', 'color-piel'],
    queryFn: getColorPieles,
    placeholderData: keepPreviousData,
  })

  const { data: constitucionesCorporales } = useQuery({
    queryKey: ['filiacion', 'constitucion-corporal'],
    queryFn: getConstitucionesCorporales,
    placeholderData: keepPreviousData,
  })

  const { data: tiposDocumento } = useQuery({
    queryKey: ['filiacion', 'tipo-documento'],
    queryFn: getTiposDocumento,
    placeholderData: keepPreviousData,
  })

  const { data: estadosCiviles } = useQuery({
    queryKey: ['filiacion', 'estado-civil'],
    queryFn: getEstadosCiviles,
    placeholderData: keepPreviousData,
  })

  const { data: profesiones } = useQuery({
    queryKey: ['filiacion', 'profesion'],
    queryFn: getProfesiones,
    placeholderData: keepPreviousData,
  })

  const { data: tiposCabello } = useQuery({
    queryKey: ['filiacion', 'tipo-cabello'],
    queryFn: getTiposCabello,
    placeholderData: keepPreviousData,
  })

  const { data: tiposNariz } = useQuery({
    queryKey: ['filiacion', 'tipo-nariz'],
    queryFn: getTiposNariz,
    placeholderData: keepPreviousData,
  })

  const { data: tiposOjos } = useQuery({
    queryKey: ['filiacion', 'tipo-ojos'],
    queryFn: getTiposOjos,
    placeholderData: keepPreviousData,
  })

  const { data: nacionalidades } = useQuery({
    queryKey: ['filiacion', 'nacionalidad'],
    queryFn: getPaises,
    placeholderData: keepPreviousData,
  })

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  /* ================= SUBMIT ================= */
  const onSubmit = async (values: FormValues) => {}

  return (
    <div className="">
      <div className="">
        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="panel grid grid-cols-1 md:grid-cols-12 p-4 gap-4">
            <div className="pt-4 col-span-12">
              <h2 className="font-bold text-lg text-primary">
                Datos Personales
              </h2>
            </div>
            <div className="col-span-6">
              <AsyncSearchSelect<OpcionBasica>
                name="estadoPersona"
                control={control}
                prefix="Estado Persona"
                error={errors.estadoPersona?.message}
                originalData={ESTADO_PERSONA_OPTIONS}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
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
              <AsyncSearchSelect<Pais>
                name="nacionalidad"
                control={control}
                prefix="Nacionalidad"
                error={errors.nacionalidad?.message}
                originalData={nacionalidades ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idPais,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-3">
              <AsyncSearchSelect<OpcionBasica>
                name="genero"
                control={control}
                prefix="Genero"
                error={errors.genero?.message}
                originalData={GENERO_OPTIONS}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-3">
              <AsyncSearchSelect<Profesion>
                name="profesionOcupacion"
                control={control}
                prefix="Profesión/Ocupación"
                error={errors.profesionOcupacion?.message}
                originalData={profesiones ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: Number(item.idProfesion),
                  original: item,
                })}
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
              <AsyncSearchSelect<TipoDocumento>
                name="tipoDocumento"
                control={control}
                prefix="Tipo de Documento"
                error={errors.tipoDocumento?.message}
                originalData={tiposDocumento ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idTipoDocumento,
                  original: item,
                })}
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
              <AsyncSearchSelect<EstadoCivil>
                name="estadoCivil"
                control={control}
                prefix="Estado Civil"
                error={errors.estadoCivil?.message}
                originalData={estadosCiviles ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idEstadoCivil,
                  original: item,
                })}
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
              <AsyncSearchSelect<OpcionBasica>
                name="contratadoSegip"
                control={control}
                prefix="Contratado con el SEGIP"
                error={errors.contratadoSegip?.message}
                originalData={CONTRATADO_SEGIP_OPTIONS}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
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
              <AsyncSearchSelect<OpcionBasica>
                name="tarjetaProntuario"
                control={control}
                prefix="Tarjeta Prontuario"
                error={errors.tarjetaProntuario?.message}
                originalData={TARJETA_PRONTUARIO_OPTIONS}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-4">
              <AsyncSearchSelect<OpcionBasica>
                name="condicionDeLaPersona"
                control={control}
                prefix="Condicion de la Persona"
                error={errors.condicionDeLaPersona?.message}
                originalData={CONDICION_PERSONA_OPTIONS}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
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
              <AsyncSearchSelect<TipoNariz>
                name="tipoNariz"
                control={control}
                prefix="Tipo de Nariz"
                error={errors.tipoNariz?.message}
                originalData={tiposNariz ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idTipoNariz,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-3">
              <AsyncSearchSelect<ConstitucionCorporal>
                name="constitucion"
                control={control}
                prefix="Constitución"
                error={errors.constitucion?.message}
                originalData={constitucionesCorporales ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idConstitucionCorporal,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-3">
              <AsyncSearchSelect<ColorPiel>
                name="colorPiel"
                control={control}
                prefix="Color de Piel"
                error={errors.colorPiel?.message}
                originalData={coloresPiel ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idColorPiel,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-3">
              <AsyncSearchSelect<ColorCabello>
                name="colorCabello"
                control={control}
                prefix="Color de Cabello"
                error={errors.colorCabello?.message}
                originalData={coloresCabello ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idColorCabello,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-4">
              <AsyncSearchSelect<TipoCabello>
                name="tipoCabello"
                control={control}
                prefix="Tipo de Cabello"
                error={errors.tipoCabello?.message}
                originalData={tiposCabello ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idTipoCabello,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-4">
              <AsyncSearchSelect<ColorOjo>
                name="colorOjos"
                control={control}
                prefix="Color de Ojos"
                error={errors.colorOjos?.message}
                originalData={coloresOjos ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idColorOjo,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-4">
              <AsyncSearchSelect<TipoOjos>
                name="tipoOjos"
                control={control}
                prefix="Tipo de Ojos"
                error={errors.tipoOjos?.message}
                originalData={tiposOjos ?? []}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idTipoOjos,
                  original: item,
                })}
              />
            </div>
            <div className="col-span-4">
              <FileInputWithPreview
                showPreview
                name="fotoFrontal"
                register={register}
                setValue={setValue}
                accept=".webp,.png,.jpg"
                prefix="Foto Frontal"
                error={errors.fotoFrontal?.message}
              />
            </div>
            <div className="col-span-4">
              <FileInputWithPreview
                name="fotoPerfilIzquierdo"
                register={register}
                setValue={setValue}
                accept=".webp,.png,.jpg"
                prefix="Foto Perfil Izquierdo"
                error={errors.fotoPerfilIzquierdo?.message}
              />
            </div>
            <div className="col-span-4">
              <FileInputWithPreview
                name="fotoPerfilDerecho"
                register={register}
                setValue={setValue}
                accept=".webp,.png,.jpg"
                prefix="Foto Perfil Derecho"
                error={errors.fotoPerfilDerecho?.message}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-5 py-4 border-t dark:border-gray-700">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
