'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { DataTable } from 'mantine-datatable'
import {
  BienesServiceInstance,
  CreateSituacionBienPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import dayjs from 'dayjs'

interface Props {
  idItemBien: string
}

export function SituacionBienSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const { calidadesBien, cargarCalidadesBien } = useParametricas()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<CreateSituacionBienPayload>({
      defaultValues: {
        fechaRequerimiento: dayjs().format('YYYY-MM-DD'),
        fiscalRequerimiento: '',
        idCalidadBien: 0,
        fechaEntrega: dayjs().format('YYYY-MM-DD'),
        responsableEntrega: '',
        responsableRecepcion: '',
        institucion: '',
        ubicacion: '',
      },
    })

  useEffect(() => { void cargarCalidadesBien() }, [cargarCalidadesBien])

  const cargarRegistros = async () => {
    try {
      setCargando(true)
      const res = await BienesServiceInstance.listarSituacion(idItemBien)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch {
      setRegistros([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { void cargarRegistros() }, [idItemBien])

  const onSubmit = async (payload: CreateSituacionBienPayload) => {
    try {
      await BienesServiceInstance.registrarSituacion(idItemBien, {
        ...payload,
        idCalidadBien: Number(payload.idCalidadBien),
      })
      Alerta({ mensaje: 'Entrega del bien registrada correctamente', variant: 'success' })
      reset()
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">ENTREGA O DEVOLUCIÓN DEL BIEN</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha del Requerimiento <span className="text-danger">*</span>
              </label>
              <Input type="date" {...register('fechaRequerimiento', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fiscal del Requerimiento <span className="text-danger">*</span>
              </label>
              <Input {...register('fiscalRequerimiento', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Condición Legal <span className="text-danger">*</span>
              </label>
              <Select
                size="sm"
                placeholder="Seleccione..."
                options={calidadesBien.map((c) => ({ value: String(c.id), label: c.descripcion }))}
                {...register('idCalidadBien', { required: 'Campo requerido' })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Entrega <span className="text-danger">*</span></label>
              <Input type="date" {...register('fechaEntrega', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Responsable de la Entrega <span className="text-danger">*</span>
              </label>
              <Input {...register('responsableEntrega', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Responsable de la Recepción <span className="text-danger">*</span>
              </label>
              <Input {...register('responsableRecepcion', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Institución Responsable <span className="text-danger">*</span>
              </label>
              <Input {...register('institucion', { required: 'Campo requerido' })} size="sm" />
              <p className="text-[10px] text-gray-400 mt-1">
                Ej. DIRCABI, Min. Defensa...
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ubicación Física del Bien <span className="text-danger">*</span>
              </label>
              <Input {...register('ubicacion', { required: 'Campo requerido' })} size="sm" />
              <p className="text-[10px] text-gray-400 mt-1">
                Dep, Prov, Loc...
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="warning" size="sm" loading={isSubmitting}>
              GUARDAR
            </Button>
          </div>
        </form>
      </div>

      <div className="datatables">
        <DataTable
          noRecordsText="No hay registros de entrega o devolución"
          highlightOnHover
          fetching={cargando}
          className="whitespace-nowrap table-hover"
          records={registros}
          columns={[
            { accessor: 'fechaRequerimiento', title: 'Fecha Req. Fiscal o Dev. del Bien' },
            { accessor: 'fiscalRequerimiento', title: 'Fiscal' },
            {
              accessor: 'calidadBien',
              title: 'Condición Legal',
              render: (row) => row.calidadBien?.descripcion ?? '-',
            },
            { accessor: 'fechaEntrega', title: 'Fecha de la Entrega del Bien' },
            { accessor: 'responsableEntrega', title: 'Responsable de la Entrega' },
            { accessor: 'responsableRecepcion', title: 'Responsable de la Recepción' },
            { accessor: 'institucion', title: 'Institución Responsable del Bien' },
            { accessor: 'ubicacion', title: 'Ubicación Física del Bien' },
          ]}
        />
      </div>
    </div>
  )
}
