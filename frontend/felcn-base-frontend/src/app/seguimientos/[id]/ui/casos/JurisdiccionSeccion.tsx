'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { SeguimientoServiceInstance, JurisdiccionPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'

interface JurisdiccionSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function JurisdiccionSeccion({ idCaso, datos, onGuardar }: JurisdiccionSeccionProps) {
  const { Alerta } = useAlerts()
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<JurisdiccionPayload>({
    defaultValues: {
      jurisdiccion: '',
      observacion: '',
      fecha: new Date().toISOString().split('T')[0]
    }
  })

  const onSubmit = async (payload: JurisdiccionPayload) => {
    try {
      await SeguimientoServiceInstance.agregarJurisdiccion(idCaso, payload)
      Alerta({ mensaje: 'Jurisdicción registrada correctamente', variant: 'success' })
      reset()
      onGuardar()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha del Operativo <span className="text-danger">*</span></label>
              <Input type="date" {...register('fecha', { required: 'Campo requerido' })} error={!!errors.fecha} />
              {errors.fecha && <div className="mt-1 text-xs text-danger">{errors.fecha.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jurisdicción <span className="text-danger">*</span></label>
              <Input uppercase {...register('jurisdiccion', { required: 'Campo requerido' })} error={!!errors.jurisdiccion} />
              {errors.jurisdiccion && <div className="mt-1 text-xs text-danger">{errors.jurisdiccion.message}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Observación</label>
              <Input uppercase {...register('observacion')} error={!!errors.observacion} />
              {errors.observacion && <div className="mt-1 text-xs text-danger">{errors.observacion.message}</div>}
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
        <h4 className="mb-4 text-sm font-semibold">Historial de Jurisdicciones</h4>
        <div className="datatables">
          <VristoDataTable
            loading={false}
            rows={datos || []}
            total={(datos || []).length}
            page={1}
            limit={(datos || []).length || 10}
            onPageChange={() => { }}
            onLimitChange={() => { }}
            columns={[
              { accessor: 'jurisdiccion', title: 'Jurisdicción' },
              {
                accessor: 'fecha',
                title: 'Fecha',
                render: (row: any) => row.fecha ? new Date(row.fecha).toLocaleDateString() : '-'
              },
              { accessor: 'observacion', title: 'Observación' },
              {
                accessor: 'esActual',
                title: 'Estado',
                render: (row: any) => (
                  <span className={`badge ${row.esActual ? 'badge-outline-success' : 'badge-outline-dark'}`}>
                    {row.esActual ? 'Actual' : 'Histórico'}
                  </span>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}
