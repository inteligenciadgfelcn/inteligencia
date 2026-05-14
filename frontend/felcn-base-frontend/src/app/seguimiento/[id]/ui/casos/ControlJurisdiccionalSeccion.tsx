'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { SeguimientoServiceInstance, ControlJurisdiccionalPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { DataTable } from 'mantine-datatable'

interface ControlJurisdiccionalSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function ControlJurisdiccionalSeccion({ idCaso, datos, onGuardar }: ControlJurisdiccionalSeccionProps) {
  const { Alerta } = useAlerts()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ControlJurisdiccionalPayload>({
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

  const onSubmit = async (payload: ControlJurisdiccionalPayload) => {
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
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">Registrar Nuevo Control Jurisdiccional</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4">
              <div className="md:w-1/4">
                <label className="block text-xs font-medium mb-1">Fecha Inicio Investigación</label>
                <Input type="date" {...register('fecha', { required: true })} size="sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Juzgado de Instrucción en lo Penal y/o Cautelar</label>
              <Input {...register('juzgadoInstruccion')} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Juzgado Mixto</label>
              <Input {...register('juzgadoPartido')} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Juzgado de Ejecución Penal</label>
              <Input {...register('juzgadoEjecucion')} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tribunal de Sentencia en lo Penal</label>
              <Input {...register('tribunalSentencia')} size="sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
              Guardar Control Jurisdiccional
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-4">Historial de Control Jurisdiccional</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay registros de control"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={datos || []}
            columns={[
              {
                accessor: 'fecha',
                title: 'Fecha Inicio',
                render: ({ fecha }) => fecha ? new Date(fecha).toLocaleDateString() : '-'
              },
              { accessor: 'juzgadoInstruccion', title: 'J. Instrucción' },
              { accessor: 'juzgadoPartido', title: 'J. Partido' },
              { accessor: 'tribunalSentencia', title: 'Tribunal Sentencia' },
              { accessor: 'juzgadoEjecucion', title: 'J. Ejecución' },
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
