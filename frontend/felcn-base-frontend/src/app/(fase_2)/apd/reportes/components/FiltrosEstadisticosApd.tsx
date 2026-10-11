'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import { Icono } from '@/components/Icono'
import type { FiltrosEstadisticosLgi } from '@/services/reportes/LgiEstadisticasService'

interface Props {
  onBuscar: (filtros: FiltrosEstadisticosLgi) => void
  onLimpiar?: () => void
  cargando: boolean
  titulo?: string
}

function hoy(): string {
  return new Date().toISOString().split('T')[0]
}

function inicioAnio(): string {
  return `${new Date().getFullYear()}-01-01`
}

function generarGestiones(): SelectOption[] {
  const actual = new Date().getFullYear()
  const opciones: SelectOption[] = []
  for (let anio = actual; anio >= actual - 10; anio--) {
    opciones.push({ value: anio, label: String(anio) })
  }
  return opciones
}

export function FiltrosEstadisticos({ onBuscar, onLimpiar, cargando, titulo }: Props) {
  const [fechaInicio, setFechaInicio] = useState(inicioAnio)
  const [fechaFin, setFechaFin] = useState(hoy)
  const [gestion, setGestion] = useState<number | ''>('')

  const limpiar = () => {
    setFechaInicio(inicioAnio())
    setFechaFin(hoy())
    setGestion('')
    onLimpiar?.()
  }

  const ejecutarBusqueda = () => {
    onBuscar({
      fechaInicio: gestion ? undefined : fechaInicio,
      fechaFin: gestion ? undefined : fechaFin,
      gestion: gestion || undefined,
    })
  }

  return (
    <div className="panel space-y-5">
      <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-3">
        <div className="flex items-center gap-2">
          <Icono className="w-5 h-5 text-primary">search</Icono>
          <h3 className="text-base font-bold text-dark dark:text-white-light">
            {titulo ?? 'Filtros de Reporte'}
          </h3>
        </div>
        <Button variant="outline-danger" size="sm" onClick={limpiar} disabled={cargando}>
          <Icono className="w-4 h-4 mr-1">refresh</Icono>
          Limpiar
        </Button>
      </div>

      <div className="rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 px-4 py-3">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">
          Rango de Fechas / Gestión
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Fecha Inicio
            </label>
            <Input
              size="sm"
              type="date"
              value={fechaInicio}
              disabled={!!gestion}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Fecha Fin
            </label>
            <Input
              size="sm"
              type="date"
              value={fechaFin}
              disabled={!!gestion}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Gestión (opcional)
            </label>
            <Select
              size="sm"
              value={gestion}
              onChange={(e) => setGestion(e.target.value ? Number(e.target.value) : '')}
              options={generarGestiones()}
              placeholder="Todas"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={cargando || (!gestion && !fechaInicio) || (!gestion && !fechaFin)}
            onClick={ejecutarBusqueda}
          >
            <Icono className="w-4 h-4 mr-1">event</Icono>
            Buscar
          </Button>
        </div>
        <p className="text-[11px] text-blue-600/70 dark:text-blue-400/60 mt-2">
          Si selecciona una gestión, el rango de fechas se ignora y se reporta el año completo.
        </p>
      </div>
    </div>
  )
}