'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import { Icono } from '@/components/Icono'
import { PersonasLookupsService } from '../services/lookups.service'
import type {
  FiltrosVariablesCruzadas,
  FiliacionValor,
  FormatoExportacion,
} from '../types/personasReporte.types'

// ─── Props ────────────────────────────────────────────────────────────────────

interface FiltrosPersonasProps {
  onBuscar: (filtros: FiltrosVariablesCruzadas) => void
  onLimpiar?: () => void
  onExportar: (formato: FormatoExportacion, filtros: FiltrosVariablesCruzadas) => void
  cargando: boolean
  exportando: FormatoExportacion | null
}

// ─── Opciones estáticas ───────────────────────────────────────────────────────

const GENERO_OPTS: SelectOption[] = [
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'FEMENINO', label: 'Femenino' },
]

const VIVO_OPTS: SelectOption[] = [
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
]

const FILIACION_OPTS: { value: FiliacionValor; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'FILIADO', label: 'Filiado' },
  { value: 'SIN_FILIAR', label: 'Sin filiar' },
]

// ─── Sección colapsable ───────────────────────────────────────────────────────

function SeccionFiltro({
  titulo,
  icono,
  colorClass,
  children,
  defaultOpen = true,
}: {
  titulo: string
  icono: string
  colorClass: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [abierto, setAbierto] = useState(defaultOpen)
  return (
    <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierto(v => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-left ${colorClass}`}
      >
        <div className="flex items-center gap-2">
          <Icono className="w-4 h-4">{icono}</Icono>
          <span className="text-xs font-semibold uppercase tracking-wide">{titulo}</span>
        </div>
        <Icono className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`}>expand_more</Icono>
      </button>
      {abierto && <div className="px-4 py-3">{children}</div>}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function FiltrosPersonas({
  onBuscar,
  onLimpiar,
  onExportar,
  cargando,
  exportando,
}: FiltrosPersonasProps) {

  const fieldLabel = 'mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400'

  // ── Sección 1: Caso y operativo ─────────────────────────────────────────────
  const [numeroCaso, setNumeroCaso] = useState('')
  const [nombreCaso, setNombreCaso] = useState('')
  const [cud, setCud] = useState('')
  const [idDepartamento, setIdDepartamento] = useState('')
  const [idUnidad, setIdUnidad] = useState('')
  const [idDistrito, setIdDistrito] = useState('')
  const [idGrupo, setIdGrupo] = useState('')
  const [fechaOperativoDesde, setFechaOperativoDesde] = useState('')
  const [fechaOperativoHasta, setFechaOperativoHasta] = useState('')

  // ── Sección 2: Datos persona ────────────────────────────────────────────────
  const [nombres, setNombres] = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [apellidoEsposo, setApellidoEsposo] = useState('')
  const [idPais, setIdPais] = useState('')
  const [genero, setGenero] = useState('')
  const [fechaNacimientoDesde, setFechaNacimientoDesde] = useState('')
  const [fechaNacimientoHasta, setFechaNacimientoHasta] = useState('')
  const [numeroDocumento, setNumeroDocumento] = useState('')
  const [direccion, setDireccion] = useState('')
  const [fechaRegistroDesde, setFechaRegistroDesde] = useState('')
  const [fechaRegistroHasta, setFechaRegistroHasta] = useState('')
  const [filiacion, setFiliacion] = useState<FiliacionValor>('TODOS')

  // ── Sección 3: Datos filiados ───────────────────────────────────────────────
  const [idEstadoCivil, setIdEstadoCivil] = useState('')
  const [estaVivo, setEstaVivo] = useState('')
  const [fechaIngresoSiiDesde, setFechaIngresoSiiDesde] = useState('')
  const [fechaIngresoSiiHasta, setFechaIngresoSiiHasta] = useState('')

  // ── Opciones de combos ──────────────────────────────────────────────────────
  const [opDepartamentos, setOpDepartamentos] = useState<SelectOption[]>([])
  const [opUnidades, setOpUnidades] = useState<SelectOption[]>([])
  const [opDistritos, setOpDistritos] = useState<SelectOption[]>([])
  const [opGrupos, setOpGrupos] = useState<SelectOption[]>([])
  const [opPaises, setOpPaises] = useState<SelectOption[]>([])
  const [opEstadosCiviles, setOpEstadosCiviles] = useState<SelectOption[]>([])
  const [cargandoDistritos, setCargandoDistritos] = useState(false)
  const [cargandoGrupos, setCargandoGrupos] = useState(false)

  // ── Carga inicial de combos estáticos ───────────────────────────────────────
  useEffect(() => {
    void Promise.all([
      PersonasLookupsService.obtenerDepartamentos(),
      PersonasLookupsService.obtenerUnidades(),
      PersonasLookupsService.obtenerPaises(),
      PersonasLookupsService.obtenerEstadosCiviles(),
    ]).then(([deptos, unidades, paises, estadosCiviles]) => {
      setOpDepartamentos(deptos.map(d => ({ value: d.idDepartamento, label: d.descripcion })))
      setOpUnidades(unidades.map(u => ({ value: u.id, label: `${u.descripcion}${u.abreviatura ? ` (${u.abreviatura})` : ''}` })))
      setOpPaises(paises.map(p => ({ value: p.idPais, label: p.descripcion })))
      setOpEstadosCiviles(estadosCiviles.map(e => ({ value: e.idEstadoCivil, label: e.descripcion })))
    })
  }, [])

  // ── Cascade: Unidad → Distrito → Grupo ──────────────────────────────────────
  useEffect(() => {
    setIdDistrito(''); setIdGrupo('')
    setOpDistritos([]); setOpGrupos([])
    if (!idUnidad) return
    setCargandoDistritos(true)
    void PersonasLookupsService.obtenerDistritales(Number(idUnidad))
      .then(r => setOpDistritos(r.map(x => ({ value: x.id, label: x.descripcion }))))
      .finally(() => setCargandoDistritos(false))
  }, [idUnidad])

  useEffect(() => {
    setIdGrupo(''); setOpGrupos([])
    if (!idDistrito) return
    setCargandoGrupos(true)
    void PersonasLookupsService.obtenerGrupos(Number(idDistrito))
      .then(r => setOpGrupos(r.map(x => ({ value: x.id, label: x.descripcion }))))
      .finally(() => setCargandoGrupos(false))
  }, [idDistrito])

  // ── Limpiar todo ─────────────────────────────────────────────────────────────
  const limpiar = () => {
    setNumeroCaso(''); setNombreCaso(''); setCud('')
    setIdDepartamento(''); setIdUnidad(''); setIdDistrito(''); setIdGrupo('')
    setFechaOperativoDesde(''); setFechaOperativoHasta('')
    setNombres(''); setApellidoPaterno(''); setApellidoMaterno(''); setApellidoEsposo('')
    setIdPais(''); setGenero('')
    setFechaNacimientoDesde(''); setFechaNacimientoHasta('')
    setNumeroDocumento(''); setDireccion('')
    setFechaRegistroDesde(''); setFechaRegistroHasta('')
    setFiliacion('TODOS')
    setIdEstadoCivil(''); setEstaVivo('')
    setFechaIngresoSiiDesde(''); setFechaIngresoSiiHasta('')
    onLimpiar?.()
  }

  // ── Params actuales ──────────────────────────────────────────────────────────
  const toNumero = (v: string): number | undefined =>
    v === '' ? undefined : Number(v)

  const filtrosActuales = (): FiltrosVariablesCruzadas => {
    const filtros: FiltrosVariablesCruzadas = {
      numeroCaso: numeroCaso || undefined,
      nombreCaso: nombreCaso || undefined,
      cud: cud || undefined,
      nombres: nombres || undefined,
      apellidoPaterno: apellidoPaterno || undefined,
      apellidoMaterno: apellidoMaterno || undefined,
      apellidoEsposo: apellidoEsposo || undefined,
      idPais: toNumero(idPais),
      genero: (genero || undefined) as 'MASCULINO' | 'FEMENINO' | undefined,
      fechaNacimientoDesde: fechaNacimientoDesde || undefined,
      fechaNacimientoHasta: fechaNacimientoHasta || undefined,
      numeroDocumento: numeroDocumento || undefined,
      direccion: direccion || undefined,
      fechaRegistroDesde: fechaRegistroDesde || undefined,
      fechaRegistroHasta: fechaRegistroHasta || undefined,
      fechaOperativoDesde: fechaOperativoDesde || undefined,
      fechaOperativoHasta: fechaOperativoHasta || undefined,
      idUnidad: toNumero(idUnidad),
      idGrupo: toNumero(idGrupo),
      idDistrito: toNumero(idDistrito),
      idDepartamento: toNumero(idDepartamento),
      filiacion: filiacion || 'TODOS',
      idEstadoCivil: toNumero(idEstadoCivil),
      estaVivo: estaVivo === '' ? undefined : estaVivo === 'true',
      fechaIngresoSiiDesde: fechaIngresoSiiDesde || undefined,
      fechaIngresoSiiHasta: fechaIngresoSiiHasta || undefined,
    }

    return Object.fromEntries(
      Object.entries(filtros).filter(([, v]) => v !== undefined)
    ) as FiltrosVariablesCruzadas
  }

  const buscar = () => { onBuscar(filtrosActuales()) }
  const exportar = (formato: FormatoExportacion) => onExportar(formato, filtrosActuales())

  const verSoloFiliados = filiacion === 'FILIADO'

  const BOTONES_EXPORTAR: { formato: FormatoExportacion; label: string; colorClass: string }[] = [
    { formato: 'pdf', label: 'PDF', colorClass: 'bg-danger/10 hover:bg-danger/20 text-danger border-danger/20' },
    { formato: 'csv', label: 'CSV', colorClass: 'bg-info/10 hover:bg-info/20 text-info border-info/20' },
    { formato: 'excel', label: 'EXCEL', colorClass: 'bg-success/10 hover:bg-success/20 text-success border-success/20' },
    { formato: 'json', label: 'JSON', colorClass: 'bg-secondary/10 hover:bg-secondary/20 text-secondary border-secondary/20' },
  ]

  return (
    <div className="panel space-y-4">

      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-3">
        <div className="flex items-center gap-2">
          <Icono className="w-5 h-5 text-primary">tune</Icono>
          <h3 className="text-base font-bold text-dark dark:text-white-light">
            Búsqueda de Personas — Variables Cruzadas
          </h3>
        </div>
        <Button variant="outline-danger" size="sm" onClick={limpiar} disabled={cargando}>
          <Icono className="w-4 h-4 mr-1">refresh</Icono>
          Limpiar
        </Button>
      </div>

      {/* ── Sección 1: Caso y operativo ─────────────────────────────────────── */}
      <SeccionFiltro titulo="Caso y Operativo" icono="assignment"
        colorClass="bg-blue-50/70 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className={fieldLabel}>Nro. de Caso</label>
            <Input size="sm" uppercase value={numeroCaso} onChange={e => setNumeroCaso(e.target.value)} placeholder="Ej: LP-G-2/26" />
          </div>
          <div>
            <label className={fieldLabel}>Nombre del Caso</label>
            <Input size="sm" uppercase value={nombreCaso} onChange={e => setNombreCaso(e.target.value)} placeholder="Ej: Operativo 6 de Marzo" />
          </div>
          <div>
            <label className={fieldLabel}>CUD</label>
            <Input size="sm" uppercase value={cud} onChange={e => setCud(e.target.value)} placeholder="Ej: CUD-12345678" />
          </div>
          <div>
            <label className={fieldLabel}>Departamento</label>
            <Select size="sm" value={idDepartamento}
              onChange={e => setIdDepartamento(e.target.value)}
              options={opDepartamentos} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Unidad</label>
            <Select size="sm" value={idUnidad}
              onChange={e => setIdUnidad(e.target.value)}
              options={opUnidades} placeholder="Todas..." />
          </div>
          <div>
            <label className={fieldLabel}>
              Distrito {cargandoDistritos && <span className="text-primary animate-pulse text-xs">...</span>}
            </label>
            <Select size="sm" value={idDistrito}
              onChange={e => setIdDistrito(e.target.value)}
              options={opDistritos} placeholder="Seleccione unidad..." disabled={!idUnidad || cargandoDistritos} />
          </div>
          <div>
            <label className={fieldLabel}>
              Grupo {cargandoGrupos && <span className="text-primary animate-pulse text-xs">...</span>}
            </label>
            <Select size="sm" value={idGrupo}
              onChange={e => setIdGrupo(e.target.value)}
              options={opGrupos} placeholder="Seleccione distrito..." disabled={!idDistrito || cargandoGrupos} />
          </div>
          <div>
            <label className={fieldLabel}>Fecha Operativo Desde</label>
            <Input size="sm" type="date" value={fechaOperativoDesde} onChange={e => setFechaOperativoDesde(e.target.value)} />
          </div>
          <div>
            <label className={fieldLabel}>Fecha Operativo Hasta</label>
            <Input size="sm" type="date" value={fechaOperativoHasta} onChange={e => setFechaOperativoHasta(e.target.value)} />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 2: Datos persona ────────────────────────────────────────── */}
      <SeccionFiltro titulo="Datos de la Persona" icono="person"
        colorClass="bg-teal-50/70 dark:bg-teal-900/10 text-teal-800 dark:text-teal-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className={fieldLabel}>Nombres</label>
            <Input size="sm" uppercase value={nombres} onChange={e => setNombres(e.target.value)} placeholder="Nombres" />
          </div>
          <div>
            <label className={fieldLabel}>Apellido Paterno</label>
            <Input size="sm" uppercase value={apellidoPaterno} onChange={e => setApellidoPaterno(e.target.value)} placeholder="Ap. Paterno" />
          </div>
          <div>
            <label className={fieldLabel}>Apellido Materno</label>
            <Input size="sm" uppercase value={apellidoMaterno} onChange={e => setApellidoMaterno(e.target.value)} placeholder="Ap. Materno" />
          </div>
          <div>
            <label className={fieldLabel}>Apellido Esposo</label>
            <Input size="sm" uppercase value={apellidoEsposo} onChange={e => setApellidoEsposo(e.target.value)} placeholder="Ap. Esposo" />
          </div>
          <div>
            <label className={fieldLabel}>País</label>
            <Select size="sm" value={idPais}
              onChange={e => setIdPais(e.target.value)}
              options={opPaises} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Género</label>
            <Select size="sm" value={genero}
              onChange={e => setGenero(e.target.value)}
              options={GENERO_OPTS} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Fecha Nacimiento Desde</label>
            <Input size="sm" type="date" value={fechaNacimientoDesde} onChange={e => setFechaNacimientoDesde(e.target.value)} />
          </div>
          <div>
            <label className={fieldLabel}>Fecha Nacimiento Hasta</label>
            <Input size="sm" type="date" value={fechaNacimientoHasta} onChange={e => setFechaNacimientoHasta(e.target.value)} />
          </div>
          <div>
            <label className={fieldLabel}>Nro. Documento</label>
            <Input size="sm" uppercase value={numeroDocumento} onChange={e => setNumeroDocumento(e.target.value)} placeholder="CI / Pasaporte" />
          </div>
          <div>
            <label className={fieldLabel}>Dirección</label>
            <Input size="sm" uppercase value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Ej: AV. BOLIVIA" />
          </div>
          <div>
            <label className={fieldLabel}>Fecha Registro Desde</label>
            <Input size="sm" type="date" value={fechaRegistroDesde} onChange={e => setFechaRegistroDesde(e.target.value)} />
          </div>
          <div>
            <label className={fieldLabel}>Fecha Registro Hasta</label>
            <Input size="sm" type="date" value={fechaRegistroHasta} onChange={e => setFechaRegistroHasta(e.target.value)} />
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <label className={`${fieldLabel} mb-2`}>Filiación</label>
            <div className="flex items-center gap-6">
              {FILIACION_OPTS.map(opt => (
                <label key={opt.value} className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="filiacion"
                    className="form-radio text-primary"
                    checked={filiacion === opt.value}
                    onChange={() => setFiliacion(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 3: Datos filiados (solo Filiado) ────────────────────────── */}
      {verSoloFiliados && (
        <SeccionFiltro titulo="Datos de Personas Filiadas" icono="badge"
          colorClass="bg-indigo-50/70 dark:bg-indigo-900/10 text-indigo-800 dark:text-indigo-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={fieldLabel}>Estado Civil</label>
              <Select size="sm" value={idEstadoCivil}
                onChange={e => setIdEstadoCivil(e.target.value)}
                options={opEstadosCiviles} placeholder="Todos..." />
            </div>
            <div>
              <label className={fieldLabel}>Estado Vivo</label>
              <Select size="sm" value={estaVivo}
                onChange={e => setEstaVivo(e.target.value)}
                options={VIVO_OPTS} placeholder="Todos..." />
            </div>
            <div>
              <label className={fieldLabel}>Fecha Ingreso SII Desde</label>
              <Input size="sm" type="date" value={fechaIngresoSiiDesde} onChange={e => setFechaIngresoSiiDesde(e.target.value)} />
            </div>
            <div>
              <label className={fieldLabel}>Fecha Ingreso SII Hasta</label>
              <Input size="sm" type="date" value={fechaIngresoSiiHasta} onChange={e => setFechaIngresoSiiHasta(e.target.value)} />
            </div>
          </div>
        </SeccionFiltro>
      )}

      {/* ── Botones: exportar + buscar ──────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {BOTONES_EXPORTAR.map(btn => (
            <button
              key={btn.formato}
              type="button"
              onClick={() => exportar(btn.formato)}
              disabled={cargando || exportando !== null}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all disabled:opacity-50 disabled:pointer-events-none ${btn.colorClass}`}
            >
              {exportando === btn.formato ? (
                <Icono className="w-4 h-4 shrink-0 animate-spin">refresh</Icono>
              ) : (
                <Icono className="w-4 h-4 shrink-0">download</Icono>
              )}
              {exportando === btn.formato ? 'Exportando...' : `Exportar ${btn.label}`}
            </button>
          ))}
        </div>

        <Button variant="primary" size="md" onClick={buscar} disabled={cargando}>
          {cargando
            ? <><Icono className="w-4 h-4 mr-2 animate-spin">refresh</Icono>Buscando...</>
            : <><Icono className="w-4 h-4 mr-2">search</Icono>Buscar Personas</>}
        </Button>
      </div>

    </div>
  )
}