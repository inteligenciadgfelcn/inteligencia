'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { FiltroFlujoTransporteReporte } from '@/services/analisis'

interface Props {
  onBuscar: (filtro: FiltroFlujoTransporteReporte) => void
  cargando?: boolean
}

export function FiltrosFlujoTransporte({ onBuscar, cargando }: Props) {
  const [documento, setDocumento] = useState('')
  const [placa, setPlaca] = useState('')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const handleBuscar = () => {
    onBuscar({
      documento: documento.trim() || undefined,
      placa: placa.trim() || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    })
  }

  const handleLimpiar = () => {
    setDocumento('')
    setPlaca('')
    setFechaDesde('')
    setFechaHasta('')
    onBuscar({})
  }

  return (
    <div className="panel px-5 py-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-sm font-medium">Documento del conductor</label>
          <Input
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            placeholder="Ej. 1234567"
            uppercase
            trimOnBlur
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Placa / código de transporte</label>
          <Input
            type="text"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            placeholder="Ej. 1234ABC"
            uppercase
            trimOnBlur
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Desde</label>
          <Input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Hasta</label>
          <Input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </div>
        <div className="flex items-end gap-2">
          <Button variant="primary" size="sm" type="button" onClick={handleBuscar} disabled={cargando}>
            Buscar
          </Button>
          <Button variant="outline-secondary" size="sm" type="button" onClick={handleLimpiar} disabled={cargando}>
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  )
}
