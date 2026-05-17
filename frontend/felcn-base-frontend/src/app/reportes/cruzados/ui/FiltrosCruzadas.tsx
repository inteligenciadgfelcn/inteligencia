'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import { Icono } from '@/components/Icono'
import { SiiiLookupsService } from '@/services/parametricas/SiiiLookupsService'

// ─── Tipos de búsqueda ────────────────────────────────────────────────────────

export type BusquedaCruzada =
  | { tipo: 'fecha';          fechaInicio: string; fechaFin: string }
  | { tipo: 'caso';           numeroCaso: string }
  | { tipo: 'tipo-droga';     idTipoDroga: number;     fechaInicio: string; fechaFin: string }
  | { tipo: 'estado-droga';   idEstadoDroga: number;   fechaInicio: string; fechaFin: string }
  | { tipo: 'tipo-operativo'; idTipoOperacion: number; fechaInicio: string; fechaFin: string }
  | { tipo: 'relevancia';     idTipoRelevancia: number; fechaInicio: string; fechaFin: string }
  | { tipo: 'aprehendido';    nombres: string; apellidoPaterno: string; apellidoMaterno: string; apellidoEsposo: string }
  | { tipo: 'arrestado';      nombres: string; apellidoPaterno: string; apellidoMaterno: string; apellidoEsposo: string }

