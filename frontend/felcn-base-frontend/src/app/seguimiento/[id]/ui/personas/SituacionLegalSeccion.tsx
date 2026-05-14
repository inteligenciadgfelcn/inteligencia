'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { DataTable } from 'mantine-datatable'
import { PersonasServiceInstance, CreateSituacionPayload } from '@/services/seguimiento/SeguimientoPersonasService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface Props {
  idDetenido: string
}

export function SituacionLegalSeccion({ idDetenido }: Props) {
  const { Alerta } = useAlerts()
  const [situacionesLegales, setSituacionesLegales] = useState<{ value: number; label: string }[]>([])
  const [registros, setRegistros] = useState<any[]>([])

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateSituacionPayload>({
    defaultValues: { idSituacionLegal: 0, nroResolucion: '', lugar: '', fecha: '', autoridad: '', fjt: '' }
  })

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
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">Registrar Situación Legal</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Fecha de la Resolución</label>
              <Input type="date" {...register('fecha', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Situación Legal</label>
              <Select
                size="sm"
                placeholder="Seleccione..."
                options={situacionesLegales}
                {...register('idSituacionLegal', { required: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Nro. Resolución del Acta de Medida Cautelar</label>
              <Input {...register('nroResolucion', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Departamento, Provincia, Lugar</label>
              <Input {...register('lugar', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Autoridad (Nombre del Juez)</label>
              <Input {...register('autoridad', { required: true })} size="sm" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium mb-1">Juzgado o Tribunal</label>
              <Input {...register('fjt', { required: true })} size="sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" size="sm" loading={isSubmitting}>
              GUARDAR SITUACIÓN LEGAL
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-4">Historial de Situaciones Legales</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay situaciones registradas"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={registros}
            columns={[
              { accessor: 'situacionLegal', title: 'Situación Legal' },
              { accessor: 'nroResolucion', title: 'Nro. Resolución' },
              { accessor: 'lugar', title: 'Lugar' },
              {
                accessor: 'fecha',
                title: 'Fecha',
                render: ({ fecha }) => fecha ? new Date(fecha).toLocaleDateString('es-BO') : '-'
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
