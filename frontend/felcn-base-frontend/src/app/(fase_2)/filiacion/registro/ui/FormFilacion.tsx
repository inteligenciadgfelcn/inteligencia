'use client'

import { useEffect, useState } from 'react'
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
import { postRegistroFiliacion } from '../services/filiacion.service'

import FileInputWithPreview from '@/components/form/FormInputFileWithPrefix'
import { CasbinTypes } from '@/types'
import { getPaises, Pais } from '../services/pais.service'
import { FiliacionPersonaTable } from '../type/filiacion.persona.table'
import { imprimir } from '@/utils/imprimir'
import { useAlerts } from '@/hooks'
import FingerprintCapture from '@/components/finger/FingerprintCapture'
import { r } from '@faker-js/faker/dist/airline-BnpeTvY9'
import { postRegistroHuella } from '../services/finger.service'

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
  estatura: z
    .string()
    .min(1, 'La estatura es obligatoria')
    .pipe(z.coerce.number({ invalid_type_error: 'Debe ser un número válido' })),
  pesoCorporal: z
    .string()
    .min(1, 'El peso corporal es obligatorio')
    .pipe(z.coerce.number({ invalid_type_error: 'Debe ser un número válido' })),

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
  onSuccess?: () => void
}

interface FingerData {
  id: string
  nameFinger: string
  image: string
  calidad: number
}

