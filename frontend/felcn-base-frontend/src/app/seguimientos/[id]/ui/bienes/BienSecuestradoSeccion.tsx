'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import {
  BienesServiceInstance,
  CreateBienSecuestradoPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import dayjs from 'dayjs'

interface Props {
  idItemBien: string
}

export function BienSecuestradoSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } =
    useForm<CreateBienSecuestradoPayload>({
      defaultValues: { fiscal: '', fechaActoSecuestro: dayjs().format('YYYY-MM-DD'), investigador: '' },
    })

  const cargarRegistros = async () => {
    try {
      setCargando(true)
      const res = await BienesServiceInstance.listarSecuestrado(idItemBien)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch {
      setRegistros([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { void cargarRegistros() }, [idItemBien])

  const onSubmit = async (payload: CreateBienSecuestradoPayload) => {
    try {
      await BienesServiceInstance.registrarSecuestrado(idItemBien, payload)
      Alerta({ mensaje: 'Secuestro registrado correctamente', variant: 'success' })
      reset()
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <h4 className="mb-4 text-sm font-semibold">BIENES SECUESTRADOS</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fiscal <span className="text-danger">*</span></label>
              <Input uppercase {...register('fiscal', { required: 'Campo requerido' })} error={!!errors.fiscal} />
              {errors.fiscal && <div className="mt-1 text-xs text-danger">{errors.fiscal.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha del Acta <span className="text-danger">*</span></label>
              <Input type="date" {...register('fechaActoSecuestro', { required: 'Campo requerido' })} error={!!errors.fechaActoSecuestro} />
              {errors.fechaActoSecuestro && <div className="mt-1 text-xs text-danger">{errors.fechaActoSecuestro.message}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Investigador que Secuestró el Bien <span className="text-danger">*</span></label>
              <Input uppercase {...register('investigador', { required: 'Campo requerido' })} error={!!errors.investigador} />
              {errors.investigador && <div className="mt-1 text-xs text-danger">{errors.investigador.message}</div>}
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
            { accessor: 'fiscal', title: 'Fiscal' },
            { accessor: 'fechaActoSecuestro', title: 'Fecha del Acta de Secuestro' },
            { accessor: 'investigador', title: 'Investigador que Secuestró el Bien' },
          ]}
        />
      </div>
    </div>
  )
}
