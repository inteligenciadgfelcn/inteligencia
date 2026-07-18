'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import {
  BienesServiceInstance,
  CreateBienIncautadoPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { trimPayload } from '@/utils/trimPayload'
import dayjs from 'dayjs'

interface Props {
  idItemBien: string
}

export function BienIncautadoSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } =
    useForm<CreateBienIncautadoPayload>({
      defaultValues: { numeroResolucion: '', fechaResolucion: dayjs().format('YYYY-MM-DD'), autoridad: '' },
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

  const onSubmit = async (datos: CreateBienIncautadoPayload) => {
    const payload = trimPayload(datos)
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
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <h4 className="mb-4 text-sm font-semibold">BIENES INCAUTADOS</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Nro. de Resolución <span className="text-danger">*</span></label>
              <Input uppercase {...register('numeroResolucion', { required: 'Campo requerido' })} error={!!errors.numeroResolucion} />
              {errors.numeroResolucion && <div className="mt-1 text-xs text-danger">{errors.numeroResolucion.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Resolución <span className="text-danger">*</span></label>
              <Input type="date" {...register('fechaResolucion', { required: 'Campo requerido' })} error={!!errors.fechaResolucion} />
              {errors.fechaResolucion && <div className="mt-1 text-xs text-danger">{errors.fechaResolucion.message}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Autoridad que Emite la Resolución <span className="text-danger">*</span></label>
              <Input uppercase {...register('autoridad', { required: 'Campo requerido' })} error={!!errors.autoridad} />
              {errors.autoridad && <div className="mt-1 text-xs text-danger">{errors.autoridad.message}</div>}
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
        <VristoDataTable
          loading={cargando}
          rows={registros}
          total={registros.length}
          page={1}
          limit={registros.length || 10}
          onPageChange={() => {}}
          onLimitChange={() => {}}
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
