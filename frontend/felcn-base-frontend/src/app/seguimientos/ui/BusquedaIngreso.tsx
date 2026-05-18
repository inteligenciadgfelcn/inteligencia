'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import IconSearch from '@/components/Icon/IconSearch'

export type ModoBusqueda = 'nroCaso' | 'nombreCaso' | 'fecha'

export interface ValoresBusqueda {
  modo: ModoBusqueda
  nroCaso?: string
  nombreCaso?: string
  desde?: string
  hasta?: string
}

interface BusquedaIngresoProps {
  onBuscar: (valores: ValoresBusqueda) => void
  cargando?: boolean
}

export function BusquedaIngreso({ onBuscar, cargando }: BusquedaIngresoProps) {
  const [nroCaso, setNroCaso] = useState('')
  const [nombreCaso, setNombreCaso] = useState('')
  const [desde, setDesde] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 365)
    return d.toISOString().split('T')[0]
  })
  const [hasta, setHasta] = useState(() => new Date().toISOString().split('T')[0])

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Número de Caso
          </label>
          <Input
            size="sm"
            value={nroCaso}
            onChange={(e) => setNroCaso(e.target.value)}
            placeholder="Ej: LP-A-1/25"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && nroCaso.trim()) {
                onBuscar({ modo: 'nroCaso', nroCaso: nroCaso.trim() })
              }
            }}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={!nroCaso.trim() || cargando}
          onClick={() => onBuscar({ modo: 'nroCaso', nroCaso: nroCaso.trim() })}
        >
          <IconSearch className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Nombre del Caso
          </label>
          <Input
            size="sm"
            value={nombreCaso}
            onChange={(e) => setNombreCaso(e.target.value)}
            placeholder="Nombre del operativo"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && nombreCaso.trim()) {
                onBuscar({ modo: 'nombreCaso', nombreCaso: nombreCaso.trim() })
              }
            }}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={!nombreCaso.trim() || cargando}
          onClick={() => onBuscar({ modo: 'nombreCaso', nombreCaso: nombreCaso.trim() })}
        >
          <IconSearch className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Desde
          </label>
          <Input size="sm" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
            Hasta
          </label>
          <Input size="sm" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        <Button
          variant="secondary"
          size="sm"
          disabled={!desde || !hasta || cargando}
          onClick={() => onBuscar({ modo: 'fecha', desde, hasta })}
        >
          <IconSearch className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
