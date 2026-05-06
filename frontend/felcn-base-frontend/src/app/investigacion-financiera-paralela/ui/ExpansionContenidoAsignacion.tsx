'use client'

import { useQuery } from '@tanstack/react-query'
import { GestionOperativoService } from '@/services/operativos'
import { Button } from '@/components/ui/Button'
import IconCircleCheck from '@/components/Icon/IconCircleCheck'
import IconCalendar from '@/components/Icon/IconCalendar'
import IconMapPin from '@/components/Icon/IconMapPin'
import IconInfoCircle from '@/components/Icon/IconInfoCircle'
import { Textarea } from '@/components/ui/Textarea'
import dayjs from 'dayjs'
import type { GestionOperativoItem } from '../../operaciones/operativo/gestion-operativo/types'

interface ExpansionContenidoAsignacionProps {
  asignacion: GestionOperativoItem
  onSelectOperativo: (asignacion: GestionOperativoItem, operativo: any) => void
}

export function ExpansionContenidoAsignacion({
  asignacion,
  onSelectOperativo,
}: ExpansionContenidoAsignacionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['operativos-por-caso', asignacion.idCaso],
    queryFn: () => GestionOperativoService.buscarPorCasoDetalle(asignacion.idCaso),
    enabled: !!asignacion.idCaso,
  })

  const operativos = data?.datos ?? []

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    )
  }

  if (operativos.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 italic">
        No se encontraron operativos registrados para este caso.
      </div>
    )
  }

  return (
    <div className="space-y-4 p-2">
      <h5 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-secondary">
        <IconInfoCircle className="h-5 w-5" />
        Operativos Vinculados
      </h5>

      <div className="grid grid-cols-1 gap-4">
        {operativos.map((op: any) => (
          <div
            key={op.idOperativo}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50"
          >
            <div className="flex flex-col gap-3">
              {/* Header del Card */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-2 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-primary">Nro. Informe</span>
                  <span className="text-lg font-black text-dark dark:text-white-light">
                    {op.numeroInforme}
                  </span>
                </div>
                <span className="badge badge-outline-primary text-[10px]">
                  ID: {op.idOperativo}
                </span>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <IconCalendar className="h-4 w-4 text-secondary" />
                  <span>{dayjs(op.fechaOperativo).format('DD/MM/YYYY HH:mm')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <IconMapPin className="h-4 w-4 text-danger" />
                  <span className="truncate">{op.departamento}</span>
                </div>
              </div>

              {/* Descripción / Detalle */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Breve Detalle del Operativo
                </label>
                <Textarea
                  readOnly
                  rows={3}
                  className="bg-gray-50 text-xs leading-relaxed dark:bg-gray-900/40"
                  value={op.detalleOperativo || op.descripcionOperativo || 'Sin descripción detallada.'}
                />
              </div>

              {/* Botón de Acción */}
              <div className="mt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-2 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95"
                  onClick={() => onSelectOperativo(asignacion, op)}
                >
                  <IconCircleCheck className="h-4 w-4" />
                  Seleccionar Operativo
                </Button>
              </div>
            </div>

            {/* Efecto decorativo en hover */}
            <div className="absolute -right-2 -top-2 h-16 w-16 rotate-12 bg-primary/5 transition-transform group-hover:scale-150" />
          </div>
        ))}
      </div>
    </div>
  )
}
