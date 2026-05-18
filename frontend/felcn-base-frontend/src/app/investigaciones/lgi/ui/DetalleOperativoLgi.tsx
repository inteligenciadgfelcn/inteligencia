'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { AsignacionLgiItem, OperativoLgiItem } from '@/services/lgi/LgiService'
import IconArrowLeft from '@/components/Icon/IconArrowLeft'
import dayjs from 'dayjs'

interface DetalleOperativoLgiProps {
  asignacion: AsignacionLgiItem
  operativo: OperativoLgiItem
  onBack: () => void
}

export function DetalleOperativoLgi({ asignacion, operativo, onBack }: DetalleOperativoLgiProps) {
  return (
    <div className="space-y-4">
      <div className="panel flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-primary transition-colors hover:text-primary/70"
          title="Volver"
        >
          <IconArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold text-primary">Detalle del Operativo LGI</h2>
      </div>

      <div className="panel p-6 space-y-6">
        {/* Datos del Caso */}
        <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
          <h4 className="mb-4 text-sm font-semibold text-primary">Datos del Caso</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Nro. Caso FELCN
              </label>
              <Input
                value={asignacion.nroCaso || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Nro. Caso GIAEF
              </label>
              <Input
                value={asignacion.nroCasoGiaef || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Nro. Caso Fiscalía
              </label>
              <Input
                value={asignacion.nroCasoFis || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Nombre del Caso
              </label>
              <Input
                value={asignacion.nombreCaso || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Regional
              </label>
              <Input
                value={asignacion.distrital || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Nro. Pérdida de Dominio
              </label>
              <Input
                value={asignacion.nroCasoPerDom || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                IANUS
              </label>
              <Input
                value={asignacion.ianus || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Fiscal que Remite
              </label>
              <Input
                value={asignacion.remiteFiscal || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Fecha Remisión
              </label>
              <Input
                value={
                  asignacion.remiteFecha
                    ? dayjs(asignacion.remiteFecha).format('DD/MM/YYYY')
                    : ''
                }
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Conforme A
              </label>
              <Input
                value={asignacion.conformeA || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
          </div>
        </div>

        {/* Datos del Operativo */}
        <div className="rounded-md border border-[#e0e6ed] p-4 dark:border-[#1b2e4b]">
          <h4 className="mb-4 text-sm font-semibold text-primary">Datos del Operativo</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Nro. de Informe
              </label>
              <Input
                value={operativo.opNroOper || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Fecha Operativo
              </label>
              <Input
                value={
                  operativo.opFechaInf
                    ? dayjs(operativo.opFechaInf).format('DD/MM/YYYY')
                    : ''
                }
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Unidad / Distrital
              </label>
              <Input
                value={operativo.unidadDistrital || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Lugar del Operativo
              </label>
              <Input
                value={operativo.ubicacion || ''}
                disabled
                className="cursor-not-allowed bg-[#eee] text-gray-500 dark:bg-[#1b2e4b]"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="mb-1 block text-sm font-medium text-dark dark:text-white-light">
                Relación de Hecho
              </label>
              <Textarea
                readOnly
                rows={5}
                className="cursor-not-allowed bg-[#eee] text-sm dark:bg-[#1b2e4b]"
                value={operativo.opDescripcion || ''}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Button variant="outline-danger" onClick={onBack}>
            Volver
          </Button>
        </div>
      </div>
    </div>
  )
}
