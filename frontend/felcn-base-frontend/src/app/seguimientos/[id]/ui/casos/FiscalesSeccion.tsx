'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { SeguimientoServiceInstance, FiscalPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { trimPayload } from '@/utils/trimPayload'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'

interface FiscalesSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function FiscalesSeccion({ idCaso, datos, onGuardar }: FiscalesSeccionProps) {
  const { Alerta } = useAlerts()
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<FiscalPayload>({
    defaultValues: {
      nombreApellidos: '',
      telefonoCelular: '',
      telefonoFijo: '',
      fecha: new Date().toISOString().split('T')[0]
    }
  })

  const onSubmit = async (datos: FiscalPayload) => {
    const payload = trimPayload(datos)
    try {
      await SeguimientoServiceInstance.agregarFiscal(idCaso, payload)
      Alerta({ mensaje: 'Fiscal agregado correctamente', variant: 'success' })
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
              <label className="block text-sm font-medium mb-1">Fecha Asignación <span className="text-danger">*</span></label>
              <Input type="date" {...register('fecha', { required: 'Campo requerido' })} error={!!errors.fecha} />
              {errors.fecha && <div className="mt-1 text-xs text-danger">{errors.fecha.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre y Apellidos <span className="text-danger">*</span></label>
              <Input uppercase {...register('nombreApellidos', { required: 'Campo requerido' })} error={!!errors.nombreApellidos} />
              {errors.nombreApellidos && <div className="mt-1 text-xs text-danger">{errors.nombreApellidos.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Celular</label>
              <Input uppercase {...register('telefonoCelular')} error={!!errors.telefonoCelular} />
              {errors.telefonoCelular && <div className="mt-1 text-xs text-danger">{errors.telefonoCelular.message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <Input uppercase {...register('telefonoFijo')} error={!!errors.telefonoFijo} />
              {errors.telefonoFijo && <div className="mt-1 text-xs text-danger">{errors.telefonoFijo.message}</div>}
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
        <h4 className="mb-4 text-sm font-semibold">Historial de Fiscales</h4>
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
              { accessor: 'nombreApellidos', title: 'Nombre y Apellidos' },
              {
                accessor: 'fecha',
                title: 'Fecha Asignación',
                render: (row: any) => row.fecha ? new Date(row.fecha).toLocaleDateString() : '-'
              },
              { accessor: 'telefonoCelular', title: 'Celular' },
              { accessor: 'telefonoFijo', title: 'Tel. Fijo' },
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
