'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { SeguimientoServiceInstance, ControlJurisdiccionalPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { trimPayload } from '@/utils/trimPayload'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'

interface ControlJurisdiccionalSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function ControlJurisdiccionalSeccion({ idCaso, datos, onGuardar }: ControlJurisdiccionalSeccionProps) {
  const { Alerta } = useAlerts()
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ControlJurisdiccionalPayload>({
    defaultValues: {
      juzgadoInstruccion: '',
      juzgadoPartido: '',
      tribunalSentencia: '',
      juzgadoEjecucion: '',
      fecha: new Date().toISOString().split('T')[0]
    }
  })

  // Wait, I should check the backend DTO for correct field names
  // In G:\FELCN\Source2\inteligencia\backend\felcn-base-backend-v2\src\application\sunesis\siii\seguimiento\dto\seguimiento.dto.ts
  // Let me check it.

  const onSubmit = async (datos: ControlJurisdiccionalPayload) => {
    const payload = trimPayload(datos)
    try {
      await SeguimientoServiceInstance.agregarControlJurisdiccional(idCaso, payload)
      Alerta({ mensaje: 'Control Jurisdiccional registrado correctamente', variant: 'success' })
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de Inicio <span className="text-danger">*</span></label>
              <Input type="date" {...register('fecha', { required: 'Campo requerido' })} error={!!errors.fecha} />
              {errors.fecha && <div className="mt-1 text-xs text-danger">{errors.fecha.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Juzgado <span className="text-danger">*</span></label>
              <Input uppercase {...register('juzgadoInstruccion', { required: 'Campo requerido' })} error={!!errors.juzgadoInstruccion} />
              {errors.juzgadoInstruccion && <div className="mt-1 text-xs text-danger">{errors.juzgadoInstruccion.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Juzgado Mixto</label>
              <Input uppercase {...register('juzgadoPartido')} error={!!errors.juzgadoPartido} />
              {errors.juzgadoPartido && <div className="mt-1 text-xs text-danger">{errors.juzgadoPartido.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Juzgado de Ejecución Penal</label>
              <Input uppercase {...register('juzgadoEjecucion')} error={!!errors.juzgadoEjecucion} />
              {errors.juzgadoEjecucion && <div className="mt-1 text-xs text-danger">{errors.juzgadoEjecucion.message}</div>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tribunal de Sentencia en lo Penal</label>
              <Input uppercase {...register('tribunalSentencia')} error={!!errors.tribunalSentencia} />
              {errors.tribunalSentencia && <div className="mt-1 text-xs text-danger">{errors.tribunalSentencia.message}</div>}
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
        <h4 className="mb-4 text-sm font-semibold">Historial de Control Jurisdiccional</h4>
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
              {
                accessor: 'fecha',
                title: 'Fecha Inicio',
                render: (row: any) => row.fecha ? new Date(row.fecha).toLocaleDateString() : '-'
              },
              { accessor: 'juzgadoInstruccion', title: 'J. Instrucción' },
              { accessor: 'juzgadoPartido', title: 'J. Partido' },
              { accessor: 'tribunalSentencia', title: 'Tribunal Sentencia' },
              { accessor: 'juzgadoEjecucion', title: 'J. Ejecución' },
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
