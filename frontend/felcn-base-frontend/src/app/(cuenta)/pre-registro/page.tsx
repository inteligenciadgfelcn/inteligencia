'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useFullScreenLoading } from '@/context/FullScreenLoadingProvider'
import { useAlerts } from '@/hooks'
import { delay, InterpreteMensajes, siteName } from '@/utils'
import { validarFechaFormato } from '@/utils/fechas'
import { Servicios } from '@/services'
import { Constantes } from '@/config/Constantes'
import { Icono } from '@/components/Icono'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { Select } from '@/components/ui/Select'
import { BASE_PATH } from '@/imageLoader'

const formSchema = z
  .object({
    nombres: z.string().min(2, 'El nombre es requerido.'),
    primerApellido: z
      .string()
      .optional()
      .refine((v) => !v || v.trim().length >= 2, {
        message: 'El primer apellido debe tener al menos 2 caracteres.',
      }),
    segundoApellido: z
      .string()
      .optional()
      .refine((v) => !v || v.trim().length >= 2, {
        message: 'El segundo apellido debe tener al menos 2 caracteres.',
      }),
    nroDocumento: z
      .string()
      .min(5, 'El número de documento debe tener al menos 5 caracteres.'),
    fechaNacimiento: z
      .string()
      .refine((d) => validarFechaFormato(d, 'YYYY-MM-DD'), {
        message: 'Fecha de nacimiento inválida',
      }),
    telefono: z
      .string()
      .optional()
      .refine((v) => !v || /^[6-7]\d{7}$/.test(v), {
        message: 'Debe ser un teléfono válido',
      }),
    idGrado: z.preprocess(
      (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
      z.number({ required_error: 'El grado es requerido.' })
    ),
    numeroPase: z.string().min(1, 'El número de pase es requerido.'),
  })
  .superRefine((values, ctx) => {
    if (!values.primerApellido?.trim() && !values.segundoApellido?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['primerApellido'],
        message: 'Debe ingresar al menos un apellido.',
      })
    }
  })

type FormValues = z.infer<typeof formSchema>

type EstadoLink = 'validando' | 'valido' | 'invalido'

