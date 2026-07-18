'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import IconX from '@/components/Icon/IconX'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import SelectWithIconField from '@/components/form/FormSelectWithIconField'
import FormInput from '@/components/form/FormInput'

import { ModuloCRUDType } from '../types/CrearEditarModulosType'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { trimPayload } from '@/utils/trimPayload'
import { menuIconMap } from '@/components/sidebar/menuIconMap'
import FormTextarea from '@/components/form/FormTextarea'

/* ================= VALIDACIÓN ================= */

const formSchema = z
  .object({
    label: z.string().min(1, 'Label obligatorio'),
    nombre: z.string().min(1, 'Nombre obligatorio'),
    url: z.string().min(1, 'URL obligatoria'),
    orden: z.coerce.number().min(1, 'Orden mínimo 1'),
    descripcion: z.string().min(1, 'Descripción obligatoria'),
    icono: z.string().optional(),
    moduloPadreId: z.string().nullable(),
    esSeccion: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.esSeccion) {
        return (
          data.icono !== undefined && data.icono !== null && data.icono !== ''
        )
      }
      return true
    },
    {
      path: ['icono'], // Campo al que se aplica la validación condicional
      message: 'El ícono es requerido',
    }
  )

type FormValues = z.infer<typeof formSchema>

/* ================= PROPS ================= */

interface Props {
  isOpen: boolean
  onClose: () => void
  modulo?: ModuloCRUDType | null
  modulos: ModuloCRUDType[]
  onSuccess: () => void
  tipoNuevo?: 'modulo' | 'seccion'
}

/* ================= COMPONENT ================= */

export const ModalModulo = ({
  isOpen,
  onClose,
  modulo,
  modulos,
  onSuccess,
  tipoNuevo,
}: Props) => {
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
      label: modulo?.label || '',
      nombre: modulo?.nombre || '',
      url: modulo?.url || '',
      orden: modulo?.propiedades?.orden || 1,
      descripcion: modulo?.propiedades?.descripcion || '',
      icono: modulo?.propiedades?.icono || '',
      moduloPadreId: modulo?.modulo?.id || null,
      esSeccion: tipoNuevo === 'seccion',
    },
  })

  const esSeccionWatch = watch('esSeccion')

  /* ================= SUBMIT ================= */

  const onSubmit = async (values: FormValues) => {
    if (loading) return
    try {
      setLoading(true)
      const datos = trimPayload(values)
      const payload = {
        idModulo: datos.moduloPadreId || null,
        label: datos.label,
        url: datos.url,
        nombre: datos.nombre,
        propiedades: {
          orden: datos.orden,
          descripcion: datos.descripcion,
          icono: datos.esSeccion ? undefined : datos.icono,
        },
        modulo: datos.esSeccion
          ? null
          : datos.moduloPadreId
            ? { id: datos.moduloPadreId }
            : null,
      }

      const resp = await sesionPeticion({
        url: `${Constantes.authUrl}/autorizacion/modulos${
          modulo?.id ? `/${modulo.id}` : ''
        }`,
        method: modulo?.id ? 'patch' : 'post',
        body: payload,
      })

      Alerta({
        mensaje: InterpreteMensajes(resp),
        variant: 'success',
      })

      onSuccess()
      onClose()
    } catch (e) {
      imprimir('Error módulo', e)
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-black w-full max-w-lg rounded-lg shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b dark:border-gray-700">
          <div>
            <h2 className="font-bold text-lg">
              {modulo?.id
                ? esSeccionWatch
                  ? 'Editar Sección'
                  : 'Editar Módulo'
                : esSeccionWatch
                  ? 'Nueva Sección'
                  : 'Nuevo Módulo'}
            </h2>
            <p className="text-sm text-gray-500">
              Complete la información del módulo
            </p>
          </div>

          <button onClick={onClose}>
            <IconX />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-5 grid grid-cols-1 gap-4">
            {!esSeccionWatch && (
              <SelectWithIconField
                label="Sección"
                name="moduloPadreId"
                options={modulos.map((m) => ({
                  value: m.id,
                  label: m.label,
                }))}
                register={register}
                value={watch('moduloPadreId') || ''}
                disabled={loading}
                error={errors.moduloPadreId?.message}
              />
            )}

            <FormInput
              label="Nombre"
              name="nombre"
              register={register}
              error={errors.nombre?.message}
              disabled={loading}
              uppercase
            />

            <FormInput
              label="Label"
              name="label"
              register={register}
              error={errors.label?.message}
              disabled={loading}
              uppercase
            />

            <FormInput
              label="URL"
              name="url"
              register={register}
              error={errors.url?.message}
              disabled={loading}
            />

            <FormInput
              label="Orden"
              name="orden"
              type="number"
              register={register}
              error={errors.orden?.message}
              disabled={loading}
            />
            {!esSeccionWatch && (
              <SelectWithIconField
                label="Icono"
                name="icono"
                options={iconOptions}
                register={register}
                value={watch('icono') || ''}
                error={errors.icono?.message}
                disabled={loading}
              />
            )}

            <FormTextarea
              label="Descripción"
              name="descripcion"
              rows={3}
              placeholder="Ingrese descripción"
              register={register}
              error={errors.descripcion?.message}
              uppercase
            />
          </div>

          <ProgresoLineal mostrar={loading} />

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-5 py-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-outline-danger"
            >
              Cancelar
            </button>

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
