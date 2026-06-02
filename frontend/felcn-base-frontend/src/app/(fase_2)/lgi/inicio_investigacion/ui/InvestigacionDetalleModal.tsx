'use client'

import { Button } from '@/components/ui/Button'

import type { InicioInvestigacionItem } from '../types/inicio-investigacion.types'
import { formatFechaRemision } from '../mappers/inicio-investigacion.mappers'

type Props = {
  item: InicioInvestigacionItem | null
  isOpen: boolean
  onClose: () => void
}

export function InvestigacionDetalleModal({ item, isOpen, onClose }: Props) {
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="panel w-full max-w-4xl p-0 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#e0e6ed] px-5 py-4 dark:border-[#1b2e4b]">
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white-light">
              Detalle de investigación
            </h3>
            <p className="text-sm text-gray-500">{item.nombreCaso}</p>
          </div>
          <Button variant="outline-secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['ID', item.id],
            ['Regional', item.regional],
            ['Estado del Caso', item.estadoCaso],
            ['Nro Caso GIAEF', item.nroCasoGiaef],
            ['Nro Caso FELCN', item.nroCasoFelcn],
            ['Nro Caso Fiscalía', item.nroCasoFiscalia],
            ['Nro Pérdida de dominio', item.nroPerdidaDominio],
            ['IAUNUS', item.iaunus],
            ['Fiscal que Remite', item.fiscalQueRemite],
            ['Fecha remisión', formatFechaRemision(item.fechaRemision)],
            ['Conforme a', item.conformeA],
            ['Investigador', item.investigador],
            ['Departamento', item.departamento],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 p-3 dark:border-[#1b2e4b]"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
