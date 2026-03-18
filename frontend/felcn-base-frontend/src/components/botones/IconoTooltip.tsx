import React, { FC } from 'react'
import { Icono } from '@/components/Icono'

interface IconoTooltipParams {
  id: string
  titulo: string
  color?: string
  accion: (id: string) => void
  icono: string
  name: string
  desactivado?: boolean
}

export const IconoTooltip: FC<IconoTooltipParams> = ({
  id,
  titulo,
  accion,
  icono,
  name,
  desactivado = false,
}) => {
  return (
    <button
      type="button"
      id={id}
      aria-label={name}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${desactivado ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !desactivado && accion(id)}
      disabled={desactivado}
      title={titulo}
    >
      <Icono>{icono}</Icono>
    </button>
  )
}
