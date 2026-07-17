'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { GestionOperativoItem } from '@/app/operativos/types'
import IconArrowLeft from '@/components/Icon/IconArrowLeft'
import IconSave from '@/components/Icon/IconSave'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { InvestigacionService } from '@/services/investigacion/InvestigacionService'
import type { InvestigacionParalelaPayload } from '@/services/investigacion/InvestigacionService'
import { useAlerts } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import dayjs from 'dayjs'
import { LoadingDialog } from '@/components/modales/LoadingDialog'

const schema = z.object({
  delitoPrecedente: z.string().min(1, 'El delito precedente es requerido'),
  detalleDelitoPrecedente: z.string().min(1, 'El detalle es requerido'),
  informeInteligencia: z.string().min(1, 'El informe es requerido'),
  fechaEnvioInvestigacionParalela: z.string().min(1, 'La fecha de envío es requerida'),
})

type FormData = z.infer<typeof schema>

interface FormInvestigacionParalelaProps {
  caso: GestionOperativoItem | null
  onBack: () => void
}

export const FormInvestigacionParalela = ({
  caso,
  onBack,
}: FormInvestigacionParalelaProps) => {
  const [loading, setLoading] = useState(false)
  const [loadingDetalle, setLoadingDetalle] = useState(false)
  const [investigacionIdInterno, setInvestigacionIdInterno] = useState<string | null>(null)
  const { Alerta } = useAlerts()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      delitoPrecedente: 'Fabricación (Art. 47 Ley 1008)',
      detalleDelitoPrecedente: caso?.descripcionOperativo || '',
      informeInteligencia: '',
      fechaEnvioInvestigacionParalela: dayjs().format('YYYY-MM-DD'),
    },
  })

  useEffect(() => {
    if (!caso?.idOperativo) return
    const verificarExistente = async () => {
      setLoadingDetalle(true)
      try {
        const res = await InvestigacionService.obtenerPorOperativo(String(caso.idOperativo))
        const detalle = res.datos
        if (detalle) {
          setInvestigacionIdInterno(detalle.id)
          reset({
            delitoPrecedente: detalle.delito,
            detalleDelitoPrecedente: detalle.delitoPrecedente,
            informeInteligencia: detalle.informe,
            fechaEnvioInvestigacionParalela: dayjs(detalle.fechaEnvioInvestigacionParalela).format('YYYY-MM-DD'),
          })
        }
      } catch {
        // sin registro previo — formulario vacío
      } finally {
        setLoadingDetalle(false)
      }
    }
    void verificarExistente()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caso?.idOperativo])

  if (!caso) return null
  if (loadingDetalle) return <LoadingDialog show />

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      if (investigacionIdInterno) {
        await InvestigacionService.actualizar(investigacionIdInterno, {
          delito: data.delitoPrecedente,
          delitoPrecedente: data.detalleDelitoPrecedente,
          informe: data.informeInteligencia,
          fechaEnvioInvestigacionParalela: data.fechaEnvioInvestigacionParalela,
        })
        Alerta({ mensaje: 'Caso Paralelo actualizado exitosamente', variant: 'success' })
      } else {
        const payload: InvestigacionParalelaPayload = {
          idCaso: caso.idCaso,
          idDepartamentoCaso: caso.idDepartamentoCaso || '',
          abreviaturaUnidad: caso.abreviaturaUnidad || '',
          idDistrital: caso.idDistrital || 0,
          idGrupo: caso.idGrupo || 0,
          delito: data.delitoPrecedente,
          numeroCaso: caso.numeroCaso || '',
          asignadoCaso: caso.asignadoCaso || '',
          fiscalAsignadoCaso: caso.fiscalAsignadoCaso || '',
          idOperativo: String(caso.idOperativo) || '',
          delitoPrecedente: data.detalleDelitoPrecedente,
          informe: data.informeInteligencia,
          fechaEnvioInvestigacionParalela: data.fechaEnvioInvestigacionParalela,
          resultado: false,
          respuestaInvestigacionParalela: false,
        }
        await InvestigacionService.guardar(payload)
        Alerta({ mensaje: 'Caso Paralelo guardado exitosamente', variant: 'success' })
      }
      onBack()
    } catch (error) {
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <LoadingDialog show={loading} />
      <div className="panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/70 transition-colors"
            title="Volver"
          >
            <IconArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-primary">
            {investigacionIdInterno ? 'Editar Caso Paralelo' : 'Registro de Caso Paralelo'}
          </h2>
        </div>
      </div>

      <div className="panel p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Sección: Datos de Identificación (Lectura) */}
          <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
            <h4 className="mb-4 text-sm font-semibold text-primary">
              Datos de Identificación del Caso
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Nro. de Caso
                </label>
                <Input
                  value={caso.numeroCaso || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nro. de Operativo
                </label>
                <Input
                  value={caso.numeroOperativo || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Nombre de Caso
                </label>
                <Input
                  value={caso.nombreCaso || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Unidad
                </label>
                <Input
                  value={caso.unidadDescripcion || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Distrital
                </label>
                <Input
                  value={caso.distritaleDescripcion || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Grupo
                </label>
                <Input
                  value={caso.grupoDescripcion || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Departamento
                </label>
                <Input
                  value={caso.departamento || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Sección: Datos del Caso Paralelo */}
          <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
            <h4 className="mb-4 text-sm font-semibold text-primary">
              Información de la Investigación Paralela
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-1">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Delito Precedente <span className="text-danger">*</span>
                </label>
                <Select
                  {...register('delitoPrecedente')}
                  options={[
                    {
                      value: 'Fabricación (Art. 47 Ley 1008)',
                      label: 'Fabricación (Art. 47 Ley 1008)',
                    },
                    {
                      value: 'Transporte (Art. 55 Ley 1008)',
                      label: 'Transporte (Art. 55 Ley 1008)',
                    },
                    {
                      value: 'Tráfico (Art. 48 Ley 1008)',
                      label: 'Tráfico (Art. 48 Ley 1008)',
                    },
                  ]}
                  error={!!errors.delitoPrecedente}
                />
                {errors.delitoPrecedente && (
                  <p className="text-danger text-xs mt-1">
                    {errors.delitoPrecedente.message}
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className="mb-1 block text-sm font-medium">
                  Asignado al Caso
                </label>
                <Input
                  value={caso.asignadoCaso || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>

              <div className="col-span-1">
                <label className="mb-1 block text-sm font-medium">
                  Fiscal de Sustancias Controladas
                </label>
                <Input
                  value={caso.fiscalAsignadoCaso || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>

              <div className="col-span-1">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Fecha de Envío a Fiscalía <span className="text-danger">*</span>
                </label>
                <Input
                  type="date"
                  {...register('fechaEnvioInvestigacionParalela')}
                  error={!!errors.fechaEnvioInvestigacionParalela}
                />
                {errors.fechaEnvioInvestigacionParalela && (
                  <p className="text-danger text-xs mt-1">
                    {errors.fechaEnvioInvestigacionParalela.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="mb-1 block text-sm font-medium">
                  Delito Precedente (Detalle) <span className="text-danger">*</span>
                </label>
                <Textarea
                  {...register('detalleDelitoPrecedente')}
                  placeholder="Detalle del delito precedente..."
                  rows={4}
                  uppercase
                  error={!!errors.detalleDelitoPrecedente}
                />
                {errors.detalleDelitoPrecedente && (
                  <p className="text-danger text-xs mt-1">
                    {errors.detalleDelitoPrecedente.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="mb-1 block text-sm font-medium">
                  Informe de Inteligencia financiera o patrimonial <span className="text-danger">*</span>
                </label>
                <Textarea
                  {...register('informeInteligencia')}
                  placeholder="Informe de inteligencia financiera..."
                  rows={4}
                  uppercase
                  error={!!errors.informeInteligencia}
                />
                {errors.informeInteligencia && (
                  <p className="text-danger text-xs mt-1">
                    {errors.informeInteligencia.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline-danger"
              type="button"
              onClick={onBack}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              <IconSave className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