interface FiltrosCruzadasProps {
  onBuscar: (busqueda: BusquedaCruzada) => void
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

export function FiltrosCruzadas({ onBuscar, cargando }: FiltrosCruzadasProps) {
  // ── Estado compartido de fechas (usado por 5 de los 8 filtros) ──────────────
  const [fechaInicio, setFechaInicio] = useState(hace10Dias)
  const [fechaFin, setFechaFin] = useState(hoy)

  // ── Filtro: Por Caso ────────────────────────────────────────────────────────
  const [numeroCaso, setNumeroCaso] = useState('')

  // ── Filtro: Por Tipo / Estado de Droga ─────────────────────────────────────
  const [idTipoDroga, setIdTipoDroga] = useState<number | ''>('')
  const [idEstadoDroga, setIdEstadoDroga] = useState<number | ''>('')
  const [opTiposDroga, setOpTiposDroga] = useState<SelectOption[]>([])
  const [opEstadosDroga, setOpEstadosDroga] = useState<SelectOption[]>([])
  const [cargandoEstados, setCargandoEstados] = useState(false)

  // ── Filtro: Por Tipo de Operativo ───────────────────────────────────────────
  const [idTipoOperacion, setIdTipoOperacion] = useState<number | ''>('')
  const [opTiposOp, setOpTiposOp] = useState<SelectOption[]>([])

  // ── Filtro: Por Relevancia ──────────────────────────────────────────────────
  const [idTipoRelevancia, setIdTipoRelevancia] = useState<number | ''>('')
  const [opRelevancia, setOpRelevancia] = useState<SelectOption[]>([])

  // ── Filtro: Por Persona (aprehendido / arrestado) ───────────────────────────
  const [nombres, setNombres] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [apellidoEsposo, setApellidoEsposo] = useState('')

  // ── Carga de combos estáticos al montar ─────────────────────────────────────
  useEffect(() => {
    void Promise.all([
      SiiiLookupsService.obtenerTiposDroga(),
      SiiiLookupsService.obtenerTiposOperacion(),
      SiiiLookupsService.obtenerTiposRelevancia(),
    ]).then(([resTD, resTO, resTR]) => {
      setOpTiposDroga(
        resTD.datos.map((td: any) => ({ value: td.id as number, label: td.descripcion as string }))
      )
      setOpTiposOp(
        resTO.datos.map((to) => ({ value: (to as any).id, label: (to as any).descripcion }))
      )
      setOpRelevancia(
        resTR.datos.map((tr) => ({ value: (tr as any).id, label: (tr as any).descripcion }))
      )
    })
  }, [])

  // ── Carga cascada de estados-droga al cambiar tipo-droga ────────────────────
  useEffect(() => {
    if (!idTipoDroga) {
      setOpEstadosDroga([])
      setIdEstadoDroga('')
      return
    }
    setCargandoEstados(true)
    setIdEstadoDroga('')
    void SiiiLookupsService.obtenerEstadosDroga(idTipoDroga)
      .then((res) => {
        setOpEstadosDroga(res.datos.map((ed) => ({ value: ed['id'] as number, label: ed['descripcion'] as string })))
      })
      .finally(() => setCargandoEstados(false))
  }, [idTipoDroga])

  // ── Limpiar todo ─────────────────────────────────────────────────────────────
  const limpiar = () => {
    setFechaInicio(hace10Dias())
    setFechaFin(hoy())
    setNumeroCaso('')
    setIdTipoDroga('')
    setIdEstadoDroga('')
    setOpEstadosDroga([])
    setIdTipoOperacion('')
    setIdTipoRelevancia('')
    setNombres('')
    setApellidoPaterno('')
    setApellidoMaterno('')
    setApellidoEsposo('')
  }

  // ── Validación de campos de persona ──────────────────────────────────────────
  const hayDatoPersona = nombres.trim() || apellidoPaterno.trim() || apellidoMaterno.trim() || apellidoEsposo.trim()

  return (
    <div className="panel space-y-5">

      {/* ── Cabecera del panel ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-3">
        <div className="flex items-center gap-2">
          <Icono className="w-5 h-5 text-primary">manage_search</Icono>
          <h3 className="text-base font-bold text-dark dark:text-white-light">
            Filtros de Búsqueda Cruzada
          </h3>
        </div>
        <Button variant="outline-danger" size="sm" onClick={limpiar} disabled={cargando}>
          <Icono className="w-4 h-4 mr-1">refresh</Icono>
          Limpiar
        </Button>
      </div>

      {/* ── Campos de fecha compartidos ────────────────────────────────────── */}
      <div className="rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 px-4 py-3">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-wide">
          Rango de Fechas (compartido)
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
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={!fechaInicio || !fechaFin || cargando}
            onClick={() => onBuscar({ tipo: 'fecha', fechaInicio, fechaFin })}
          >
            <Icono className="w-4 h-4 mr-1">date_range</Icono>
            Buscar por Fecha
          </Button>
        </div>
      </div>

      {/* ── Fila 2: Por Caso | Por Tipo de Droga ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Por número de caso */}
        <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Por Número de Caso
          </p>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                size="sm"
                value={numeroCaso}
                onChange={(e) => setNumeroCaso(e.target.value)}
                placeholder="Ej: LP-A-1/25"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && numeroCaso.trim())
                    onBuscar({ tipo: 'caso', numeroCaso: numeroCaso.trim() })
                }}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={!numeroCaso.trim() || cargando}
              onClick={() => onBuscar({ tipo: 'caso', numeroCaso: numeroCaso.trim() })}
            >
              <Icono className="w-4 h-4">search</Icono>
            </Button>
          </div>
        </div>

        {/* Por tipo / estado de droga */}
        <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Por Tipo / Estado de Droga
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[130px]">
              <label className="mb-1 block text-xs text-gray-500">Tipo</label>
              <Select
                size="sm"
                value={idTipoDroga}
                onChange={(e) => setIdTipoDroga(e.target.value ? Number(e.target.value) : '')}
                options={opTiposDroga}
                placeholder="Seleccione..."
              />
            </div>
            <div className="flex-1 min-w-[130px]">
              <label className="mb-1 block text-xs text-gray-500">
                Estado {cargandoEstados && <span className="text-primary animate-pulse">...</span>}
              </label>
              <Select
                size="sm"
                value={idEstadoDroga}
                onChange={(e) => setIdEstadoDroga(e.target.value ? Number(e.target.value) : '')}
                options={opEstadosDroga}
                placeholder="Seleccione..."
                disabled={!idTipoDroga || cargandoEstados}
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="warning"
              size="sm"
              disabled={!idTipoDroga || !fechaInicio || !fechaFin || cargando}
              onClick={() =>
                onBuscar({ tipo: 'tipo-droga', idTipoDroga: idTipoDroga as number, fechaInicio, fechaFin })
              }
            >
              <Icono className="w-4 h-4 mr-1">science</Icono>
              Por Tipo
            </Button>
            <Button
              variant="warning"
              size="sm"
              disabled={!idEstadoDroga || !fechaInicio || !fechaFin || cargando}
              onClick={() =>
                onBuscar({ tipo: 'estado-droga', idEstadoDroga: idEstadoDroga as number, fechaInicio, fechaFin })
              }
            >
              <Icono className="w-4 h-4 mr-1">biotech</Icono>
              Por Estado
            </Button>
          </div>
        </div>
      </div>

      {/* ── Fila 3: Por Tipo Operativo | Por Relevancia ────────────────────── */}
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
              variant="info"
              size="sm"
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
              variant="info"
              size="sm"
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

      {/* ── Fila 4: Por Persona (aprehendido / arrestado) ───────────────────── */}
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
                tipo: 'aprehendido',
                nombres: nombres.trim(),
                apellidoPaterno: apellidoPaterno.trim(),
                apellidoMaterno: apellidoMaterno.trim(),
                apellidoEsposo: apellidoEsposo.trim(),
              })
            }
          >
            <Icono className="w-4 h-4 mr-1">person_search</Icono>
            Buscar Aprehendido
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!hayDatoPersona || cargando}
            onClick={() =>
              onBuscar({
                tipo: 'arrestado',
                nombres: nombres.trim(),
                apellidoPaterno: apellidoPaterno.trim(),
                apellidoMaterno: apellidoMaterno.trim(),
                apellidoEsposo: apellidoEsposo.trim(),
              })
            }
          >
            <Icono className="w-4 h-4 mr-1">manage_accounts</Icono>
            Buscar Arrestado
          </Button>
        </div>
      </div>
    </div>
  )
}
