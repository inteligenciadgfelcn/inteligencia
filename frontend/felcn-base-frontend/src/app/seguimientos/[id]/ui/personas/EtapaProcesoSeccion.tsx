'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import { PersonasServiceInstance, CreateEtapaProcesoPayload } from '@/services/seguimiento/SeguimientoPersonasService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'
import { SiiiLookupsService } from '@/services/parametricas/SiiiLookupsService'
import dayjs from 'dayjs'

interface Props {
  idDetenido: string
}

export function EtapaProcesoSeccion({ idDetenido }: Props) {
  const { Alerta } = useAlerts()
  const [etapas, setEtapas] = useState<{ value: number; label: string }[]>([])
  const [estados, setEstados] = useState<{ value: number; label: string }[]>([])
  const [registros, setRegistros] = useState<any[]>([])
  const [idEtapaSeleccionada, setIdEtapaSeleccionada] = useState<number>(0)

  const { register, handleSubmit, reset, setValue, formState: { isSubmitting, errors } } = useForm<CreateEtapaProcesoPayload>({
    defaultValues: { idEstado: 0, nroResolucion: '', lugar: '', fecha: dayjs().format('YYYY-MM-DD'), autoridad: '', fjt: '' }
  })

  const reglaObligatorio = {
    required: 'Campo obligatorio',
    validate: (value: any) => {
      if (typeof value === 'number') return value !== 0 || 'Campo obligatorio'
      return String(value ?? '').trim() !== '' || 'Campo obligatorio'
    },
  }

  useEffect(() => {
    const cargarEtapas = async () => {
      try {
        const res = await SiiiLookupsService.obtenerEtapas()
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
      const res = await SiiiLookupsService.obtenerEstadosPorEtapaId(id)
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
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="fecha" className="mb-1 block text-sm font-medium">
                Fecha de la Resolución <span className="text-danger">*</span>
              </label>
              <Input
                id="fecha"
                type="date"
                className={`w-full ${errors.fecha ? 'border-danger' : ''}`}
                {...register('fecha', reglaObligatorio)}
              />
              {errors.fecha && (
                <div className="mt-1 text-xs text-danger">
                  {errors.fecha.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="idEtapa" className="mb-1 block text-sm font-medium">
                Etapa del Proceso <span className="text-danger">*</span>
              </label>
              <Select
                id="idEtapa"
                placeholder="Seleccione una etapa..."
                options={etapas}
                value={idEtapaSeleccionada}
                onChange={handleEtapaChange}
                className={`w-full ${idEtapaSeleccionada === 0 && errors.idEstado ? 'border-danger' : ''}`}
              />
              {idEtapaSeleccionada === 0 && errors.idEstado && (
                <div className="mt-1 text-xs text-danger">
                  Campo obligatorio
                </div>
              )}
            </div>
            <div>
              <label htmlFor="idEstado" className="mb-1 block text-sm font-medium">
                Estado del Proceso <span className="text-danger">*</span>
              </label>
              <Select
                id="idEstado"
                placeholder="Seleccione un estado..."
                options={estados}
                disabled={estados.length === 0}
                className={`w-full ${errors.idEstado ? 'border-danger' : ''}`}
                {...register('idEstado', {
                  ...reglaObligatorio,
                  valueAsNumber: true,
                })}
              />
              {errors.idEstado && (
                <div className="mt-1 text-xs text-danger">
                  {errors.idEstado.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="nroResolucion" className="mb-1 block text-sm font-medium">
                Nro. de Resolución <span className="text-danger">*</span>
              </label>
              <Input
                id="nroResolucion"
                type="text"
                uppercase
                className={`w-full ${errors.nroResolucion ? 'border-danger' : ''}`}
                {...register('nroResolucion', reglaObligatorio)}
              />
              {errors.nroResolucion && (
                <div className="mt-1 text-xs text-danger">
                  {errors.nroResolucion.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="lugar" className="mb-1 block text-sm font-medium">
                Lugar <span className="text-danger">*</span>
              </label>
              <Input
                id="lugar"
                type="text"
                uppercase
                className={`w-full ${errors.lugar ? 'border-danger' : ''}`}
                {...register('lugar', reglaObligatorio)}
              />
              {errors.lugar && (
                <div className="mt-1 text-xs text-danger">
                  {errors.lugar.message}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="autoridad" className="mb-1 block text-sm font-medium">
                Autoridad que emite la Resolución <span className="text-danger">*</span>
              </label>
              <Input
                id="autoridad"
                type="text"
                uppercase
                className={`w-full ${errors.autoridad ? 'border-danger' : ''}`}
                {...register('autoridad', reglaObligatorio)}
              />
              {errors.autoridad && (
                <div className="mt-1 text-xs text-danger">
                  {errors.autoridad.message}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="fjt" className="mb-1 block text-sm font-medium">
                Fiscalía, Juzgado o Tribunal <span className="text-danger">*</span>
              </label>
              <Input
                id="fjt"
                type="text"
                uppercase
                className={`w-full ${errors.fjt ? 'border-danger' : ''}`}
                {...register('fjt', reglaObligatorio)}
              />
              {errors.fjt && (
                <div className="mt-1 text-xs text-danger">
                  {errors.fjt.message}
                </div>
              )}
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
        <h4 className="mb-4 text-sm font-semibold">Historial de Etapas del Proceso</h4>
        <div className="datatables">
          <VristoDataTable
            loading={false}
            rows={registros}
            total={registros.length}
            page={1}
            limit={registros.length || 10}
            onPageChange={() => { }}
            onLimitChange={() => { }}
            columns={[
              { accessor: 'etapa', title: 'Etapa del Proceso' },
              { accessor: 'estado', title: 'Estado del Proceso' },
              { accessor: 'nroResolucion', title: 'Nro. Resolución' },
              { accessor: 'lugar', title: 'Lugar' },
              {
                accessor: 'fecha',
                title: 'Fecha',
                render: (row: any) => row.fecha ? new Date(row.fecha).toLocaleDateString('es-BO') : '-'
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
