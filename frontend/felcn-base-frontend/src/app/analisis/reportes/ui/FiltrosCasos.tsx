'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { FiltrosCasosReporte } from '@/services/analisis'

interface FiltrosCasosProps {
  onBuscar: (filtros: FiltrosCasosReporte) => void
  cargando?: boolean
}

export function FiltrosCasos({ onBuscar, cargando }: FiltrosCasosProps) {
  const [nombre, setNombre] = useState('')
  const [estado, setEstado] = useState('')
  const [antecedente, setAntecedente] = useState('')

  const handleBuscar = () => {
    onBuscar({
      nombre: nombre.trim() || undefined,
      estado: estado.trim() || undefined,
      antecedente: antecedente.trim() || undefined,
    })
  }

  const handleLimpiar = () => {
    setNombre('')
    setEstado('')
    setAntecedente('')
    onBuscar({})
  }

  return (
    <div className="panel px-5 py-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre del Caso</label>
          <Input
            type="text"
            uppercase
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Buscar por nombre..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Estado</label>
          <Input
            type="text"
            uppercase
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Buscar por estado..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Antecedente</label>
          <Input
            type="text"
            uppercase
            value={antecedente}
            onChange={(e) => setAntecedente(e.target.value)}
            placeholder="Buscar por antecedente..."
          />
        </div>
        <div className="flex items-end gap-2">
          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={handleBuscar}
            disabled={cargando}
          >
            Buscar
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            type="button"
            onClick={handleLimpiar}
            disabled={cargando}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  )
}