export default function PreRegistroPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { Alerta } = useAlerts()
  const { mostrarFullScreen, ocultarFullScreen } = useFullScreenLoading()

  const token = searchParams.get('token') || ''
  const [estadoLink, setEstadoLink] = useState<EstadoLink>('validando')
  const [correoElectronico, setCorreoElectronico] = useState('')
  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: '',
      primerApellido: '',
      segundoApellido: '',
      nroDocumento: '',
      fechaNacimiento: '',
      telefono: '',
      idGrado: undefined as any,
      numeroPase: '',
    },
  })

  useEffect(() => {
    const validar = async () => {
      if (!token) {
        setEstadoLink('invalido')
        return
      }
      try {
        const respuesta = await Servicios.get({
          url: `${Constantes.authUrl}/usuarios/solicitudes-registro/acceso/${token}`,
        })
        setCorreoElectronico(respuesta?.datos?.correoElectronico ?? '')
        setEstadoLink('valido')
      } catch {
        setEstadoLink('invalido')
      }
    }
    validar()
  }, [token])

  const obtenerGrados = async () => {
    const respuesta = await Servicios.get({
      url: `${Constantes.authUrl}/usuarios/solicitudes-registro/grados`,
    })
    return respuesta?.datos ?? []
  }

  const { data: grados = [] } = useQuery({
    queryKey: ['solicitudes-registro-grados'],
    queryFn: obtenerGrados,
    enabled: estadoLink === 'valido',
  })

  const irAlInicio = async () => {
    mostrarFullScreen()
    await delay(500)
    router.replace('/login')
    ocultarFullScreen()
  }

  const onSubmit = async (values: FormValues) => {
    try {
      setCargando(true)
      const respuesta = await Servicios.post({
        url: `${Constantes.authUrl}/usuarios/solicitudes-registro/completar`,
        body: {
          token,
          nombres: values.nombres.trim(),
          primerApellido: values.primerApellido?.trim() || undefined,
          segundoApellido: values.segundoApellido?.trim() || undefined,
          nroDocumento: values.nroDocumento.trim(),
          fechaNacimiento: values.fechaNacimiento,
          telefono: values.telefono || undefined,
          idGrado: values.idGrado,
          numeroPase: values.numeroPase.trim(),
        },
      })
      setMensaje(InterpreteMensajes(respuesta))
      setEnviado(true)
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <title>{`Preregistro - ${siteName()}`}</title>
      <div
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-6 py-10"
        style={{
          backgroundImage: `url(${BASE_PATH}/assets/images/auth/map.png)`,
        }}
      >
        <div className="w-full max-w-2xl rounded-md bg-white/60 p-10 backdrop-blur-lg dark:bg-black/50">
          {estadoLink === 'validando' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <ProgresoLineal mostrar={true} />
              <p className="text-white-dark">Validando enlace...</p>
            </div>
          )}

          {estadoLink === 'invalido' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <Icono fontSize="large">cancel</Icono>
              <h1 className="text-2xl font-extrabold text-primary">
                Enlace inválido o vencido
              </h1>
              <p className="text-white-dark">
                Este enlace de preregistro no es válido o venció. Solicite uno
                nuevo desde la pantalla de creación de cuenta.
              </p>
              <button
                type="button"
                className="btn btn-gradient w-full max-w-xs uppercase"
                onClick={irAlInicio}
              >
                Ir al inicio
              </button>
            </div>
          )}

          {estadoLink === 'valido' &&
            (enviado ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <Icono fontSize="large">check_circle</Icono>
                <h1 className="text-2xl font-extrabold text-primary">
                  Solicitud registrada
                </h1>
                <p className="text-white-dark">{mensaje}</p>
                <button
                  type="button"
                  className="btn btn-gradient w-full max-w-xs uppercase"
                  onClick={irAlInicio}
                >
                  Ir al inicio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="mb-4">
                  <h1 className="text-2xl font-extrabold text-primary">
                    Complete su preregistro
                  </h1>
                  <p className="text-white-dark">
                    Solicitando acceso con el correo{' '}
                    <strong>{correoElectronico}</strong>. Su solicitud será
                    revisada por un administrador antes de habilitar su
                    cuenta.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-0 block text-white-dark">
                      Nombres
                    </label>
                    <input
                      {...register('nombres', {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase()
                        },
                      })}
                      disabled={cargando}
                      className="form-input"
                    />
                    <p className="text-danger text-sm">
                      {errors.nombres?.message}
                    </p>
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">
                      Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      {...register('fechaNacimiento')}
                      disabled={cargando}
                      className="form-input"
                    />
                    <p className="text-danger text-sm">
                      {errors.fechaNacimiento?.message}
                    </p>
                  </div>

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
                      disabled={cargando}
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
                      disabled={cargando}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">
                      Nro. Documento
                    </label>
                    <input
                      {...register('nroDocumento', {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase()
                        },
                      })}
                      disabled={cargando}
                      className="form-input"
                    />
                    <p className="text-danger text-sm">
                      {errors.nroDocumento?.message}
                    </p>
                    <span className="text-xs text-white-dark mt-1 block">
                      Si su número de documento tiene complemento,
                      regístrelo tal cual. Ejemplo: 1234567-1A.
                    </span>
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      {...register('telefono')}
                      disabled={cargando}
                      className="form-input"
                    />
                    <p className="text-danger text-sm">
                      {errors.telefono?.message}
                    </p>
                  </div>

                  <div>
                    <label className="mb-0 block text-white-dark">
                      Grado
                    </label>
                    <Select
                      options={grados.map((g: any) => ({
                        value: g.id,
                        label: `${g.abreviatura} — ${g.descripcion}`,
                      }))}
                      placeholder="Seleccione un grado"
                      value={watch('idGrado') ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setValue(
                          'idGrado',
                          (val === '' ? undefined : Number(val)) as any,
                          { shouldValidate: true }
                        )
                      }}
                      disabled={cargando}
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
                    <input
                      {...register('numeroPase', {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase()
                        },
                      })}
                      disabled={cargando}
                      className="form-input"
                    />
                    <p className="text-danger text-sm">
                      {errors.numeroPase?.message}
                    </p>
                  </div>
                </div>

                <ProgresoLineal mostrar={cargando} />

                <button
                  type="submit"
                  disabled={cargando}
                  className="btn btn-gradient w-full uppercase"
                >
                  {cargando ? 'Enviando...' : 'Enviar preregistro'}
                </button>
              </form>
            ))}
        </div>
      </div>
    </>
  )
}
