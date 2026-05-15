'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { SeguimientoServiceInstance, JurisdiccionPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { DataTable } from 'mantine-datatable'

interface JurisdiccionSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function JurisdiccionSeccion({ idCaso, datos, onGuardar }: JurisdiccionSeccionProps) {
  const { Alerta } = useAlerts()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<JurisdiccionPayload>({
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
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">Registrar Nueva Jurisdicción</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha del Operativo <span className="text-danger">*</span></label>
              <Input type="date" {...register('fecha', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jurisdicción <span className="text-danger">*</span></label>
              <Input {...register('jurisdiccion', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Observación</label>
              <Input {...register('observacion')} size="sm" />
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
        <h3 className="text-md font-semibold mb-4">Historial de Jurisdicciones</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay jurisdicciones registradas"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={datos || []}
            columns={[
              { accessor: 'jurisdiccion', title: 'Jurisdicción' },
              {
                accessor: 'fecha',
                title: 'Fecha',
                render: ({ fecha }) => fecha ? new Date(fecha).toLocaleDateString() : '-'
              },
              { accessor: 'observacion', title: 'Observación' },
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
