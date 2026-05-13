'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useParametricas } from '@/hooks'
import { useAlerts } from '@/hooks/useAlerts'
import { Icono } from '@/components/Icono'
import { SeguimientoServiceInstance, UpdateMetadatosPayload } from '@/services/seguimiento/SeguimientoCasosService'
import { InterpreteMensajes } from '@/utils/interpreteMensajes'

interface MetadatosSeccionProps {
  idCaso: string
  idOperativo: string | null
  cabecera: any
  operativo: any
  onGuardar: () => void
}

export function MetadatosSeccion({ idCaso, idOperativo, cabecera, operativo, onGuardar }: MetadatosSeccionProps) {
  const { Alerta } = useAlerts()
  const { etapasInvestigacion, cargarEtapasInvestigacion } = useParametricas()

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<UpdateMetadatosPayload>({
    defaultValues: {
      ianus: '',
      numeroCasoPerDom: '',
      idEtapaInvestigacion: 0,
      descripcionOperativo: ''
    }
  })

  useEffect(() => {
    void cargarEtapasInvestigacion()
  }, [cargarEtapasInvestigacion])

  useEffect(() => {
    if (cabecera || operativo) {
      const stageId = cabecera?.idEtapaInvestigacion ?? cabecera?.id_etapa_investigacion;
      reset({
        ianus: cabecera?.ianus || '',
        numeroCasoPerDom: cabecera?.nroCasoPerDom || '',
        idEtapaInvestigacion: stageId ? Number(stageId) : undefined,
        descripcionOperativo: operativo?.relacionHecho || ''
      })
    }
  }, [cabecera, operativo, reset, etapasInvestigacion])

  const onSubmit = async (payload: UpdateMetadatosPayload) => {
    if (!idOperativo) {
      Alerta({ mensaje: 'No se encontró el ID del operativo asociado', variant: 'warning' })
      return
    }
    try {
      await SeguimientoServiceInstance.actualizarMetadatos(idCaso, idOperativo, payload)
      Alerta({ mensaje: 'Metadatos actualizados correctamente', variant: 'success' })
      onGuardar()
    } catch (error) {
      Alerta({ mensaje: InterpreteMensajes(error), variant: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel bg-gray-50 dark:bg-gray-800/40">
        <h3 className="text-lg font-bold mb-4 text-primary uppercase">ACTUALIZACION DEL INFORME</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="text-gray-500 font-semibold block mb-1">Número de Caso</label>
            <div className="font-bold text-dark dark:text-white-light">{cabecera?.numeroCaso || '-'}</div>
          </div>
          <div>
            <label className="text-gray-500 font-semibold block mb-1">Número de Operativo</label>
            <div className="font-bold text-dark dark:text-white-light">{cabecera?.nroOperativo || '-'}</div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-500 font-semibold block mb-1">Nombre del Caso</label>
            <div className="font-bold text-dark dark:text-white-light">{cabecera?.nombreCaso || '-'}</div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-500 font-semibold block mb-1">Asignado al Caso</label>
            <div className="font-bold text-dark dark:text-white-light">{cabecera?.asignadoCaso || '-'}</div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-gray-500 font-semibold block mb-1">Fiscal Asignado</label>
            <div className="font-bold text-dark dark:text-white-light">{cabecera?.fiscalAsignadoCaso || '-'}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-sm font-bold mb-2">CUD Fiscalía</label>
            <Input
              {...register('ianus')}
              placeholder="Ingrese el CUD"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Num. Caso Perdida de Dominio</label>
            <Input
              {...register('numeroCasoPerDom')}
              placeholder="Ingrese número de caso"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold mb-2">Etapa investigativa</label>
            <Select
              {...register('idEtapaInvestigacion', { valueAsNumber: true })}
              options={etapasInvestigacion.map(e => ({ value: String(e.id), label: e.descripcion }))}
              placeholder="Seleccione la etapa..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 uppercase">Informe del Caso / Detalle del Hecho</label>
          <Textarea
            {...register('descripcionOperativo')}
            placeholder="Escriba el informe detallado del caso..."
            rows={20}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="secondary" loading={isSubmitting}>
            <Icono className="w-4 h-4 mr-2">save</Icono>
            ACTUALIZAR INFORME
          </Button>
        </div>
      </form>
    </div>
  )
}
