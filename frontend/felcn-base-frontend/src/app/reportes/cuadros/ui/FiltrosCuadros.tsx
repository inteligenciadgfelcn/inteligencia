'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import { Icono } from '@/components/Icono'
import { SiiiLookupsService } from '@/services/parametricas/SiiiLookupsService'

// ─── Tipos de búsqueda ────────────────────────────────────────────────────────

export type BusquedaCuadro =
  | { tipo: 'servicio';       codServicio: string }
  | { tipo: 'fecha';          fechaInicio: string; fechaFin: string }
  | { tipo: 'tipo-droga';     idTipoDroga: number;      fechaInicio: string; fechaFin: string }
  | { tipo: 'tipo-operativo'; idTipoOperacion: number;  fechaInicio: string; fechaFin: string }
  | { tipo: 'relevancia';     idTipoRelevancia: number; fechaInicio: string; fechaFin: string }
  | { tipo: 'persona';        nombres: string; apellidoPaterno: string; apellidoMaterno: string; apellidoEsposo: string }

interface FiltrosCuadrosProps {
  onBuscar: (busqueda: BusquedaCuadro) => void
  onLimpiar?: () => void
  cargando: boolean
}

// ─── Helpers de fecha ─────────────────────────────────────────────────────────

function hoy(): string {
  return new Date().toISOString().split('T')[0]
}