/* ================= COMPONENT ================= */
export const FormFiliacion = ({ persona, onSuccess }: Props) => {
  const { Alerta } = useAlerts()

  const rightFingers = [
    { id: 'Derecho_Pulgar', nameFinger: 'Pulgar', image: '', calidad: 0 },
    { id: 'Derecho_Indice', nameFinger: 'Índice', image: '', calidad: 0 },
    { id: 'Derecho_Medio', nameFinger: 'Medio', image: '', calidad: 0 },
    { id: 'Derecho_Anular', nameFinger: 'Anular', image: '', calidad: 0 },
    { id: 'Derecho_Menique', nameFinger: 'Meñique', image: '', calidad: 0 },
  ]

  const leftFingers = [
    { id: 'Izquierdo_Pulgar', nameFinger: 'Pulgar', image: '', calidad: 0 },
    { id: 'Izquierdo_Indice', nameFinger: 'Índice', image: '', calidad: 0 },
    { id: 'Izquierdo_Medio', nameFinger: 'Medio', image: '', calidad: 0 },
    { id: 'Izquierdo_Anular', nameFinger: 'Anular', image: '', calidad: 0 },
    { id: 'Izquierdo_Menique', nameFinger: 'Meñique', image: '', calidad: 0 },
  ]

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

  const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = String(reader.result ?? '')
        const base64 = result.includes(',') ? result.split(',')[1] : result
        resolve(base64)
      }
      reader.onerror = () => reject(new Error('No se pudo procesar la imagen'))
      reader.readAsDataURL(file)
    })
  }

  const convertirFecha = (fecha: string) => {
    const [dia, mes, anio] = fecha.split('/')

    if (!dia || !mes || !anio) {
      throw new Error('Formato inválido')
    }

    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
  }

  const sendFingers = async () => {
    const allFingers = [...rightFingers, ...leftFingers]
    const fingersWithImage = allFingers.filter((f) => f.image)
    console.log('Fingers to send:', fingersWithImage)
    await Promise.all(
      fingersWithImage.map((item) =>
        postRegistroHuella({
          personaId: persona?.id_persona_auxiliar ?? '-1',
          imagen: item.image,
          calidad: 0,
          dedo: item.id,
        })
      )
    )
  }

  /* ================= SUBMIT ================= */
  const onSubmit = async (values: FormValues) => {
    if (!persona) {
      Alerta({
        mensaje: 'Debe seleccionar una persona antes de guardar',
        variant: 'error',
      })
      return
    }

    try {
      sendFingers()
      const [fotoFrente, fotoPerfilDerecho, fotoPerfilIzquierdo] =
        await Promise.all([
          fileToBase64(values.fotoFrontal),
          fileToBase64(values.fotoPerfilDerecho),
          fileToBase64(values.fotoPerfilIzquierdo),
        ])

      await postRegistroFiliacion({
        idPersona: Number(persona.id_persona_auxiliar),
        estadoPersona: values.estadoPersona.label,
        numeroCaso: persona.numero_caso,
        nombres: values.nombre,
        apellidoPaterno: values.paterno,
        apellidoMaterno: values.materno ?? '',
        apellidoEsposo: values.apEsposo ?? '',
        idPais: values.nacionalidad.value,
        genero: values.genero.value === 1,
        fechaNacimiento: convertirFecha(values.fechaNacimiento),
        idEstadoCivil: values.estadoCivil.value,
        direccion: values.direccion,
        observacion: values.observacion ?? '',
        detenido: {
          serie: '*',
          seccion: '*',
          tieneTarjeta: values.tarjetaProntuario.value === 1,
          estaVivo: values.condicionDeLaPersona.value === 1,
          fotoFrente,
          fotoPerfilDerecho,
          fotoPerfilIzquierdo,
          observacionAdicional: values.observacion ?? '',
        },
        alias: {
          alias: values.alias,
        },
        profesion: {
          idProfesion: values.profesionOcupacion.value,
        },
        documento: {
          idTipoDocumento: values.tipoDocumento.value,
          numeroDocumento: values.numeroDocumento ?? '',
          expedido: values.expedidoEn,
          contrastadoSegip: values.contratadoSegip.label,
        },
        fenotipo: {
          estatura: String(values.estatura),
          pesoCorporal: String(values.pesoCorporal),
          senasParticulares: values.senalesParticulares,
          tatuajes: values.tatuajes ?? '',
          tipoNariz: values.tipoNariz.value,
          constitucionCorporal: values.constitucion.value,
          idColorPiel: values.colorPiel.value,
          idColorCabello: values.colorCabello.value,
          idTipoCabello: values.tipoCabello.value,
          idColorOjos: values.colorOjos.value,
          idTipoOjos: values.tipoOjos.value,
        },
        arrestado: {
          idOperativo: Number(persona.id_operativo),
          lugarOperativo: values.lugarOperativo,
          lugarNacimiento: values.lugarNacimiento,
          fotoDedoIzquierdo: '',
          fotoDedoDerecho: '',
        },
      })

      Alerta({
        mensaje: 'Registro de filiacion guardado correctamente',
        variant: 'success',
      })
      onSuccess?.()
    } catch (error: any) {
      imprimir('Error al guardar filiacion', error)
      Alerta({
        mensaje:
          error?.mensaje ?? error?.message ?? 'No se pudo guardar la filiacion',
        variant: 'error',
      })
    }
  }

  useEffect(() => {
    if (persona && nacionalidades) {
      const nacionalidadEncontrada = nacionalidades?.find(
        (n) => n.descripcion.toLowerCase() === persona.pais.toLowerCase()
      )

      const generoEncontrado = GENERO_OPTIONS.find(
        (g) => g.descripcion.toLowerCase() === persona.genero.toLowerCase()
      )

      const tipoDocumentoEncontrado = tiposDocumento?.find(
        (t) =>
          t.descripcion.toLowerCase() === persona.tipo_documento.toLowerCase()
      )

      imprimir('Nacionalidad encontrada', nacionalidadEncontrada)

      setValue('nombre', persona.nombres)
      setValue('paterno', persona.apellido_paterno)
      setValue('materno', persona.apellido_materno)
      setValue('apEsposo', persona.apellido_esposo)
      setValue('lugarOperativo', persona.lugar)
      setValue('numeroDocumento', persona.numero_documento)
      setValue('fechaNacimiento', persona.fecha_nacimiento)
      setValue('direccion', persona.direccion)
      setValue('nacionalidad', {
        label: nacionalidadEncontrada!.descripcion,
        value: nacionalidadEncontrada!.idPais,
      })
      setValue('genero', {
        label: generoEncontrado!.descripcion,
        value: generoEncontrado!.id,
      })
      setValue('tipoDocumento', {
        label: tipoDocumentoEncontrado!.descripcion,
        value: tipoDocumentoEncontrado!.idTipoDocumento,
      })
    }
  }, [persona, nacionalidades, setValue])

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
                onlyNumbers
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
            <div className="col-span-6">
              <InputWithPrefix
                name="observacion"
                prefix="Observación"
                register={register}
                error={errors.observacion?.message as string}
              />
            </div>
            <div className="col-span-3">
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
            <div className="col-span-3">
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
                showPreview
              />
            </div>
            <div className="col-span-4">
              <FileInputWithPreview
                name="fotoPerfilDerecho"
                showPreview
                register={register}
                setValue={setValue}
                accept=".webp,.png,.jpg"
                prefix="Foto Perfil Derecho"
                error={errors.fotoPerfilDerecho?.message}
              />
            </div>
          </div>

          {/* Huellas derecha */}
          <div className="panel mt-6 col-span-12">
            <h2 className="font-bold text-lg text-primary">
              Huellas mano derecha
            </h2>
            <div className="col-span-12 grid grid-cols-5 gap-4">
              {rightFingers.map((finger) => (
                <FingerprintCapture
                  key={finger.id}
                  id={finger.id}
                  name_finger={finger.nameFinger}
                  onChangeImage={(img, calidad) => {
                    finger.image = img ?? ''
                    finger.calidad = calidad
                  }}
                />
              ))}
            </div>
          </div>

          {/* Huellas izquierda */}
          <div className="panel mt-6 col-span-12">
            <h2 className="font-bold text-lg text-primary">
              Huellas mano izquierda
            </h2>
            <div className="col-span-12  grid grid-cols-5 gap-4">
              {leftFingers.map((finger) => (
                <FingerprintCapture
                  key={finger.id}
                  id={finger.id}
                  name_finger={finger.nameFinger}
                  onChangeImage={(img, calidad) => {
                    finger.image = img ?? ''
                    finger.calidad = calidad
                  }}
                />
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="col-span-12 mt-6 flex justify-end gap-4">
            <button type="submit" className="btn btn-primary col-span-2">
              Agregar persona
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
