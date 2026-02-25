'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import SelectWithPrefix from '@/components/form/FormSelectWithPrefix'
import { nowDateToString } from '@/utils/fechas'
import { RegistroTypeCRUD } from '../types/RegistroType'

/* ================= VALIDACIÓN ================= */
const datosPersonaSchema = z.object({
  nombreCompleto: z.string().min(1, 'Nombre completo obligatorio'),
  nroCelular: z.string().min(1, 'Número de celular obligatorio'),
})

export const formSchema = z.object({
  codigoServicio: z.string().min(1, 'Código de servicio obligatorio'),
  nroPase: z.string().min(1, 'Número de pase obligatorio'),
  departamento: z.number().min(1, 'Departamento obligatorio'),
  unidad: z.number().min(1, 'Unidad obligatoria'),
  distrital: z.number().min(1, 'Distrital obligatorio'),
  grupo: z.number().min(1, 'Grupo obligatorio'),
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
  registro?: RegistroTypeCRUD | null
  onSuccess: () => void
}

/* ================= COMPONENT ================= */
export const FormRegistro = ({ registro, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false)
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()

  // Cachés para mapear value -> label
  const [departamentosCache, setDepartamentosCache] = useState<{
    [key: string]: string
  }>({})
  const [unidadesCache, setUnidadesCache] = useState<{ [key: string]: string }>(
    {}
  )
  const [distritalesCache, setDistritalesCache] = useState<{
    [key: string]: string
  }>({})
  const [gruposCache, setGruposCache] = useState<{ [key: string]: string }>({})

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    trigger,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // codigoServicio: registro?.codigoServicio || '',
      // nroPase: registro?.nroPase || '',
      // departamento: 0,
      // unidad: 0,
      // distrital: 0,
      // grupo: 0,
      // nroRegistro: registro?.nroRegistro || '',
      // nombreOperativo: registro?.nombreOperativo || '',
      fechaHoraOperativo: nowDateToString(),
      // quienRealiza: {
      //   nombreCompleto: registro?.quienRealiza?.nombreCompleto || '',
      //   nroCelular: registro?.quienRealiza?.nroCelular || '',
      // },
      // asignadoA: {
      //   nombreCompleto: registro?.asignadoA?.nombreCompleto || '',
      //   nroCelular: registro?.asignadoA?.nroCelular || '',
      // },
      // fiscalAsignado: {
      //   nombreCompleto: registro?.fiscalAsignado?.nombreCompleto || '',
      //   nroCelular: registro?.fiscalAsignado?.nroCelular || '',
      // },
    },
  })

  const unidadSeleccionada = watch('unidad')
  const distritalSeleccionado = watch('distrital')
  const isUnidadFirstChange = useRef(true)
  const isDistritalFirstChange = useRef(true)

  const loadDepartments = async (inputValue: string) => {
    const response = await sesionPeticion({
      url: `${Constantes.baseApiUrl}/departamentos/all/pais`,
      params: { idPais: 1 },
      withCredentials: true,
    })

    const options = response.data.map((json: any) => ({
      value: json.id,
      label: json.nombre,
    }))

    // Actualizar caché
    const cache: { [key: string]: string } = {}
    options.forEach((opt: { value: string; label: string }) => {
      cache[opt.value] = opt.label
    })
    setDepartamentosCache(cache)

    return options.filter((d: any) =>
      d.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  const loadUnities = async (inputValue: string) => {
    const response = await sesionPeticion({
      url: `${Constantes.baseApiUrl}/unidades/allGeneral`,
      withCredentials: true,
    })

    const options = response.data.map((json: any) => ({
      value: json.id,
      label: json.descripcion,
    }))

    // Actualizar caché
    const cache: { [key: string]: string } = {}
    options.forEach((opt: { value: string; label: string }) => {
      cache[opt.value] = opt.label
    })
    setUnidadesCache(cache)

    return options.filter((d: any) =>
      d.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  const loadDistritals = async (inputValue: string) => {
    if (!unidadSeleccionada) {
      return []
    }

    try {
      const response = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/distritales/all/unidad`,
        params: { idUnidad: unidadSeleccionada },
        withCredentials: true,
      })

      const options = response.data.map((json: any) => ({
        value: json.id,
        label: json.descripcion,
      }))

      // Actualizar caché
      const cache: { [key: string]: string } = {}
      options.forEach((opt: { value: string; label: string }) => {
        cache[opt.value] = opt.label
      })
      setDistritalesCache(cache)

      const filtered = options.filter((d: any) =>
        d.label.toLowerCase().includes(inputValue.toLowerCase())
      )

      return filtered
    } catch (error) {
      return []
    }
  }

  const loadGroups = async (inputValue: string) => {
    if (!distritalSeleccionado) {
      return []
    }

    try {
      const response = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/grupos/all/distrito`,
        params: { idDistrito: distritalSeleccionado },
        withCredentials: true,
      })

      const options = response.data.map((json: any) => ({
        value: json.id,
        label: json.descripcion,
      }))

      // Actualizar caché
      const cache: { [key: string]: string } = {}
      options.forEach((opt: { value: string; label: string }) => {
        cache[opt.value] = opt.label
      })
      setGruposCache(cache)

      const filtered = options.filter((d: any) =>
        d.label.toLowerCase().includes(inputValue.toLowerCase())
      )

      return filtered
    } catch (error) {
      return []
    }
  }

  useEffect(() => {
    loadDepartments('')
    loadUnities('')
  }, [])

  useEffect(() => {
    if (isUnidadFirstChange.current) {
      isUnidadFirstChange.current = false
      return
    }

    setValue('distrital', 0)
    setValue('grupo', 0)
  }, [unidadSeleccionada, setValue])

  useEffect(() => {
    if (isDistritalFirstChange.current) {
      isDistritalFirstChange.current = false
      return
    }

    setValue('grupo', 0)
  }, [distritalSeleccionado, setValue])

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
        idDepartamento: values.departamento,
        idGrupo: values.grupo,
        nombreCaso: values.nombreOperativo,
        fechaSolicitud: values.fechaHoraOperativo,
        nombreSolicitud: values.quienRealiza.nombreCompleto,
        telefonoSolicitud: values.quienRealiza.nroCelular,
        asignado: values.asignadoA.nombreCompleto,
        telefonoAsignado: values.asignadoA.nroCelular,
        fiscalAsignado: values.fiscalAsignado.nombreCompleto,
        telefonoFiscal: values.fiscalAsignado.nroCelular,
      }

      const resp = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/asignaciones`,
        method: 'post',
        body: payload,
      })

      Alerta({
        mensaje: InterpreteMensajes(resp),
        variant: 'success',
      })

      reset()
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
    if (!isValid) {
      return
    }

    const codigoServicio = watch('codigoServicio')
    const nroPase = watch('nroPase')
    const departamento = watch('departamento')
    const unidad = watch('unidad')
    const distrital = watch('distrital')
    const grupo = watch('grupo')

    try {
      setLoading(true)

      const response = await sesionPeticion({
        url: `${Constantes.baseApiUrl}/asignaciones/generar-codigo`,
        params: { idDepartamento: departamento, idGrupo: grupo },
        withCredentials: true,
      })

      Alerta({
        mensaje: InterpreteMensajes({
          mensaje: 'Número de registro asignado correctamente',
        }),
        variant: 'success',
      })

      // Si la respuesta contiene el número de registro, actualizarlo en el form
      if (response.data) {
        setValue('nroRegistro', response.data)
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

  return (
    <div className="">
      <div className="">
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
              <SelectWithPrefix
                name="departamento"
                control={control}
                prefix="Departamento"
                loadOptions={loadDepartments}
                optionsCache={departamentosCache}
                error={errors.departamento?.message}
              />
            </div>
            <div className="col-span-4">
              <SelectWithPrefix
                name="unidad"
                control={control}
                prefix="Unidad"
                loadOptions={loadUnities}
                optionsCache={unidadesCache}
                error={errors.unidad?.message}
              />
            </div>
            <div className="col-span-4">
              <SelectWithPrefix
                key={`distrital-${unidadSeleccionada}`}
                name="distrital"
                control={control}
                prefix="Distrital"
                loadOptions={loadDistritals}
                optionsCache={distritalesCache}
                disabled={!unidadSeleccionada}
                error={errors.distrital?.message}
              />
            </div>
            <div className="col-span-4">
              <SelectWithPrefix
                key={`grupo-${distritalSeleccionado}`}
                name="grupo"
                control={control}
                prefix="Grupo"
                loadOptions={loadGroups}
                optionsCache={gruposCache}
                disabled={!distritalSeleccionado}
                error={errors.grupo?.message}
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
