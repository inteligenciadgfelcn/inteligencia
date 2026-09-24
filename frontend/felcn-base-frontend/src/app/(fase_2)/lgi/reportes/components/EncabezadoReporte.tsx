'use client'

import { Icono } from '@/components/Icono'

export function EncabezadoReporte({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  return (
    <div className="panel">
      <div className="flex items-center gap-3">
        <Icono className="w-6 h-6 text-primary">bar_chart</Icono>
        <div>
          <h1 className="text-lg font-semibold text-dark dark:text-white">{titulo}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{descripcion}</p>
        </div>
      </div>
    </div>
  )
}

export function EstadoInicial({ mensaje }: { mensaje?: string }) {
  return (
    <div className="panel flex flex-col items-center justify-center py-16 text-center">
      <Icono className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4">pie_chart</Icono>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {mensaje ?? 'Seleccione el rango de fechas y presione Buscar para generar el reporte.'}
      </p>
    </div>
  )
}

export function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <div className="panel border border-danger/50 bg-danger/10 text-danger py-6 text-center text-sm">
      {mensaje}
    </div>
  )
}