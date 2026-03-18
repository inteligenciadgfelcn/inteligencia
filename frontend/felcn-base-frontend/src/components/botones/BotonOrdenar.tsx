import React, { ReactNode } from 'react'
import { CriterioOrdenType } from '@/components/datatable/ordenTypes'
import { ToggleOrden } from '@/components/datatable/utils'
import { Dropdown } from '@/components/ui/Dropdown'
import { Icono } from '@/components/Icono'

interface BotonOrdenarParams {
  desactivado?: boolean // corrected type from 'false' literal
  color?: string
  cambioCriterios: (nuevosCriterios: Array<CriterioOrdenType>) => void
  criterios: Array<CriterioOrdenType>
  icono?: ReactNode
  label: string
  id: string
}

export const BotonOrdenar = ({
  desactivado = false,
  color = 'primary',
  criterios = [],
  icono = 'swap_vert',
  cambioCriterios,
  label,
}: BotonOrdenarParams) => {

  const activeCount = criterios.filter((value) => value.ordenar && value.orden).length;

  const dropdownItems = criterios.filter(c => c.ordenar).map((accion, index) => ({
    label: accion.nombre,
    icon: accion.orden ? (
      <Icono>{accion.orden == 'asc' ? 'north' : 'south'}</Icono>
    ) : <span className="w-5" />, // placeholder for alignment
    onClick: () => {
      const nuevosCriterios = [...criterios]
      cambioCriterios(
        nuevosCriterios.map((value, indice) => ({
          ...value,
          ...{
            orden:
              index == indice
                ? ToggleOrden(value.orden)
                : undefined,
          },
        }))
      )
    }
  }));

  const triggerIcon = (
    <div className="relative">
      <Icono>{icono}</Icono>
      {activeCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
        </span>
      )}
    </div>
  );

  return (
    <div title={label}>
      <Dropdown
        icon={triggerIcon}
        items={dropdownItems}
        variant={color as any}
        btnClassName={`p-2 rounded-full ${desactivado ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  )
}
