import React, { MouseEventHandler, ReactNode } from 'react'
import { Dropdown } from '@/components/ui/Dropdown'
import { Icono } from '@/components/Icono'

// Compatible Types
interface TipoAccion {
  color?: string // Simplified
  titulo: string
  icono: ReactNode
  accion: MouseEventHandler<any> | undefined
  desactivado?: boolean
  mostrar?: boolean
  name: string
  id: string
}

interface BotonAccionesParams {
  desactivado?: boolean
  color?: string
  variante?: 'icono' | 'boton'
  texto?: string
  acciones: Array<TipoAccion>
  icono?: ReactNode
  label: string
  id: string
}

export const BotonAcciones = ({
  desactivado = false,
  color = 'primary',
  acciones = [],
  icono = 'more_horiz',
  variante = 'icono',
  texto = 'acciones',
}: BotonAccionesParams) => {

  // Map actions to DropdownItems
  const dropdownItems = acciones
    .filter(a => a.mostrar)
    .map(a => ({
      label: a.titulo,
      icon: <Icono>{a.icono}</Icono>, // Wrap if needed, or pass directly if Icono expects string
      onClick: (e: any) => a.accion && a.accion(e),
      disabled: a.desactivado
    }));

  if (variante === 'boton') {
    return (
      <Dropdown
        label={texto}
        items={dropdownItems}
        variant={color as any} // Cast to match variant types roughly
        btnClassName={desactivado ? 'opacity-50 cursor-not-allowed' : ''}
      />
    )
  }

  // Icon variant
  return (
    <Dropdown
      icon={<Icono>{icono}</Icono>}
      items={dropdownItems}
      variant={color as any}
      btnClassName={`p-2 rounded-full ${desactivado ? 'opacity-50' : ''}`} // Icon button style
    />
  )
}
