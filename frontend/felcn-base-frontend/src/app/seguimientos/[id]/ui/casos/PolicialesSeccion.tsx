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
import { VristoDataTable } from '@/components/datatable/VristoDataTable'

interface PolicialesSeccionProps {
  idOperativo: string | null
  onGuardar: () => void
}

export function PolicialesSeccion({ idOperativo, onGuardar }: PolicialesSeccionProps) {
  const { Alerta } = useAlerts()
  const [grados, setGrados] = useState<any[]>([])
  const [servidores, setServidores] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ServidorPolicialPayload>({
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
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Grado <span className="text-danger">*</span></label>
            <Select
              {...register('idGrado', { valueAsNumber: true, required: 'Campo requerido' })}
              options={grados.map(g => ({ value: String(g.id), label: g.descripcion }))}
              error={!!errors.idGrado}
            />
            {errors.idGrado && <div className="mt-1 text-xs text-danger">{errors.idGrado.message}</div>}
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium mb-1">Nombre y Apellidos <span className="text-danger">*</span></label>
            <Input uppercase {...register('nombreApellidos', { required: 'Campo requerido' })} error={!!errors.nombreApellidos} />
            {errors.nombreApellidos && <div className="mt-1 text-xs text-danger">{errors.nombreApellidos.message}</div>}
          </div>
          <div className="flex justify-end lg:col-span-1">
            <Button type="submit" variant="success" size="sm" loading={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-semibold">Servidores Policiales que Intervienen</h4>
        <div className="datatables">
          <VristoDataTable
            loading={cargando}
            rows={servidores}
            total={servidores.length}
            page={1}
            limit={servidores.length || 10}
            onPageChange={() => { }}
            onLimitChange={() => { }}
            columns={[
              {
                accessor: 'grado',
                title: 'Grado',
                render: (row: any) => row.grado?.descripcion || '-'
              },
              { accessor: 'nombreApellidos', title: 'Nombre y Apellidos' },
              {
                accessor: 'fechaHoraIngreso',
                title: 'Fecha Registro',
                render: (row: any) => row.fechaHoraIngreso ? new Date(row.fechaHoraIngreso).toLocaleString() : '-'
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}
