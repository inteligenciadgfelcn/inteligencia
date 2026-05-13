'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { DataTable } from 'mantine-datatable'
import { PersonasServiceInstance, CreateEtapaProcesoPayload } from '@/services/seguimiento/SeguimientoPersonasService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface Props {
  idDetenido: string
}

export function EtapaProcesoSeccion({ idDetenido }: Props) {
  const { Alerta } = useAlerts()
  const [etapas, setEtapas] = useState<{ value: number; label: string }[]>([])
  const [estados, setEstados] = useState<{ value: number; label: string }[]>([])
  const [registros, setRegistros] = useState<any[]>([])
  const [idEtapaSeleccionada, setIdEtapaSeleccionada] = useState<number>(0)

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<CreateEtapaProcesoPayload>({
    defaultValues: { idEstado: 0, nroResolucion: '', lugar: '', fecha: '', autoridad: '', fjt: '' }
  })

  useEffect(() => {
    const cargarEtapas = async () => {
      try {
        const res = await PersonasServiceInstance.listarEtapas()
        const datos = Array.isArray(res) ? res : res?.datos ?? []
        setEtapas(datos.map((d: any) => ({ value: d.id, label: d.descripcion })))
      } catch { /* silencioso */ }
    }
    void cargarEtapas()
  }, [])

  const cargarRegistros = async () => {
    try {
      const res = await PersonasServiceInstance.listarEtapasProceso(idDetenido)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch { setRegistros([]) }
  }

  useEffect(() => { void cargarRegistros() }, [idDetenido])

  const handleEtapaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value)
    setIdEtapaSeleccionada(id)
    setValue('idEstado', 0)
    if (!id) { setEstados([]); return }
    try {
      const res = await PersonasServiceInstance.listarEstadosPorEtapa(id)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setEstados(datos.map((d: any) => ({ value: d.id, label: d.descripcion })))
    } catch { setEstados([]) }
  }

  const onSubmit = async (payload: CreateEtapaProcesoPayload) => {
    try {
      await PersonasServiceInstance.registrarEtapaProceso(idDetenido, {
        ...payload,
        idEstado: Number(payload.idEstado),
      })
      Alerta({ mensaje: 'Etapa del proceso registrada correctamente', variant: 'success' })
      reset()
      setIdEtapaSeleccionada(0)
      setEstados([])
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">Registrar Etapa del Proceso</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Etapa del Proceso</label>
              <select
                className="form-select form-select-sm"
                value={idEtapaSeleccionada}
                onChange={handleEtapaChange}
              >
                <option value={0}>Seleccione una etapa...</option>
                {etapas.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Estado del Proceso</label>
              <Select
                size="sm"
                placeholder="Seleccione un estado..."
                options={estados}
                disabled={estados.length === 0}
                {...register('idEstado', { required: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Nro. de Resolución</label>
              <Input {...register('nroResolucion', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Departamento, Provincia, Lugar</label>
              <Input {...register('lugar', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Fecha de la Resolución</label>
              <Input type="date" {...register('fecha', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Autoridad que emite la Resolución</label>
              <Input {...register('autoridad', { required: true })} size="sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1">Fiscalía, Juzgado o Tribunal</label>
              <Input {...register('fjt', { required: true })} size="sm" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="success" size="sm" loading={isSubmitting}>
              GUARDAR ETAPA DEL PROCESO
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-4">Historial de Etapas del Proceso</h3>
        <div className="datatables">
          <DataTable
            noRecordsText="No hay etapas registradas"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={registros}
            columns={[
              { accessor: 'etapa', title: 'Etapa del Proceso' },
              { accessor: 'estado', title: 'Estado del Proceso' },
              { accessor: 'nroResolucion', title: 'Nro. Resolución' },
              { accessor: 'lugar', title: 'Lugar' },
              {
                accessor: 'fecha',
                title: 'Fecha',
                render: ({ fecha }) => fecha ? new Date(fecha).toLocaleDateString('es-BO') : '-'
              },
              { accessor: 'autoridad', title: 'Autoridad' },
              { accessor: 'fjt', title: 'Fiscalía, Juzgado o Tribunal' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
