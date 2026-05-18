'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { DataTable } from 'mantine-datatable'
import {
  BienesServiceInstance,
  CreateBienIncautadoPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface Props {
  idItemBien: string
}

export function BienIncautadoSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<CreateBienIncautadoPayload>({
      defaultValues: { numeroResolucion: '', fechaResolucion: '', autoridad: '' },
    })

  const cargarRegistros = async () => {
    try {
      setCargando(true)
      const res = await BienesServiceInstance.listarIncautado(idItemBien)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch {
      setRegistros([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { void cargarRegistros() }, [idItemBien])

  const onSubmit = async (payload: CreateBienIncautadoPayload) => {
    try {
      await BienesServiceInstance.registrarIncautado(idItemBien, payload)
      Alerta({ mensaje: 'Incautación registrada correctamente', variant: 'success' })
      reset()
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">BIENES INCAUTADOS</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Nro. de Resolución <span className="text-danger">*</span></label>
              <Input {...register('numeroResolucion', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Resolución <span className="text-danger">*</span></label>
              <Input type="date" {...register('fechaResolucion', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Autoridad que Emite la Resolución <span className="text-danger">*</span></label>
              <Input {...register('autoridad', { required: 'Campo requerido' })} size="sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" size="sm" loading={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </div>

      <div className="datatables">
        <DataTable
          noRecordsText="No hay registros de incautación"
          highlightOnHover
          fetching={cargando}
          className="whitespace-nowrap table-hover"
          records={registros}
          columns={[
            { accessor: 'numeroResolucion', title: 'Número de Resolución Judicial' },
            { accessor: 'fechaResolucion', title: 'Fecha de la Resolución Judicial' },
            { accessor: 'autoridad', title: 'Autoridad que Emite la Resolución' },
          ]}
        />
      </div>
    </div>
  )
}
