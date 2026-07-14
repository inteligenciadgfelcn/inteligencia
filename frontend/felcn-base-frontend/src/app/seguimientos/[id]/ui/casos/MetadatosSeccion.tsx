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

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<UpdateMetadatosPayload>({
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
      <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Número de Caso</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.numeroCaso || '-'} disabled readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Número de Operativo</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.nroOperativo || '-'} disabled readOnly />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Nombre del Caso</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.nombreCaso || '-'} disabled readOnly />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Asignado al Caso</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.asignadoCaso || '-'} disabled readOnly />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Fiscal Asignado</label>
            <Input className="w-full bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500" value={cabecera?.fiscalAsignadoCaso || '-'} disabled readOnly />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="mb-1 block text-sm font-medium">CUD Fiscalía</label>
            <Input
              {...register('ianus')}
              placeholder="Ingrese el CUD"
              uppercase
              error={!!errors.ianus}
            />
            {errors.ianus && <div className="mt-1 text-xs text-danger">{errors.ianus.message}</div>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Num. Caso Perdida de Dominio</label>
            <Input
              {...register('numeroCasoPerDom')}
              placeholder="Ingrese número de caso"
              uppercase
              error={!!errors.numeroCasoPerDom}
            />
            {errors.numeroCasoPerDom && <div className="mt-1 text-xs text-danger">{errors.numeroCasoPerDom.message}</div>}
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Etapa investigativa</label>
            <Select
              {...register('idEtapaInvestigacion', { valueAsNumber: true })}
              options={etapasInvestigacion.map(e => ({ value: String(e.id), label: e.descripcion }))}
              placeholder="Seleccione la etapa..."
              error={!!errors.idEtapaInvestigacion}
            />
            {errors.idEtapaInvestigacion && <div className="mt-1 text-xs text-danger">{errors.idEtapaInvestigacion.message}</div>}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Informe del Caso / Detalle del Hecho</label>
          <Textarea
            {...register('descripcionOperativo')}
            placeholder="Escriba el informe detallado del caso..."
            rows={20}
            className={`font-mono text-sm ${errors.descripcionOperativo ? '!border-danger' : ''}`}
          />
          {errors.descripcionOperativo && <div className="mt-1 text-xs text-danger">{errors.descripcionOperativo.message}</div>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="success" size="sm" loading={isSubmitting}>
            <Icono className="w-4 h-4 mr-2">save</Icono>
            ACTUALIZAR INFORME
          </Button>
        </div>
      </form>
    </div>
  )
}
