'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { SeguimientoServiceInstance, FiscalPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { DataTable } from 'mantine-datatable'

interface FiscalesSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function FiscalesSeccion({ idCaso, datos, onGuardar }: FiscalesSeccionProps) {
  const { Alerta } = useAlerts()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FiscalPayload>({
    defaultValues: {
      nombreApellidos: '',
      telefonoCelular: '',
      telefonoFijo: '',
      fecha: new Date().toISOString().split('T')[0]
    }
  })

  const onSubmit = async (payload: FiscalPayload) => {
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
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">Registrar Nuevo Fiscal</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Asignación <span className="text-danger">*</span></label>
              <Input type="date" {...register('fecha', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre y Apellidos <span className="text-danger">*</span></label>
              <Input {...register('nombreApellidos', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Celular</label>
              <Input {...register('telefonoCelular')} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <Input {...register('telefonoFijo')} size="sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-4">Historial de Fiscales</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay fiscales registrados"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={datos || []}
            columns={[
              { accessor: 'nombreApellidos', title: 'Nombre y Apellidos' },
              {
                accessor: 'fecha',
                title: 'Fecha Asignación',
                render: ({ fecha }) => fecha ? new Date(fecha).toLocaleDateString() : '-'
              },
              { accessor: 'telefonoCelular', title: 'Celular' },
              { accessor: 'telefonoFijo', title: 'Tel. Fijo' },
              {
                accessor: 'esActual',
                title: 'Estado',
                render: ({ esActual }) => (
                  <span className={`badge ${esActual ? 'badge-outline-success' : 'badge-outline-dark'}`}>
                    {esActual ? 'Actual' : 'Histórico'}
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
