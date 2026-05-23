'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { PersonasServiceInstance, CreateSituacionPayload } from '@/services/seguimiento/SeguimientoPersonasService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import dayjs from 'dayjs'

interface Props {
  idDetenido: string
}

export function SituacionLegalSeccion({ idDetenido }: Props) {
  const { Alerta } = useAlerts()
  const [situacionesLegales, setSituacionesLegales] = useState<{ value: number; label: string }[]>([])
  const [registros, setRegistros] = useState<any[]>([])

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<CreateSituacionPayload>({
    defaultValues: { idSituacionLegal: 0, nroResolucion: '', lugar: '', fecha: dayjs().format('YYYY-MM-DD'), autoridad: '', fjt: '' }
  })

  const reglaObligatorio = {
    required: 'Campo obligatorio',
    validate: (value: any) => {
      if (typeof value === 'number') return value !== 0 || 'Campo obligatorio'
      return String(value ?? '').trim() !== '' || 'Campo obligatorio'
    },
  }

  useEffect(() => {
    const cargarLookups = async () => {
      try {
        const res = await PersonasServiceInstance.listarSituacionesLegales()
        const datos = Array.isArray(res) ? res : res?.datos ?? []
        setSituacionesLegales(datos.map((d: any) => ({ value: d.id, label: d.descripcion })))
      } catch { /* silencioso */ }
    }
    void cargarLookups()
  }, [])

  const cargarRegistros = async () => {
    try {
      const res = await PersonasServiceInstance.listarSituaciones(idDetenido)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch { setRegistros([]) }
  }

  useEffect(() => { void cargarRegistros() }, [idDetenido])

  const onSubmit = async (payload: CreateSituacionPayload) => {
    try {
      await PersonasServiceInstance.registrarSituacion(idDetenido, {
        ...payload,
        idSituacionLegal: Number(payload.idSituacionLegal),
      })
      Alerta({ mensaje: 'Situación legal registrada correctamente', variant: 'success' })
      reset()
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="fecha" className="mb-1 block text-sm font-medium">
                Fecha de Situación Legal <span className="text-danger">*</span>
              </label>
              <Input
                id="fecha"
                type="date"
                className={`w-full ${errors.fecha ? 'border-danger' : ''}`}
                {...register('fecha', reglaObligatorio)}
              />
              {errors.fecha && (
                <div className="mt-1 text-xs text-danger">
                  {errors.fecha.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="idSituacionLegal" className="mb-1 block text-sm font-medium">
                Situación Legal <span className="text-danger">*</span>
              </label>
              <Select
                id="idSituacionLegal"
                placeholder="Seleccione..."
                options={situacionesLegales}
                className={`w-full ${errors.idSituacionLegal ? 'border-danger' : ''}`}
                {...register('idSituacionLegal', {
                  ...reglaObligatorio,
                  valueAsNumber: true,
                })}
              />
              {errors.idSituacionLegal && (
                <div className="mt-1 text-xs text-danger">
                  {errors.idSituacionLegal.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="nroResolucion" className="mb-1 block text-sm font-medium">
                Nro. de Resolución del Acta de Medida Cautelar
              </label>
              <Input
                id="nroResolucion"
                type="text"
                className="w-full"
                {...register('nroResolucion')}
              />
            </div>
            <div>
              <label htmlFor="lugar" className="mb-1 block text-sm font-medium">
                Departamento, Provincia, Lugar <span className="text-danger">*</span>
              </label>
              <Input
                id="lugar"
                type="text"
                className={`w-full ${errors.lugar ? 'border-danger' : ''}`}
                {...register('lugar', reglaObligatorio)}
              />
              {errors.lugar && (
                <div className="mt-1 text-xs text-danger">
                  {errors.lugar.message}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="autoridad" className="mb-1 block text-sm font-medium">
                Autoridad (Nombre del Juez) <span className="text-danger">*</span>
              </label>
              <Input
                id="autoridad"
                type="text"
                className={`w-full ${errors.autoridad ? 'border-danger' : ''}`}
                {...register('autoridad', reglaObligatorio)}
              />
              {errors.autoridad && (
                <div className="mt-1 text-xs text-danger">
                  {errors.autoridad.message}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="fjt" className="mb-1 block text-sm font-medium">
                Juzgado o Tribunal <span className="text-danger">*</span>
              </label>
              <Input
                id="fjt"
                type="text"
                className={`w-full ${errors.fjt ? 'border-danger' : ''}`}
                {...register('fjt', reglaObligatorio)}
              />
              {errors.fjt && (
                <div className="mt-1 text-xs text-danger">
                  {errors.fjt.message}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" size="sm" loading={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold">Historial de Situaciones Legales</h4>
        <div className="datatables">
          <VristoDataTable
            loading={false}
            rows={registros}
            total={registros.length}
            page={1}
            limit={registros.length || 10}
            onPageChange={() => { }}
            onLimitChange={() => { }}
            columns={[
              { accessor: 'situacionLegal', title: 'Situación Legal' },
              { accessor: 'nroResolucion', title: 'Nro. Resolución' },
              { accessor: 'lugar', title: 'Lugar' },
              {
                accessor: 'fecha',
                title: 'Fecha',
                render: (row: any) => row.fecha ? new Date(row.fecha).toLocaleDateString('es-BO') : '-'
              },
              { accessor: 'autoridad', title: 'Autoridad' },
              { accessor: 'fjt', title: 'Fiscalía, Juzgado o Tribunal' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
