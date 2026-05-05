'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { GestionOperativoItem } from '../../operaciones/operativo/gestion-operativo/types'
import IconArrowLeft from '@/components/Icon/IconArrowLeft'
import IconSave from '@/components/Icon/IconSave'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { InvestigacionParalelaService } from '@/services/operativos/InvestigacionParalelaService'
import { useAlerts } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

const schema = z.object({
  delitoPrecedente: z.string().min(1, 'El delito precedente es requerido'),
  detalleDelitoPrecedente: z.string().min(1, 'El detalle es requerido'),
  informeInteligencia: z.string().min(1, 'El informe es requerido'),
  fechaEnvioFiscalia: z.string().min(1, 'La fecha es requerida'),
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
  const { Alerta } = useAlerts()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      delitoPrecedente: 'Fabricación (Art. 47 Ley 1008)',
      detalleDelitoPrecedente: '',
      informeInteligencia: '',
      fechaEnvioFiscalia: dayjs().format('YYYY-MM-DD'),
    },
  })

  if (!caso) return null

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const payload = {
        idCaso: caso.idCaso,
        idOperativo: caso.numeroOperativo,
        ...data,
      }
      await InvestigacionParalelaService.guardar(payload)
      Alerta({
        mensaje: 'Caso Paralelo guardado exitosamente',
        variant: 'success',
      })
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
    <div className="space-y-6">
      <div className="panel flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/70 transition-colors"
            title="Volver al listado"
          >
            <IconArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-dark dark:text-white-light">
            Registro de Caso Paralelo
          </h2>
        </div>
      </div>

      <div className="panel p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Sección: Datos de Identificación (Lectura) */}
          <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
            <h4 className="mb-4 text-sm font-semibold uppercase text-primary">
              Datos de Identificación del Caso
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Nro. de Operativo
                </label>
                <Input
                  value={caso.numeroOperativo || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Unidad
                </label>
                <Input
                  value={caso.unidadDescripcion || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Distrital
                </label>
                <Input
                  value={caso.distritaleDescripcion || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Grupo
                </label>
                <Input
                  value={caso.grupoDescripcion || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Departamento
                </label>
                <Input
                  value={caso.departamentoDescripcion || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Sección: Datos del Caso Paralelo */}
          <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
            <h4 className="mb-4 text-sm font-semibold uppercase text-primary">
              Información de la Investigación Paralela
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Delito Precedente <span className="text-danger">*</span>
                </label>
                <Select
                  {...register('delitoPrecedente')}
                  options={[
                    {
                      id: 'Fabricación (Art. 47 Ley 1008)',
                      value: 'Fabricación (Art. 47 Ley 1008)',
                      label: 'Fabricación (Art. 47 Ley 1008)',
                    },
                    {
                      id: 'Transporte (Art. 55 Ley 1008)',
                      value: 'Transporte (Art. 55 Ley 1008)',
                      label: 'Transporte (Art. 55 Ley 1008)',
                    },
                    {
                      id: 'Tráfico (Art. 48 Ley 1008)',
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

              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Fecha de Envío a Fiscalía <span className="text-danger">*</span>
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="fechaEnvioFiscalia"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) =>
                          field.onChange(date ? date.format('YYYY-MM-DD') : '')
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.fechaEnvioFiscalia,
                            helperText: errors.fechaEnvioFiscalia?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Asignado al Caso
                </label>
                <Input
                  value={caso.asignadoCaso || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Fiscal de Sustancias Controladas
                </label>
                <Input
                  value={caso.fiscalAsignadoCaso || ''}
                  disabled
                  className="bg-[#eee] dark:bg-[#1b2e4b] cursor-not-allowed text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Delito Precedente (Detalle) <span className="text-danger">*</span>
                </label>
                <Textarea
                  {...register('detalleDelitoPrecedente')}
                  placeholder="Detalle del delito precedente..."
                  rows={4}
                  error={!!errors.detalleDelitoPrecedente}
                />
                {errors.detalleDelitoPrecedente && (
                  <p className="text-danger text-xs mt-1">
                    {errors.detalleDelitoPrecedente.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                  Informe de Inteligencia financiera o patrimonial <span className="text-danger">*</span>
                </label>
                <Textarea
                  {...register('informeInteligencia')}
                  placeholder="Informe de inteligencia financiera..."
                  rows={4}
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
              {loading ? 'Guardando...' : 'Guardar Caso Paralelo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
