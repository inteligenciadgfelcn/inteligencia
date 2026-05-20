'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import { Icono } from '@/components/Icono'
import { SiiiLookupsService } from '@/services/parametricas/SiiiLookupsService'
import type { FiltrosAvanzadosParams } from '@/services/reportes/CruzadosAllService'

// ─── Props ────────────────────────────────────────────────────────────────────

interface FiltrosAvanzadosProps {
  onBuscar: (filtros: FiltrosAvanzadosParams) => void
  onLimpiar?: () => void
  cargando: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hoy() { return new Date().toISOString().split('T')[0] }
function hace30Dias() {
  const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]
}

const BOOL_OPTS: SelectOption[] = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Sí' },
  { value: 'false', label: 'No' },
]

// ─── Sección colapsable ───────────────────────────────────────────────────────

function SeccionFiltro({
  titulo, icono, colorClass, children, defaultOpen = true,
}: {
  titulo: string; icono: string; colorClass: string; children: React.ReactNode; defaultOpen?: boolean
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

export function FiltrosAvanzados({ onBuscar, onLimpiar, cargando }: FiltrosAvanzadosProps) {

  // ── Asignación / Caso ───────────────────────────────────────────────────────
  const [fechaInicio, setFechaInicio]       = useState(hace30Dias)
  const [fechaFin, setFechaFin]             = useState(hoy)
  const [codigoServicio, setCodigoServicio] = useState('')
  const [numeroCaso, setNumeroCaso]         = useState('')
  const [nombreCaso, setNombreCaso]         = useState('')
  const [numeroOperativo, setNumeroOperativo] = useState('')
  const [ianus, setIanus]                   = useState('')
  const [fiscal, setFiscal]                 = useState('')
  const [fiscalSolicitud, setFiscalSolicitud] = useState('')
  const [asignadoCaso, setAsignadoCaso]     = useState('')

  // ── Clasificación ───────────────────────────────────────────────────────────
  const [idTipoOperacion, setIdTipoOperacion]   = useState('')
  const [idTipoRelevancia, setIdTipoRelevancia] = useState('')
  const [idCategoriaOperativo, setIdCategoriaOperativo] = useState('')
  const [idPlanOperacion, setIdPlanOperacion]   = useState('')
  const [idUnidad, setIdUnidad]                 = useState('')
  const [idTipoDenuncia, setIdTipoDenuncia]     = useState('')
  const [idTipoPenal, setIdTipoPenal]           = useState('')
  const [organizacion, setOrganizacion]         = useState('')

  // ── Geografía ───────────────────────────────────────────────────────────────
  const [idDepartamento, setIdDepartamento] = useState('')
  const [idProvincia, setIdProvincia]       = useState('')
  const [idLocalidad, setIdLocalidad]       = useState('')
  const [lugar, setLugar]                   = useState('')

  // ── Droga ───────────────────────────────────────────────────────────────────
  const [idTipoDroga, setIdTipoDroga]         = useState('')
  const [idEstadoDroga, setIdEstadoDroga]     = useState('')
  const [idPaisProcedencia, setIdPaisProcedencia] = useState('')
  const [idPaisDestino, setIdPaisDestino]     = useState('')
  const [costoDrogaMin, setCostoDrogaMin]     = useState('')
  const [costoDrogaMax, setCostoDrogaMax]     = useState('')

  // ── Persona Implicada ───────────────────────────────────────────────────────
  const [nombresPersona, setNombresPersona]   = useState('')
  const [apellidoPaterno, setApellidoPaterno] = useState('')
  const [apellidoMaterno, setApellidoMaterno] = useState('')
  const [nroDocumento, setNroDocumento]       = useState('')
  const [idPaisPersona, setIdPaisPersona]     = useState('')

  // ── Bienes y Costo ──────────────────────────────────────────────────────────
  const [idCatalogoTipo, setIdCatalogoTipo] = useState('')
  const [costoTotalMin, setCostoTotalMin]   = useState('')
  const [costoTotalMax, setCostoTotalMax]   = useState('')

  // ── Indicadores booleanos ───────────────────────────────────────────────────
  const [esPositivo, setEsPositivo]         = useState('')
  const [esAprehendido, setEsAprehendido]   = useState('')
  const [esArrestado, setEsArrestado]       = useState('')
  const [esIcia, setEsIcia]                 = useState('')
  const [esParteDiario, setEsParteDiario]   = useState('')
  const [esRevisado, setEsRevisado]         = useState('')

  // ── Opciones de combos ──────────────────────────────────────────────────────
  const [opTiposOp, setOpTiposOp]               = useState<SelectOption[]>([])
  const [opRelevancia, setOpRelevancia]         = useState<SelectOption[]>([])
  const [opCategorias, setOpCategorias]         = useState<SelectOption[]>([])
  const [opPlanes, setOpPlanes]                 = useState<SelectOption[]>([])
  const [opUnidades, setOpUnidades]             = useState<SelectOption[]>([])
  const [opTipoDenuncia, setOpTipoDenuncia]     = useState<SelectOption[]>([])
  const [opTipoPenal, setOpTipoPenal]           = useState<SelectOption[]>([])

  const [opDepartamentos, setOpDepartamentos]   = useState<SelectOption[]>([])
  const [opProvincias, setOpProvincias]         = useState<SelectOption[]>([])
  const [opLocalidades, setOpLocalidades]       = useState<SelectOption[]>([])
  const [cargandoProv, setCargandoProv]         = useState(false)
  const [cargandoLoc, setCargandoLoc]           = useState(false)

  const [opTiposDroga, setOpTiposDroga]         = useState<SelectOption[]>([])
  const [opEstadosDroga, setOpEstadosDroga]     = useState<SelectOption[]>([])
  const [cargandoEstados, setCargandoEstados]   = useState(false)

  const [opPaises, setOpPaises]                 = useState<SelectOption[]>([])
  const [opBienes, setOpBienes]                 = useState<SelectOption[]>([])

  // ── Carga inicial de combos estáticos ───────────────────────────────────────
  useEffect(() => {
    void Promise.all([
      SiiiLookupsService.obtenerTiposOperacion(),
      SiiiLookupsService.obtenerTiposRelevancia(),
      SiiiLookupsService.obtenerCategoriasOperativo(),
      SiiiLookupsService.obtenerPlanesOperaciones(),
      SiiiLookupsService.obtenerUnidades(),
      SiiiLookupsService.obtenerTiposDenuncia(),
      SiiiLookupsService.obtenerTiposPenal(),
      SiiiLookupsService.obtenerDepartamentos(),
      SiiiLookupsService.obtenerTiposDroga(),
      SiiiLookupsService.obtenerPaises(),
      SiiiLookupsService.obtenerBienes(),
    ]).then(([rTO, rTR, rCat, rPl, rUni, rTD, rTP, rDep, rTDroga, rPais, rBien]) => {
      const toOpt = (arr: any[], lbl = 'descripcion') =>
        arr.map(x => ({ value: x.id as number, label: x[lbl] as string }))
      setOpTiposOp(toOpt(rTO.datos))
      setOpRelevancia(toOpt(rTR.datos))
      setOpCategorias(toOpt(rCat.datos))
      setOpPlanes(rPl.datos.map(x => ({ value: x.id, label: `${x.nombre} (${x.gestion})` })))
      setOpUnidades(toOpt(rUni.datos))
      setOpTipoDenuncia(toOpt(rTD.datos))
      setOpTipoPenal(toOpt(rTP.datos))
      setOpDepartamentos(toOpt(rDep.datos))
      setOpTiposDroga(toOpt(rTDroga.datos))
      setOpPaises(toOpt(rPais.datos))
      setOpBienes(toOpt(rBien.datos))
    })
  }, [])

  // ── Cascade: Departamento → Provincia ───────────────────────────────────────
  useEffect(() => {
    setIdProvincia(''); setIdLocalidad(''); setOpProvincias([]); setOpLocalidades([])
    if (!idDepartamento) return
    setCargandoProv(true)
    void SiiiLookupsService.obtenerProvincias(Number(idDepartamento))
      .then(r => setOpProvincias(r.datos.map(x => ({ value: x.id, label: x.descripcion }))))
      .finally(() => setCargandoProv(false))
  }, [idDepartamento])

  // ── Cascade: Provincia → Localidad ──────────────────────────────────────────
  useEffect(() => {
    setIdLocalidad(''); setOpLocalidades([])
    if (!idProvincia) return
    setCargandoLoc(true)
    void SiiiLookupsService.obtenerLocalidades(Number(idProvincia))
      .then(r => setOpLocalidades(r.datos.map(x => ({ value: x.id, label: x.descripcion }))))
      .finally(() => setCargandoLoc(false))
  }, [idProvincia])

  // ── Cascade: TipoDroga → EstadoDroga ────────────────────────────────────────
  useEffect(() => {
    setIdEstadoDroga(''); setOpEstadosDroga([])
    if (!idTipoDroga) return
    setCargandoEstados(true)
    void SiiiLookupsService.obtenerEstadosDroga(Number(idTipoDroga))
      .then(r => setOpEstadosDroga(r.datos.map((x: any) => ({ value: x.id, label: x.descripcion }))))
      .finally(() => setCargandoEstados(false))
  }, [idTipoDroga])

  // ── Limpiar todo ─────────────────────────────────────────────────────────────
  const limpiar = () => {
    setFechaInicio(hace30Dias()); setFechaFin(hoy())
    setCodigoServicio(''); setNumeroCaso(''); setNombreCaso('')
    setNumeroOperativo(''); setIanus('')
    setFiscal(''); setFiscalSolicitud(''); setAsignadoCaso('')
    setIdTipoOperacion(''); setIdTipoRelevancia(''); setIdCategoriaOperativo('')
    setIdPlanOperacion(''); setIdUnidad(''); setIdTipoDenuncia(''); setIdTipoPenal('')
    setOrganizacion('')
    setIdDepartamento(''); setIdProvincia(''); setIdLocalidad(''); setLugar('')
    setIdTipoDroga(''); setIdEstadoDroga(''); setIdPaisProcedencia(''); setIdPaisDestino('')
    setCostoDrogaMin(''); setCostoDrogaMax('')
    setNombresPersona(''); setApellidoPaterno(''); setApellidoMaterno('')
    setNroDocumento(''); setIdPaisPersona('')
    setIdCatalogoTipo(''); setCostoTotalMin(''); setCostoTotalMax('')
    setEsPositivo(''); setEsAprehendido(''); setEsArrestado('')
    setEsIcia(''); setEsParteDiario(''); setEsRevisado('')
    onLimpiar?.()
  }

  // ── Buscar ───────────────────────────────────────────────────────────────────
  const buscar = () => {
    onBuscar({
      codigoServicio, fechaInicio, fechaFin, numeroCaso, fiscal, nombreCaso,
      numeroOperativo, ianus, fiscalSolicitud, asignadoCaso,
      idTipoOperacion, idTipoRelevancia, idCategoriaOperativo, idPlanOperacion,
      idUnidad, idTipoDenuncia, idTipoPenal, organizacion,
      idDepartamento, idProvincia, idLocalidad, lugar,
      idTipoDroga, idEstadoDroga, idPaisProcedencia, idPaisDestino,
      costoDrogaMin, costoDrogaMax,
      nombresPersona, apellidoPaterno, apellidoMaterno, nroDocumento, idPaisPersona,
      idCatalogoTipo, costoTotalMin, costoTotalMax,
      esPositivo, esAprehendido, esArrestado, esIcia, esParteDiario, esRevisado,
    })
  }

  const fieldLabel = 'mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400'

  return (
    <div className="panel space-y-4">

      {/* Cabecera */}
      <div className="flex items-center justify-between border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-3">
        <div className="flex items-center gap-2">
          <Icono className="w-5 h-5 text-primary">tune</Icono>
          <h3 className="text-base font-bold text-dark dark:text-white-light">
            Búsqueda Avanzada — Operativos
          </h3>
        </div>
        <Button variant="outline-danger" size="sm" onClick={limpiar} disabled={cargando}>
          <Icono className="w-4 h-4 mr-1">refresh</Icono>
          Limpiar
        </Button>
      </div>

      {/* ── Sección 1: Caso / Asignación ─────────────────────────────────────── */}
      <SeccionFiltro titulo="Caso / Asignación" icono="folder_open"
        colorClass="bg-blue-50/70 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className={fieldLabel}>Fecha Inicio</label>
            <Input size="sm" type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
          </div>
          <div>
            <label className={fieldLabel}>Fecha Fin</label>
            <Input size="sm" type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
          </div>
          <div>
            <label className={fieldLabel}>Cód. Servicio</label>
            <Input size="sm" value={codigoServicio} onChange={e => setCodigoServicio(e.target.value)} placeholder="Ej: SRV-001" />
          </div>
          <div>
            <label className={fieldLabel}>Número de Caso</label>
            <Input size="sm" value={numeroCaso} onChange={e => setNumeroCaso(e.target.value)} placeholder="Ej: LP-A-1/25" />
          </div>
          <div>
            <label className={fieldLabel}>Nombre del Caso</label>
            <Input size="sm" value={nombreCaso} onChange={e => setNombreCaso(e.target.value)} placeholder="Ej: Operación Luz" />
          </div>
          <div>
            <label className={fieldLabel}>Número de Operativo</label>
            <Input size="sm" value={numeroOperativo} onChange={e => setNumeroOperativo(e.target.value)} placeholder="Ej: OP-2025-001" />
          </div>
          <div>
            <label className={fieldLabel}>IANUS</label>
            <Input size="sm" value={ianus} onChange={e => setIanus(e.target.value)} placeholder="Ej: IAN-001" />
          </div>
          <div>
            <label className={fieldLabel}>Fiscal Asignado</label>
            <Input size="sm" value={fiscal} onChange={e => setFiscal(e.target.value)} placeholder="Apellido o nombre" />
          </div>
          <div>
            <label className={fieldLabel}>Fiscal Solicitante</label>
            <Input size="sm" value={fiscalSolicitud} onChange={e => setFiscalSolicitud(e.target.value)} placeholder="Apellido o nombre" />
          </div>
          <div>
            <label className={fieldLabel}>Investigador Asignado</label>
            <Input size="sm" value={asignadoCaso} onChange={e => setAsignadoCaso(e.target.value)} placeholder="Apellido o nombre" />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 2: Clasificación ──────────────────────────────────────────── */}
      <SeccionFiltro titulo="Clasificación del Operativo" icono="category"
        colorClass="bg-indigo-50/70 dark:bg-indigo-900/10 text-indigo-800 dark:text-indigo-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className={fieldLabel}>Tipo de Operativo</label>
            <Select size="sm" value={idTipoOperacion}
              onChange={e => setIdTipoOperacion(e.target.value)}
              options={opTiposOp} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Tipo de Relevancia</label>
            <Select size="sm" value={idTipoRelevancia}
              onChange={e => setIdTipoRelevancia(e.target.value)}
              options={opRelevancia} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Categoría de Operativo</label>
            <Select size="sm" value={idCategoriaOperativo}
              onChange={e => setIdCategoriaOperativo(e.target.value)}
              options={opCategorias} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Plan de Operaciones</label>
            <Select size="sm" value={idPlanOperacion}
              onChange={e => setIdPlanOperacion(e.target.value)}
              options={opPlanes} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Unidad</label>
            <Select size="sm" value={idUnidad}
              onChange={e => setIdUnidad(e.target.value)}
              options={opUnidades} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Tipo de Denuncia</label>
            <Select size="sm" value={idTipoDenuncia}
              onChange={e => setIdTipoDenuncia(e.target.value)}
              options={opTipoDenuncia} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Tipo Penal</label>
            <Select size="sm" value={idTipoPenal}
              onChange={e => setIdTipoPenal(e.target.value)}
              options={opTipoPenal} placeholder="Todos..." />
          </div>
          <div className="sm:col-span-2">
            <label className={fieldLabel}>Organización (parcial)</label>
            <Input size="sm" value={organizacion} onChange={e => setOrganizacion(e.target.value)} placeholder="Ej: Cartel..." />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 3: Geografía ─────────────────────────────────────────────── */}
      <SeccionFiltro titulo="Geografía" icono="location_on"
        colorClass="bg-green-50/70 dark:bg-green-900/10 text-green-800 dark:text-green-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className={fieldLabel}>Departamento</label>
            <Select size="sm" value={idDepartamento}
              onChange={e => setIdDepartamento(e.target.value)}
              options={opDepartamentos} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>
              Provincia {cargandoProv && <span className="text-primary animate-pulse text-xs">...</span>}
            </label>
            <Select size="sm" value={idProvincia}
              onChange={e => setIdProvincia(e.target.value)}
              options={opProvincias} placeholder="Seleccione depto..." disabled={!idDepartamento || cargandoProv} />
          </div>
          <div>
            <label className={fieldLabel}>
              Localidad {cargandoLoc && <span className="text-primary animate-pulse text-xs">...</span>}
            </label>
            <Select size="sm" value={idLocalidad}
              onChange={e => setIdLocalidad(e.target.value)}
              options={opLocalidades} placeholder="Seleccione prov..." disabled={!idProvincia || cargandoLoc} />
          </div>
          <div>
            <label className={fieldLabel}>Lugar (parcial)</label>
            <Input size="sm" value={lugar} onChange={e => setLugar(e.target.value)} placeholder="Ej: Av. Principal" />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 4: Droga ─────────────────────────────────────────────────── */}
      <SeccionFiltro titulo="Droga" icono="science"
        colorClass="bg-amber-50/70 dark:bg-amber-900/10 text-amber-800 dark:text-amber-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className={fieldLabel}>Tipo de Droga</label>
            <Select size="sm" value={idTipoDroga}
              onChange={e => setIdTipoDroga(e.target.value)}
              options={opTiposDroga} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>
              Estado de Droga {cargandoEstados && <span className="text-primary animate-pulse text-xs">...</span>}
            </label>
            <Select size="sm" value={idEstadoDroga}
              onChange={e => setIdEstadoDroga(e.target.value)}
              options={opEstadosDroga} placeholder="Seleccione tipo..." disabled={!idTipoDroga || cargandoEstados} />
          </div>
          <div>
            <label className={fieldLabel}>País Procedencia</label>
            <Select size="sm" value={idPaisProcedencia}
              onChange={e => setIdPaisProcedencia(e.target.value)}
              options={opPaises} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>País Destino</label>
            <Select size="sm" value={idPaisDestino}
              onChange={e => setIdPaisDestino(e.target.value)}
              options={opPaises} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Costo Droga Mín (Bs)</label>
            <Input size="sm" type="number" min="0" value={costoDrogaMin}
              onChange={e => setCostoDrogaMin(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={fieldLabel}>Costo Droga Máx (Bs)</label>
            <Input size="sm" type="number" min="0" value={costoDrogaMax}
              onChange={e => setCostoDrogaMax(e.target.value)} placeholder="Sin límite" />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 5: Persona Implicada ─────────────────────────────────────── */}
      <SeccionFiltro titulo="Persona Implicada" icono="person_search"
        colorClass="bg-teal-50/70 dark:bg-teal-900/10 text-teal-800 dark:text-teal-300">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div>
            <label className={fieldLabel}>Nombres</label>
            <Input size="sm" value={nombresPersona} onChange={e => setNombresPersona(e.target.value)} placeholder="Nombres" />
          </div>
          <div>
            <label className={fieldLabel}>Ap. Paterno</label>
            <Input size="sm" value={apellidoPaterno} onChange={e => setApellidoPaterno(e.target.value)} placeholder="Ap. Paterno" />
          </div>
          <div>
            <label className={fieldLabel}>Ap. Materno</label>
            <Input size="sm" value={apellidoMaterno} onChange={e => setApellidoMaterno(e.target.value)} placeholder="Ap. Materno" />
          </div>
          <div>
            <label className={fieldLabel}>Nro. Documento</label>
            <Input size="sm" value={nroDocumento} onChange={e => setNroDocumento(e.target.value)} placeholder="CI / Pasaporte" />
          </div>
          <div>
            <label className={fieldLabel}>Nacionalidad</label>
            <Select size="sm" value={idPaisPersona}
              onChange={e => setIdPaisPersona(e.target.value)}
              options={opPaises} placeholder="Todos..." />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 6: Bienes y Costo Total ──────────────────────────────────── */}
      <SeccionFiltro titulo="Bienes Secuestrados y Costo Total" icono="inventory_2"
        colorClass="bg-purple-50/70 dark:bg-purple-900/10 text-purple-800 dark:text-purple-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={fieldLabel}>Tipo de Bien</label>
            <Select size="sm" value={idCatalogoTipo}
              onChange={e => setIdCatalogoTipo(e.target.value)}
              options={opBienes} placeholder="Todos..." />
          </div>
          <div>
            <label className={fieldLabel}>Costo Total Mín (Bs)</label>
            <Input size="sm" type="number" min="0" value={costoTotalMin}
              onChange={e => setCostoTotalMin(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className={fieldLabel}>Costo Total Máx (Bs)</label>
            <Input size="sm" type="number" min="0" value={costoTotalMax}
              onChange={e => setCostoTotalMax(e.target.value)} placeholder="Sin límite" />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Sección 7: Indicadores booleanos ─────────────────────────────────── */}
      <SeccionFiltro titulo="Indicadores" icono="flag"
        colorClass="bg-rose-50/70 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(
            [
              ['¿Es Positivo?',     esPositivo,    setEsPositivo],
              ['¿Aprehendido?',    esAprehendido, setEsAprehendido],
              ['¿Arrestado?',      esArrestado,   setEsArrestado],
              ['¿ICIA?',           esIcia,        setEsIcia],
              ['¿Parte Diario?',   esParteDiario, setEsParteDiario],
              ['¿Revisado?',       esRevisado,    setEsRevisado],
            ] as [string, string, (v: string) => void][]
          ).map(([lbl, val, set]) => (
            <div key={lbl}>
              <label className={fieldLabel}>{lbl}</label>
              <Select size="sm" value={val}
                onChange={e => set(e.target.value)}
                options={BOOL_OPTS} placeholder="" />
            </div>
          ))}
        </div>
      </SeccionFiltro>

      {/* ── Botón Buscar ─────────────────────────────────────────────────────── */}
      <div className="flex justify-end pt-1">
        <Button variant="primary" size="md" onClick={buscar} disabled={cargando}>
          {cargando
            ? <><Icono className="w-4 h-4 mr-2 animate-spin">refresh</Icono>Buscando...</>
            : <><Icono className="w-4 h-4 mr-2">search</Icono>Buscar Operativos</>}
        </Button>
      </div>

    </div>
  )
}