function hace10Dias(): string {
  const d = new Date()
  d.setDate(d.getDate() - 10)
  return d.toISOString().split('T')[0]
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function FiltrosCuadros({ onBuscar, onLimpiar, cargando }: FiltrosCuadrosProps) {
  const [fechaInicio, setFechaInicio] = useState(hace10Dias)
  const [fechaFin, setFechaFin]       = useState(hoy)

  const [codServicio, setCodServicio] = useState('')

  const [idTipoDroga,    setIdTipoDroga]    = useState<number | ''>('')
  const [idTipoOperacion, setIdTipoOperacion] = useState<number | ''>('')
  const [idTipoRelevancia, setIdTipoRelevancia] = useState<number | ''>('')

  // ── Filtro: Por Nombre de Persona ───────────────────────────────────────────
  const [nombres, setNombres] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [apellidoEsposo, setApellidoEsposo] = useState('')

  const [opTiposDroga, setOpTiposDroga] = useState<SelectOption[]>([])
  const [opTiposOp,    setOpTiposOp]    = useState<SelectOption[]>([])
  const [opRelevancia, setOpRelevancia] = useState<SelectOption[]>([])

  useEffect(() => {
    void Promise.all([
      SiiiLookupsService.obtenerTiposDroga(),
      SiiiLookupsService.obtenerTiposOperacion(),
      SiiiLookupsService.obtenerTiposRelevancia(),
    ]).then(([resTD, resTO, resTR]) => {
      setOpTiposDroga(resTD.datos.map((td: any) => ({ value: td.id as number, label: td.descripcion as string })))
      setOpTiposOp(resTO.datos.map((to) => ({ value: (to as any).id, label: (to as any).descripcion })))
      setOpRelevancia(resTR.datos.map((tr) => ({ value: (tr as any).id, label: (tr as any).descripcion })))
    })
  }, [])

  const limpiar = () => {
    setCodServicio('')
    setFechaInicio(hace10Dias())
    setFechaFin(hoy())
    setIdTipoDroga('')
    setIdTipoOperacion('')
    setIdTipoRelevancia('')
    setNombres('')
    setApellidoPaterno('')
    setApellidoMaterno('')
    setApellidoEsposo('')
    if (onLimpiar) {
      onLimpiar()
    }
  }

  const hayDatoPersona = nombres.trim() || apellidoPaterno.trim() || apellidoMaterno.trim() || apellidoEsposo.trim()

  return (
    <div className="panel space-y-5">

      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-3">
        <div className="flex items-center gap-2">
          <Icono className="w-5 h-5 text-primary">manage_search</Icono>
          <h3 className="text-base font-bold text-dark dark:text-white-light">
            Filtros de Búsqueda — Cuadro de Resultados
          </h3>
        </div>
        <Button variant="outline-danger" size="sm" onClick={limpiar} disabled={cargando}>
          <Icono className="w-4 h-4 mr-1">refresh</Icono>
          Limpiar
        </Button>
      </div>

      {/* Rango de fechas compartido */}
      <div className="rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 px-4 py-3">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">
          Rango de Fechas (compartido)
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Fecha Inicio</label>
            <Input size="sm" type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Fecha Fin</label>
            <Input size="sm" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          </div>
          <Button
            variant="primary" size="sm"
            disabled={!fechaInicio || !fechaFin || cargando}
            onClick={() => onBuscar({ tipo: 'fecha', fechaInicio, fechaFin })}
          >
            <Icono className="w-4 h-4 mr-1">date_range</Icono>
            Buscar por Fecha
          </Button>
        </div>
      </div>

      {/* Fila 2: Por Código de Servicio | Por Tipo de Droga */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Por código de servicio */}
        <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Por Código de Servicio
          </p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                size="sm"
                value={codServicio}
                onChange={(e) => setCodServicio(e.target.value)}
                placeholder="Ej: SRV-2024-001"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && codServicio.trim())
                    onBuscar({ tipo: 'servicio', codServicio: codServicio.trim() })
                }}
              />
            </div>
            <Button
              variant="secondary" size="sm"
              disabled={!codServicio.trim() || cargando}
              onClick={() => onBuscar({ tipo: 'servicio', codServicio: codServicio.trim() })}
            >
              <Icono className="w-4 h-4">search</Icono>
            </Button>
          </div>
        </div>

        {/* Por tipo de droga */}
        <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Por Tipo de Droga
          </p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                size="sm"
                value={idTipoDroga}
                onChange={(e) => setIdTipoDroga(e.target.value ? Number(e.target.value) : '')}
                options={opTiposDroga}
                placeholder="Seleccione tipo..."
              />
            </div>
            <Button
              variant="warning" size="sm"
              disabled={!idTipoDroga || !fechaInicio || !fechaFin || cargando}
              onClick={() =>
                onBuscar({ tipo: 'tipo-droga', idTipoDroga: idTipoDroga as number, fechaInicio, fechaFin })
              }
            >
              <Icono className="w-4 h-4 mr-1">science</Icono>
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {/* Fila 3: Por Tipo de Operativo | Por Tipo de Relevancia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Por tipo de operativo */}
        <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Por Tipo de Operativo
          </p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                size="sm"
                value={idTipoOperacion}
                onChange={(e) => setIdTipoOperacion(e.target.value ? Number(e.target.value) : '')}
                options={opTiposOp}
                placeholder="Seleccione tipo..."
              />
            </div>
            <Button
              variant="info" size="sm"
              disabled={!idTipoOperacion || !fechaInicio || !fechaFin || cargando}
              onClick={() =>
                onBuscar({ tipo: 'tipo-operativo', idTipoOperacion: idTipoOperacion as number, fechaInicio, fechaFin })
              }
            >
              <Icono className="w-4 h-4 mr-1">assignment</Icono>
              Buscar
            </Button>
          </div>
        </div>

        {/* Por tipo de relevancia */}
        <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Por Tipo de Relevancia
          </p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Select
                size="sm"
                value={idTipoRelevancia}
                onChange={(e) => setIdTipoRelevancia(e.target.value ? Number(e.target.value) : '')}
                options={opRelevancia}
                placeholder="Seleccione relevancia..."
              />
            </div>
            <Button
              variant="info" size="sm"
              disabled={!idTipoRelevancia || !fechaInicio || !fechaFin || cargando}
              onClick={() =>
                onBuscar({ tipo: 'relevancia', idTipoRelevancia: idTipoRelevancia as number, fechaInicio, fechaFin })
              }
            >
              <Icono className="w-4 h-4 mr-1">star_rate</Icono>
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {/* ── Fila 4: Por Nombre de Persona ───────────────────────────────────── */}
      <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] px-4 py-3 space-y-2">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Por Nombre de Persona
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Nombres</label>
            <Input
              size="sm"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              placeholder="Nombres"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Ap. Paterno</label>
            <Input
              size="sm"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              placeholder="Apellido paterno"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Ap. Materno</label>
            <Input
              size="sm"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              placeholder="Apellido materno"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Ap. Esposo/a</label>
            <Input
              size="sm"
              value={apellidoEsposo}
              onChange={(e) => setApellidoEsposo(e.target.value)}
              placeholder="Apellido esposo"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap pt-1">
          <Button
            variant="success"
            size="sm"
            disabled={!hayDatoPersona || cargando}
            onClick={() =>
              onBuscar({
                tipo: 'persona',
                nombres: nombres.trim(),
                apellidoPaterno: apellidoPaterno.trim(),
                apellidoMaterno: apellidoMaterno.trim(),
                apellidoEsposo: apellidoEsposo.trim(),
              })
            }
          >
            <Icono className="w-4 h-4 mr-1">person_search</Icono>
            Buscar Persona
          </Button>
        </div>
      </div>
    </div>
  )
}
