'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { DataTable } from 'mantine-datatable'
import {
  BienesServiceInstance,
  CreatePerdidaDominioPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface Props {
  idItemBien: string
}

export function PerdidaDominioSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<CreatePerdidaDominioPayload>({
      defaultValues: { fiscalia: '', fechaResolucion: '', autoridad: '' },
    })

  const cargarRegistros = async () => {
    try {
      setCargando(true)
      const res = await BienesServiceInstance.listarPerdidaDominio(idItemBien)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch {
      setRegistros([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { void cargarRegistros() }, [idItemBien])

  const onSubmit = async (payload: CreatePerdidaDominioPayload) => {
    try {
      await BienesServiceInstance.registrarPerdidaDominio(idItemBien, payload)
      Alerta({ mensaje: 'Pérdida de dominio registrada correctamente', variant: 'success' })
      reset()
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">PÉRDIDA DE DOMINIO</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">
                Fiscalía que Emitió la Pérdida de Dominio
              </label>
              <Input {...register('fiscalia', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Fecha</label>
              <Input type="date" {...register('fechaResolucion', { required: true })} size="sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">A Requerimiento del Fiscal</label>
              <Input {...register('autoridad', { required: true })} size="sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" size="sm" loading={isSubmitting}>
              Guardar Información
            </Button>
          </div>
        </form>
      </div>

      <div className="datatables">
        <DataTable
          noRecordsText="No hay registros de pérdida de dominio"
          highlightOnHover
          fetching={cargando}
          className="whitespace-nowrap table-hover"
          records={registros}
          columns={[
            { accessor: 'fiscalia', title: 'Fiscalía que Emitió la Pérdida de Dominio' },
            { accessor: 'fechaResolucion', title: 'Fecha' },
            { accessor: 'autoridad', title: 'A Requerimiento del Fiscal' },
          ]}
        />
      </div>
    </div>
  )
}
