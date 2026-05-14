'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { DataTable } from 'mantine-datatable'
import {
  BienesServiceInstance,
  CreateBienConfiscadoPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface Props {
  idItemBien: string
}

export function BienConfiscadoSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<CreateBienConfiscadoPayload>({
      defaultValues: { numeroSentenciaJudicial: '', fechaSentenciaJudicial: '', autoridad: '' },
    })

  const cargarRegistros = async () => {
    try {
      setCargando(true)
      const res = await BienesServiceInstance.listarConfiscado(idItemBien)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch {
      setRegistros([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { void cargarRegistros() }, [idItemBien])

  const onSubmit = async (payload: CreateBienConfiscadoPayload) => {
    try {
      await BienesServiceInstance.registrarConfiscado(idItemBien, payload)
      Alerta({ mensaje: 'Confiscación registrada correctamente', variant: 'success' })
      reset()
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">BIENES CONFISCADOS</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Número de Sentencia Judicial</label>
              <Input {...register('numeroSentenciaJudicial', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Fecha de la Sentencia Judicial</label>
              <Input type="date" {...register('fechaSentenciaJudicial', { required: true })} size="sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">
                Nombres, Apellidos y Cargo de la Autoridad que Emite la Sentencia
              </label>
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
          noRecordsText="No hay registros de confiscación"
          highlightOnHover
          fetching={cargando}
          className="whitespace-nowrap table-hover"
          records={registros}
          columns={[
            { accessor: 'numeroSentenciaJudicial', title: 'Número de Sentencia Judicial' },
            { accessor: 'fechaSentenciaJudicial', title: 'Fecha de la Sentencia Judicial' },
            { accessor: 'autoridad', title: 'Autoridad que Emite la Sentencia' },
          ]}
        />
      </div>
    </div>
  )
}
