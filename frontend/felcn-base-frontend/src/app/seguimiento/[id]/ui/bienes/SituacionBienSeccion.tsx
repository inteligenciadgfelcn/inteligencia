'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAlerts } from '@/hooks/useAlerts'
import { useParametricas } from '@/hooks/useParametricas'
import { DataTable } from 'mantine-datatable'
import {
  BienesServiceInstance,
  CreateSituacionBienPayload,
} from '@/services/seguimiento/SeguimientoBienesService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface Props {
  idItemBien: string
}

export function SituacionBienSeccion({ idItemBien }: Props) {
  const { Alerta } = useAlerts()
  const { calidadesBien, cargarCalidadesBien } = useParametricas()
  const [registros, setRegistros] = useState<any[]>([])
  const [cargando, setCargando] = useState(false)

  const { register, handleSubmit, reset, formState: { isSubmitting } } =
    useForm<CreateSituacionBienPayload>({
      defaultValues: {
        fechaRequerimiento: '',
        fiscalRequerimiento: '',
        idCalidadBien: 0,
        fechaEntrega: '',
        responsableEntrega: '',
        responsableRecepcion: '',
        institucion: '',
        ubicacion: '',
      },
    })

  useEffect(() => { void cargarCalidadesBien() }, [cargarCalidadesBien])

  const cargarRegistros = async () => {
    try {
      setCargando(true)
      const res = await BienesServiceInstance.listarSituacion(idItemBien)
      const datos = Array.isArray(res) ? res : res?.datos ?? []
      setRegistros(datos)
    } catch {
      setRegistros([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { void cargarRegistros() }, [idItemBien])

  const onSubmit = async (payload: CreateSituacionBienPayload) => {
    try {
      await BienesServiceInstance.registrarSituacion(idItemBien, {
        ...payload,
        idCalidadBien: Number(payload.idCalidadBien),
      })
      Alerta({ mensaje: 'Entrega del bien registrada correctamente', variant: 'success' })
      reset()
      void cargarRegistros()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-semibold mb-4 text-primary">ENTREGA O DEVOLUCIÓN DEL BIEN</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">
                Fecha del Requerimiento Fiscal de Entrega o Devolución del Bien
              </label>
              <Input type="date" {...register('fechaRequerimiento', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Nombres y Apellidos del Fiscal que Emite el Requerimiento
              </label>
              <Input {...register('fiscalRequerimiento', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Condición Legal de la Entrega del Bien
              </label>
              <Select
                size="sm"
                placeholder="Seleccione..."
                options={calidadesBien.map((c) => ({ value: String(c.id), label: c.descripcion }))}
                {...register('idCalidadBien', { required: true })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Fecha de Entrega del Bien</label>
              <Input type="date" {...register('fechaEntrega', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Nombres, Apellidos y Cargo del Responsable de la Entrega del Bien
              </label>
              <Input {...register('responsableEntrega', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Nombres, Apellidos y Cargo del Responsable de la Recepción del Bien
              </label>
              <Input {...register('responsableRecepcion', { required: true })} size="sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Institución Responsable del Bien
              </label>
              <Input {...register('institucion', { required: true })} size="sm" />
              <p className="text-[10px] text-gray-400 mt-1">
                Ej. DIRCABI, Min. Defensa, Min. Público, Personas Naturales o Jurídicas
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Ubicación Física del Bien
              </label>
              <Input {...register('ubicacion', { required: true })} size="sm" />
              <p className="text-[10px] text-gray-400 mt-1">
                Departamento, Provincia, Localidad o Ciudad, Dirección y Numeración
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="warning" size="sm" loading={isSubmitting}>
              GUARDAR
            </Button>
          </div>
        </form>
      </div>

      <div className="datatables">
        <DataTable
          noRecordsText="No hay registros de entrega o devolución"
          highlightOnHover
          fetching={cargando}
          className="whitespace-nowrap table-hover"
          records={registros}
          columns={[
            { accessor: 'fechaRequerimiento', title: 'Fecha Req. Fiscal o Dev. del Bien' },
            { accessor: 'fiscalRequerimiento', title: 'Fiscal' },
            {
              accessor: 'calidadBien',
              title: 'Condición Legal',
              render: (row) => row.calidadBien?.descripcion ?? '-',
            },
            { accessor: 'fechaEntrega', title: 'Fecha de la Entrega del Bien' },
            { accessor: 'responsableEntrega', title: 'Responsable de la Entrega' },
            { accessor: 'responsableRecepcion', title: 'Responsable de la Recepción' },
            { accessor: 'institucion', title: 'Institución Responsable del Bien' },
            { accessor: 'ubicacion', title: 'Ubicación Física del Bien' },
          ]}
        />
      </div>
    </div>
  )
}
