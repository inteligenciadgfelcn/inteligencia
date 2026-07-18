'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import {
  BienesServiceInstance,
  CreateSituacionBienPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { trimPayload } from '@/utils/trimPayload'
import dayjs from 'dayjs'

interface Props {
  idItemBien: string
}

export function SituacionBienSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const { calidadesBien, cargarCalidadesBien } = useParametricas()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } =
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

  const onSubmit = async (datos: CreateSituacionBienPayload) => {
    const payload = trimPayload(datos)
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
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <h4 className="mb-4 text-sm font-semibold">ENTREGA O DEVOLUCIÓN DEL BIEN</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha del Requerimiento <span className="text-danger">*</span>
              </label>
              <Input type="date" {...register('fechaRequerimiento', { required: 'Campo requerido' })} error={!!errors.fechaRequerimiento} />
              {errors.fechaRequerimiento && <div className="mt-1 text-xs text-danger">{errors.fechaRequerimiento.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fiscal del Requerimiento <span className="text-danger">*</span>
              </label>
              <Input uppercase {...register('fiscalRequerimiento', { required: 'Campo requerido' })} error={!!errors.fiscalRequerimiento} />
              {errors.fiscalRequerimiento && <div className="mt-1 text-xs text-danger">{errors.fiscalRequerimiento.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Condición Legal <span className="text-danger">*</span>
              </label>
              <Select
                placeholder="Seleccione..."
                options={calidadesBien.map((c) => ({ value: String(c.id), label: c.descripcion }))}
                {...register('idCalidadBien', { required: 'Campo requerido' })}
                error={!!errors.idCalidadBien}
              />
              {errors.idCalidadBien && <div className="mt-1 text-xs text-danger">{errors.idCalidadBien.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Entrega <span className="text-danger">*</span></label>
              <Input type="date" {...register('fechaEntrega', { required: 'Campo requerido' })} error={!!errors.fechaEntrega} />
              {errors.fechaEntrega && <div className="mt-1 text-xs text-danger">{errors.fechaEntrega.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Responsable de la Entrega <span className="text-danger">*</span>
              </label>
              <Input uppercase {...register('responsableEntrega', { required: 'Campo requerido' })} error={!!errors.responsableEntrega} />
              {errors.responsableEntrega && <div className="mt-1 text-xs text-danger">{errors.responsableEntrega.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Responsable de la Recepción <span className="text-danger">*</span>
              </label>
              <Input uppercase {...register('responsableRecepcion', { required: 'Campo requerido' })} error={!!errors.responsableRecepcion} />
              {errors.responsableRecepcion && <div className="mt-1 text-xs text-danger">{errors.responsableRecepcion.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Institución Responsable <span className="text-danger">*</span>
              </label>
              <Input uppercase {...register('institucion', { required: 'Campo requerido' })} error={!!errors.institucion} />
              {errors.institucion && <div className="mt-1 text-xs text-danger">{errors.institucion.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ubicación Física del Bien <span className="text-danger">*</span>
              </label>
              <Input uppercase {...register('ubicacion', { required: 'Campo requerido' })} error={!!errors.ubicacion} />
              {errors.ubicacion && <div className="mt-1 text-xs text-danger">{errors.ubicacion.message}</div>}
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
        <VristoDataTable
          loading={cargando}
          rows={registros}
          total={registros.length}
          page={1}
          limit={registros.length || 10}
          onPageChange={() => { }}
          onLimitChange={() => { }}
          columns={[
            { accessor: 'fechaRequerimiento', title: 'Fecha Req. Fiscal o Dev. del Bien' },
            { accessor: 'fiscalRequerimiento', title: 'Fiscal' },
            {
              accessor: 'calidadBien',
              title: 'Condición Legal',
              render: (row: any) => row.calidadBien?.descripcion ?? '-',
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
