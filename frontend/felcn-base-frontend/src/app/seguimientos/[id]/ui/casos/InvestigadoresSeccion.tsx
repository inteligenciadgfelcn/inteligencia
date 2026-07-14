'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { SeguimientoServiceInstance } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { useEffect, useState, useCallback } from 'react'

interface InvestigadoresSeccionProps {
  idCaso: string
  datos: any[]
  onGuardar: () => void
}

export function InvestigadoresSeccion({ idCaso, datos, onGuardar }: InvestigadoresSeccionProps) {
  const { Alerta } = useAlerts()
  const [grados, setGrados] = useState<any[]>([])

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
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
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Asignación <span className="text-danger">*</span></label>
              <Input type="date" {...register('fecha', { required: 'Campo requerido' })} error={!!errors.fecha} />
              {errors.fecha && <div className="mt-1 text-xs text-danger">{(errors.fecha as any).message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grado <span className="text-danger">*</span></label>
              <Select
                {...register('idGrado', { valueAsNumber: true, required: 'Campo requerido' })}
                options={grados.map(g => ({ value: String(g.id), label: g.descripcion }))}
                error={!!errors.idGrado}
              />
              {errors.idGrado && <div className="mt-1 text-xs text-danger">{(errors.idGrado as any).message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre y Apellidos <span className="text-danger">*</span></label>
              <Input uppercase {...register('nombreApp', { required: 'Campo requerido' })} error={!!errors.nombreApp} />
              {errors.nombreApp && <div className="mt-1 text-xs text-danger">{(errors.nombreApp as any).message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono Celular</label>
              <Input uppercase {...register('telefonoCelular')} error={!!errors.telefonoCelular} />
              {errors.telefonoCelular && <div className="mt-1 text-xs text-danger">{(errors.telefonoCelular as any).message}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono Fijo Unidad</label>
              <Input uppercase {...register('telefonoFijo')} error={!!errors.telefonoFijo} />
              {errors.telefonoFijo && <div className="mt-1 text-xs text-danger">{(errors.telefonoFijo as any).message}</div>}
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
        <h4 className="mb-4 text-sm font-semibold">Historial de Investigadores Asignados</h4>
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
                accessor: 'grado',
                title: 'Grado',
                render: (row: any) => row.grado?.descripcion || '-'
              },
              { accessor: 'nombreApp', title: 'Nombre y Apellidos' },
              {
                accessor: 'fecha',
                title: 'Fecha Asignación',
                render: (row: any) => row.fecha ? new Date(row.fecha).toLocaleDateString() : '-'
              },
              { accessor: 'telefonoCelular', title: 'Celular' },
              { accessor: 'telefonoFijo', title: 'Telf. Fijo' },
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
