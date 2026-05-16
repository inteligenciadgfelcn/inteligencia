'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { SeguimientoServiceInstance } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { DataTable } from 'mantine-datatable'
import { useEffect, useState, useCallback } from 'react'

interface InvestigadoresSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function InvestigadoresSeccion({ idCaso, datos, onGuardar }: InvestigadoresSeccionProps) {
  const { Alerta } = useAlerts()
  const [grados, setGrados] = useState<any[]>([])

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      idGrado: 0,
      nombreApp: '',
      telefonoCelular: '',
      telefonoFijo: '',
      fecha: new Date().toISOString().split('T')[0]
    }
  })

  const cargarGradosLocales = useCallback(async () => {
    try {
      const res = await SeguimientoServiceInstance.cargarGrados()
      if (res.finalizado) {
        setGrados(res.datos)
      }
    } catch (error) {
      console.error('Error al cargar grados', error)
    }
  }, [])

  useEffect(() => {
    void cargarGradosLocales()
  }, [cargarGradosLocales])

  const onSubmit = async (payload: any) => {
    try {
      await SeguimientoServiceInstance.agregarInvestigador(idCaso, payload)
      Alerta({ mensaje: 'Investigador asignado correctamente', variant: 'success' })
      reset()
      onGuardar()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary font-bold uppercase">Investigador(es) Asignado(s) al Caso</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Asignación <span className="text-danger">*</span></label>
              <Input type="date" {...register('fecha', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grado <span className="text-danger">*</span></label>
              <Select
                {...register('idGrado', { valueAsNumber: true, required: 'Campo requerido' })}
                options={grados.map(g => ({ value: String(g.id), label: g.descripcion }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre y Apellidos <span className="text-danger">*</span></label>
              <Input {...register('nombreApp', { required: 'Campo requerido' })} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono Celular</label>
              <Input {...register('telefonoCelular')} size="sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono Fijo Unidad</label>
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
        <h3 className="text-md font-semibold mb-4 text-secondary uppercase">Historial de Investigadores Asignados</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay investigadores registrados"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={datos || []}
            columns={[
              {
                accessor: 'grado',
                title: 'Grado',
                render: ({ grado }) => grado?.descripcion || '-'
              },
              { accessor: 'nombreApp', title: 'Nombre y Apellidos' },
              {
                accessor: 'fecha',
                title: 'Fecha Asignación',
                render: ({ fecha }) => fecha ? new Date(fecha).toLocaleDateString() : '-'
              },
              { accessor: 'telefonoCelular', title: 'Celular' },
              { accessor: 'telefonoFijo', title: 'Telf. Fijo' },
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
