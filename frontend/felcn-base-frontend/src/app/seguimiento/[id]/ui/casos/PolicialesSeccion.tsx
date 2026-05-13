'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { SeguimientoServiceInstance, ServidorPolicialPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { DataTable } from 'mantine-datatable'

interface PolicialesSeccionProps {
  idOperativo: string | null
  onGuardar: () => void
}

export function PolicialesSeccion({ idOperativo, onGuardar }: PolicialesSeccionProps) {
  const { Alerta } = useAlerts()
  const [grados, setGrados] = useState<any[]>([])
  const [servidores, setServidores] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ServidorPolicialPayload>({
    defaultValues: {
      idGrado: 0,
      nombreApellidos: ''
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

  const cargarServidores = useCallback(async () => {
    if (!idOperativo) return
    try {
      setCargando(true)
      const res = await SeguimientoServiceInstance.listarServidores(idOperativo)
      if (res.finalizado) setServidores(res.datos)
    } catch (error) {
      console.error('Error al cargar servidores', error)
    } finally {
      setCargando(false)
    }
  }, [idOperativo])

  useEffect(() => {
    void cargarGradosLocales()
    void cargarServidores()
  }, [cargarGradosLocales, cargarServidores])

  const onSubmit = async (payload: ServidorPolicialPayload) => {
    if (!idOperativo) {
      Alerta({ mensaje: 'No se encontró el ID del operativo', variant: 'warning' })
      return
    }
    try {
      await SeguimientoServiceInstance.agregarServidor(idOperativo, payload)
      Alerta({ mensaje: 'Servidor policial agregado', variant: 'success' })
      reset()
      void cargarServidores()
      onGuardar()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">Agregar Servidor Policial</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium mb-1">Grado</label>
            <Select
              {...register('idGrado', { valueAsNumber: true, required: true })}
              options={grados.map(g => ({ value: String(g.id), label: g.descripcion }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Nombre y Apellidos</label>
            <Input {...register('nombreApellidos', { required: true })} size="sm" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
              Guardar Servidor
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-4">Servidores Policiales que Intervienen</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay servidores registrados"
            fetching={cargando}
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={servidores}
            columns={[
              {
                accessor: 'grado',
                title: 'Grado',
                render: ({ grado }) => grado?.descripcion || '-'
              },
              { accessor: 'nombreApellidos', title: 'Nombre y Apellidos' },
              {
                accessor: 'fechaHoraIngreso',
                title: 'Fecha Registro',
                render: ({ fechaHoraIngreso }) => fechaHoraIngreso ? new Date(fechaHoraIngreso).toLocaleString() : '-'
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}
