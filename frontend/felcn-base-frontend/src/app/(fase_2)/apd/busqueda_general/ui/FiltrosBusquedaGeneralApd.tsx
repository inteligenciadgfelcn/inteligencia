'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Icono } from '@/components/Icono'

import {
  aBooleano,
  limpiarVacios,
  opcionesCatalogo,
  opcionesDepartamento,
  opcionesVinculadas,
  validarRangoFechas,
  validarRangoMontos,
} from '../mappers/busqueda-general-apd.mappers'
import type {
  CatalogosApd,
  FiltrosBusquedaApd,
  FormatoExportacion,
  SexoValor,
  SituacionLegalBien,
} from '../types/busqueda-general-apd.types'

/* ─── Estado del formulario ───────────────────────────────────────────────── */

/**
 * Los <Select> y los <Input type="date"> entregan texto, asi que los ids numericos
 * y los booleanos del DTO se mantienen como string mientras se editan y se
 * convierten al enviar. El mapeo es total: agregar un campo al DTO lo agrega aca.
 */
type EstadoFormulario = {
  [K in keyof FiltrosBusquedaApd]?: FiltrosBusquedaApd[K] extends number
    ? string
    : FiltrosBusquedaApd[K] extends boolean
      ? '' | 'true' | 'false'
      : string
}

const ESTADO_INICIAL: EstadoFormulario = {}

const numero = (valor: string | undefined): number | undefined =>
  valor === undefined || valor === '' ? undefined : Number(valor)

const aFiltros = (estado: EstadoFormulario): FiltrosBusquedaApd =>
  limpiarVacios({
    numeroCaso: estado.numeroCaso,
    nombreCaso: estado.nombreCaso,
    cud: estado.cud,
    numeroCasoFiscalia: estado.numeroCasoFiscalia,
    departamentoCodigo: estado.departamentoCodigo,
    tipologiaId: numero(estado.tipologiaId),
    unidadId: numero(estado.unidadId),
    distritalId: numero(estado.distritalId),
    grupoId: numero(estado.grupoId),
    etapaInvestigacionId: numero(estado.etapaInvestigacionId),
    estadoProcesalId: numero(estado.estadoProcesalId),
    inicioCasoDesde: estado.inicioCasoDesde,
    inicioCasoHasta: estado.inicioCasoHasta,

    numeroActuacion: estado.numeroActuacion,
    lugarActuacion: estado.lugarActuacion,
    tipoInformeId: numero(estado.tipoInformeId),
    informeDesde: estado.informeDesde,
    informeHasta: estado.informeHasta,

    nombres: estado.nombres,
    apellidoPaterno: estado.apellidoPaterno,
    apellidoMaterno: estado.apellidoMaterno,
    apellidoEsposo: estado.apellidoEsposo,
    numeroDocumento: estado.numeroDocumento,
    tipoDocumentoId: numero(estado.tipoDocumentoId),
    paisId: numero(estado.paisId),
    estadoCivilId: numero(estado.estadoCivilId),
    profesionId: numero(estado.profesionId),
    sexo: estado.sexo,
    relacionPersona: estado.relacionPersona,
    observacionesPersona: estado.observacionesPersona,
    situacionPersonaId: numero(estado.situacionPersonaId),
    personaSinSituacion: aBooleano(estado.personaSinSituacion),
    personaRegistroDesde: estado.personaRegistroDesde,
    personaRegistroHasta: estado.personaRegistroHasta,

    categoriaBienId: numero(estado.categoriaBienId),
    claseBienId: numero(estado.claseBienId),
    tipoBienId: numero(estado.tipoBienId),
    caracteristicaId: numero(estado.caracteristicaId),
    caracteristicaBien: estado.caracteristicaBien,
    lugarSecuestro: estado.lugarSecuestro,
    periciaBien: aBooleano(estado.periciaBien),
    resultadoPericiaBien: estado.resultadoPericiaBien,
    valorBienDesde: numero(estado.valorBienDesde),
    valorBienHasta: numero(estado.valorBienHasta),
    situacionLegalBien: estado.situacionLegalBien,
    bienSinSituacionLegal: aBooleano(estado.bienSinSituacionLegal),
    situacionJuridicaBienId: numero(estado.situacionJuridicaBienId),
    bienSinSituacionJuridica: aBooleano(estado.bienSinSituacionJuridica),
    bienRegistroDesde: estado.bienRegistroDesde,
    bienRegistroHasta: estado.bienRegistroHasta,

    nombreEmpresa: estado.nombreEmpresa,
    nit: estado.nit,
    matricula: estado.matricula,
    representante: estado.representante,
    direccionEmpresa: estado.direccionEmpresa,
    vinculoEmpresaId: numero(estado.vinculoEmpresaId),
    periciaEmpresa: aBooleano(estado.periciaEmpresa),
    resultadoPericiaEmpresa: estado.resultadoPericiaEmpresa,
    observacionesEmpresa: estado.observacionesEmpresa,
    situacionEmpresaId: numero(estado.situacionEmpresaId),
    empresaSinSituacion: aBooleano(estado.empresaSinSituacion),
    empresaRegistroDesde: estado.empresaRegistroDesde,
    empresaRegistroHasta: estado.empresaRegistroHasta,
  }) as FiltrosBusquedaApd

/* ─── Opciones estaticas ─────────────────────────────────────────────────── */

const SEXO_OPTS: SelectOption[] = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
]

const BOOLEANO_OPTS: SelectOption[] = [
  { value: 'true', label: 'Si' },
  { value: 'false', label: 'No' },
]

type VarianteBoton =
  | 'outline-danger'
  | 'outline-info'
  | 'outline-success'
  | 'outline-secondary'

const BOTONES_EXPORTAR: {
  formato: FormatoExportacion
  label: string
  variant: VarianteBoton
}[] = [
  { formato: 'pdf', label: 'PDF', variant: 'outline-danger' },
  { formato: 'csv', label: 'CSV', variant: 'outline-info' },
  { formato: 'excel', label: 'EXCEL', variant: 'outline-success' },
  { formato: 'json', label: 'JSON', variant: 'outline-secondary' },
]

const LABEL_CAMPO =
  'mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400'

/* ─── Seccion colapsable ─────────────────────────────────────────────────── */

function SeccionFiltro({
  titulo,
  icono,
  colorClass,
  defaultOpen = false,
  children,
}: {
  titulo: string
  icono: string
  colorClass: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [abierto, setAbierto] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-[#e0e6ed] dark:border-[#1b2e4b] overflow-hidden">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className={`w-full justify-between rounded-none ${colorClass}`}
      >
        <span className="inline-flex items-center gap-2">
          <Icono className="w-4 h-4">{icono}</Icono>
          <span className="text-xs font-semibold uppercase tracking-wide">
            {titulo}
          </span>
        </span>
        <Icono
          className={`w-4 h-4 transition-transform ${abierto ? 'rotate-180' : ''}`}
        >
          expand_more
        </Icono>
      </Button>
      {abierto && <div className="px-4 py-3">{children}</div>}
    </div>
  )
}

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface FiltrosBusquedaGeneralApdProps {
  catalogos: CatalogosApd | null
  cargandoCatalogos: boolean
  onBuscar: (filtros: FiltrosBusquedaApd) => void
  onLimpiar: () => void
  onExportar: (formato: FormatoExportacion, filtros: FiltrosBusquedaApd) => void
  onError: (mensaje: string) => void
  cargando: boolean
  exportando: FormatoExportacion | null
}

/* ─── Componente principal ───────────────────────────────────────────────── */

export function FiltrosBusquedaGeneralApd({
  catalogos,
  cargandoCatalogos,
  onBuscar,
  onLimpiar,
  onExportar,
  onError,
  cargando,
  exportando,
}: FiltrosBusquedaGeneralApdProps) {
  const [estado, setEstado] = useState<EstadoFormulario>(ESTADO_INICIAL)

  const set = <K extends keyof EstadoFormulario>(
    campo: K,
    valor: EstadoFormulario[K]
  ) => setEstado((prev) => ({ ...prev, [campo]: valor }))

  /** Al cambiar un padre de una cascada se limpian sus hijos. */
  const setPadreYCascade = (
    campo: keyof EstadoFormulario,
    valor: string,
    hijos: (keyof EstadoFormulario)[]
  ) =>
    setEstado((prev) => {
      const siguiente = { ...prev, [campo]: valor }
      for (const hijo of hijos) delete siguiente[hijo]
      return siguiente
    })

  /** Los switches "sin situacion" son excluyentes con su select. */
  const setSwitchExcluyente = (
    switchCampo: keyof EstadoFormulario,
    selectCampo: keyof EstadoFormulario,
    activo: boolean
  ) =>
    setEstado((prev) => {
      const siguiente = { ...prev, [switchCampo]: activo ? 'true' : '' }
      if (activo) delete siguiente[selectCampo]
      return siguiente
    })

  /* ── Opciones de catalogo (memoizadas: no cambian durante la sesion) ── */

  const op = useMemo(
    () => ({
      departamentos: opcionesDepartamento(catalogos),
      unidades: opcionesCatalogo(catalogos?.unidades),
      etapas: opcionesCatalogo(catalogos?.etapasInvestigacion),
      tipologias: opcionesCatalogo(catalogos?.tipologias),
      tiposInforme: opcionesCatalogo(catalogos?.tiposInforme),
      paises: opcionesCatalogo(catalogos?.paises),
      estadosCiviles: opcionesCatalogo(catalogos?.estadosCiviles),
      profesiones: opcionesCatalogo(catalogos?.profesiones),
      tiposDocumento: opcionesCatalogo(catalogos?.tiposDocumento),
      situacionesPersona: opcionesCatalogo(catalogos?.situacionesPersona),
      categoriasBien: opcionesCatalogo(catalogos?.categoriasBien),
      situacionesJuridicasBien: opcionesCatalogo(
        catalogos?.situacionesJuridicasBien
      ),
      situacionesEmpresa: opcionesCatalogo(catalogos?.situacionesEmpresa),
      vinculosEmpresa: opcionesCatalogo(catalogos?.vinculosEmpresa),
      situacionesLegalesBien: opcionesCatalogo(
        catalogos?.situacionesLegalesBien
      ),
    }),
    [catalogos]
  )

  const opDistritales = useMemo(
    () =>
      opcionesVinculadas(catalogos?.distritales, estado.unidadId, 'unidadId'),
    [catalogos, estado.unidadId]
  )
  const opGrupos = useMemo(
    () =>
      opcionesVinculadas(catalogos?.grupos, estado.distritalId, 'distritalId'),
    [catalogos, estado.distritalId]
  )
  const opEstadosProcesales = useMemo(
    () =>
      opcionesVinculadas(
        catalogos?.estadosProcesales,
        estado.etapaInvestigacionId,
        'etapaId'
      ),
    [catalogos, estado.etapaInvestigacionId]
  )
  const opClasesBien = useMemo(
    () =>
      opcionesVinculadas(
        catalogos?.clasesBien,
        estado.categoriaBienId,
        'categoriaId'
      ),
    [catalogos, estado.categoriaBienId]
  )
  const opTiposBien = useMemo(
    () =>
      opcionesVinculadas(catalogos?.tiposBien, estado.claseBienId, 'claseId'),
    [catalogos, estado.claseBienId]
  )
  const opCaracteristicas = useMemo(
    () =>
      opcionesVinculadas(
        catalogos?.caracteristicas,
        estado.claseBienId,
        'claseId'
      ),
    [catalogos, estado.claseBienId]
  )

  /* ── Validacion y envio ───────────────────────────────────────────────── */

  const validar = (): string | null => {
    const rangos: [string, string | undefined, string | undefined][] = [
      ['Inicio del caso', estado.inicioCasoDesde, estado.inicioCasoHasta],
      ['Fecha del informe', estado.informeDesde, estado.informeHasta],
      [
        'Registro de persona',
        estado.personaRegistroDesde,
        estado.personaRegistroHasta,
      ],
      ['Registro del bien', estado.bienRegistroDesde, estado.bienRegistroHasta],
      [
        'Registro de empresa',
        estado.empresaRegistroDesde,
        estado.empresaRegistroHasta,
      ],
    ]
    for (const [nombre, desde, hasta] of rangos) {
      const error = validarRangoFechas(desde, hasta, nombre)
      if (error) return error
    }
    return validarRangoMontos(
      numero(estado.valorBienDesde),
      numero(estado.valorBienHasta)
    )
  }

  const buscar = () => {
    const error = validar()
    if (error) {
      onError(error)
      return
    }
    onBuscar(aFiltros(estado))
  }

  const limpiar = () => {
    setEstado(ESTADO_INICIAL)
    onLimpiar()
  }

  const exportar = (formato: FormatoExportacion) => {
    const error = validar()
    if (error) {
      onError(error)
      return
    }
    onExportar(formato, aFiltros(estado))
  }

  const hayFiltros = Object.keys(estado).length > 0

  return (
    <div className="panel space-y-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-2 border-b border-[#e0e6ed] dark:border-[#1b2e4b] pb-3">
        <div className="flex items-center gap-2">
          <Icono className="w-5 h-5 text-primary">tune</Icono>
          <h2 className="text-base font-bold text-dark dark:text-white-light">
            Búsqueda general — Variables cruzadas APD
          </h2>
        </div>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={limpiar}
          disabled={cargando || !hayFiltros}
        >
          <Icono className="w-4 h-4 mr-1">refresh</Icono>
          Limpiar
        </Button>
      </div>

      {cargandoCatalogos && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cargando catálogos...
        </p>
      )}

      {/* ── Seccion 1: Caso ───────────────────────────────────────────────── */}
      <SeccionFiltro
        titulo="Caso"
        icono="assignment"
        defaultOpen
        colorClass="bg-blue-50/70 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className={LABEL_CAMPO}>Nro. de caso GIAEF</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.numeroCaso ?? ''}
              onChange={(e) => set('numeroCaso', e.target.value)}
              placeholder="Ej: SC-PD-1/26"
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Nombre del caso</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.nombreCaso ?? ''}
              onChange={(e) => set('nombreCaso', e.target.value)}
              placeholder="Ej: CASO PERDIDA DE DOMINIO"
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Nro. de caso (Fiscalía)</label>
            <Input
              size="sm"
              maxLength={250}
              value={estado.numeroCasoFiscalia ?? ''}
              onChange={(e) => set('numeroCasoFiscalia', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>CUD / IFP</label>
            <Input
              size="sm"
              maxLength={250}
              value={estado.cud ?? ''}
              onChange={(e) => set('cud', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Departamento</label>
            <Select
              size="sm"
              value={estado.departamentoCodigo ?? ''}
              onChange={(e) => set('departamentoCodigo', e.target.value)}
              options={op.departamentos}
              placeholder="Todos..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Tipología</label>
            <Select
              size="sm"
              value={estado.tipologiaId ?? ''}
              onChange={(e) => set('tipologiaId', e.target.value)}
              options={op.tipologias}
              placeholder="Todas..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Unidad</label>
            <Select
              size="sm"
              value={estado.unidadId ?? ''}
              onChange={(e) =>
                setPadreYCascade('unidadId', e.target.value, [
                  'distritalId',
                  'grupoId',
                ])
              }
              options={op.unidades}
              placeholder="Todas..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Distrital</label>
            <Select
              size="sm"
              value={estado.distritalId ?? ''}
              onChange={(e) =>
                setPadreYCascade('distritalId', e.target.value, ['grupoId'])
              }
              options={opDistritales}
              placeholder={
                estado.unidadId ? 'Todos...' : 'Seleccione unidad...'
              }
              disabled={!estado.unidadId}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Grupo</label>
            <Select
              size="sm"
              value={estado.grupoId ?? ''}
              onChange={(e) => set('grupoId', e.target.value)}
              options={opGrupos}
              placeholder={
                estado.distritalId ? 'Todos...' : 'Seleccione distrital...'
              }
              disabled={!estado.distritalId}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Etapa de investigación</label>
            <Select
              size="sm"
              value={estado.etapaInvestigacionId ?? ''}
              onChange={(e) =>
                setPadreYCascade('etapaInvestigacionId', e.target.value, [
                  'estadoProcesalId',
                ])
              }
              options={op.etapas}
              placeholder="Todas..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Estado procesal</label>
            <Select
              size="sm"
              value={estado.estadoProcesalId ?? ''}
              onChange={(e) => set('estadoProcesalId', e.target.value)}
              options={opEstadosProcesales}
              placeholder="Todos..."
              disabled={!estado.etapaInvestigacionId}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Inicio del caso (desde)</label>
            <Input
              size="sm"
              type="date"
              value={estado.inicioCasoDesde ?? ''}
              onChange={(e) => set('inicioCasoDesde', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Inicio del caso (hasta)</label>
            <Input
              size="sm"
              type="date"
              value={estado.inicioCasoHasta ?? ''}
              onChange={(e) => set('inicioCasoHasta', e.target.value)}
            />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Seccion 2: Actuacion ──────────────────────────────────────────── */}
      <SeccionFiltro
        titulo="Actuación"
        icono="assignment_turned_in"
        colorClass="bg-purple-50/70 dark:bg-purple-900/10 text-purple-800 dark:text-purple-300"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className={LABEL_CAMPO}>Nro. de actuación</label>
            <Input
              size="sm"
              maxLength={250}
              value={estado.numeroActuacion ?? ''}
              onChange={(e) => set('numeroActuacion', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Lugar de la actuación</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.lugarActuacion ?? ''}
              onChange={(e) => set('lugarActuacion', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Tipo de informe</label>
            <Select
              size="sm"
              value={estado.tipoInformeId ?? ''}
              onChange={(e) => set('tipoInformeId', e.target.value)}
              options={op.tiposInforme}
              placeholder="Todos..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div className="flex items-end">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Estos criterios también se aplican a los bienes y empresas de la
              actuación.
            </p>
          </div>
          <div>
            <label className={LABEL_CAMPO}>Fecha del informe (desde)</label>
            <Input
              size="sm"
              type="date"
              value={estado.informeDesde ?? ''}
              onChange={(e) => set('informeDesde', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Fecha del informe (hasta)</label>
            <Input
              size="sm"
              type="date"
              value={estado.informeHasta ?? ''}
              onChange={(e) => set('informeHasta', e.target.value)}
            />
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Seccion 3: Persona ────────────────────────────────────────────── */}
      <SeccionFiltro
        titulo="Persona investigada"
        icono="person"
        colorClass="bg-teal-50/70 dark:bg-teal-900/10 text-teal-800 dark:text-teal-300"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className={LABEL_CAMPO}>Nombres</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.nombres ?? ''}
              onChange={(e) => set('nombres', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Apellido paterno</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.apellidoPaterno ?? ''}
              onChange={(e) => set('apellidoPaterno', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Apellido materno</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.apellidoMaterno ?? ''}
              onChange={(e) => set('apellidoMaterno', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Apellido de esposo/a</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.apellidoEsposo ?? ''}
              onChange={(e) => set('apellidoEsposo', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Nro. de documento</label>
            <Input
              size="sm"
              maxLength={250}
              value={estado.numeroDocumento ?? ''}
              onChange={(e) => set('numeroDocumento', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Tipo de documento</label>
            <Select
              size="sm"
              value={estado.tipoDocumentoId ?? ''}
              onChange={(e) => set('tipoDocumentoId', e.target.value)}
              options={op.tiposDocumento}
              placeholder="Todos..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>País</label>
            <Select
              size="sm"
              value={estado.paisId ?? ''}
              onChange={(e) => set('paisId', e.target.value)}
              options={op.paises}
              placeholder="Todos..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Sexo</label>
            <Select
              size="sm"
              value={estado.sexo ?? ''}
              onChange={(e) => set('sexo', e.target.value as SexoValor)}
              options={SEXO_OPTS}
              placeholder="Todos..."
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Estado civil</label>
            <Select
              size="sm"
              value={estado.estadoCivilId ?? ''}
              onChange={(e) => set('estadoCivilId', e.target.value)}
              options={op.estadosCiviles}
              placeholder="Todos..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Profesión</label>
            <Select
              size="sm"
              value={estado.profesionId ?? ''}
              onChange={(e) => set('profesionId', e.target.value)}
              options={op.profesiones}
              placeholder="Todas..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Relación con el caso</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.relacionPersona ?? ''}
              onChange={(e) => set('relacionPersona', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Observaciones</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.observacionesPersona ?? ''}
              onChange={(e) => set('observacionesPersona', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Registro de persona (desde)</label>
            <Input
              size="sm"
              type="date"
              value={estado.personaRegistroDesde ?? ''}
              onChange={(e) => set('personaRegistroDesde', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Registro de persona (hasta)</label>
            <Input
              size="sm"
              type="date"
              value={estado.personaRegistroHasta ?? ''}
              onChange={(e) => set('personaRegistroHasta', e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL_CAMPO}>Situación jurídica</label>
            <Select
              size="sm"
              value={estado.situacionPersonaId ?? ''}
              onChange={(e) => set('situacionPersonaId', e.target.value)}
              options={op.situacionesPersona}
              placeholder="Todas..."
              disabled={
                cargandoCatalogos || estado.personaSinSituacion === 'true'
              }
            />
            <div className="mt-2">
              <Switch
                label="Personas sin situación jurídica registrada"
                checked={estado.personaSinSituacion === 'true'}
                onChange={(e) =>
                  setSwitchExcluyente(
                    'personaSinSituacion',
                    'situacionPersonaId',
                    e.target.checked
                  )
                }
              />
            </div>
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Seccion 4: Bien ───────────────────────────────────────────────── */}
      <SeccionFiltro
        titulo="Bien"
        icono="inventory_2"
        colorClass="bg-amber-50/70 dark:bg-amber-900/10 text-amber-800 dark:text-amber-300"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className={LABEL_CAMPO}>Categoría de bien</label>
            <Select
              size="sm"
              value={estado.categoriaBienId ?? ''}
              onChange={(e) =>
                setPadreYCascade('categoriaBienId', e.target.value, [
                  'claseBienId',
                  'tipoBienId',
                  'caracteristicaId',
                ])
              }
              options={op.categoriasBien}
              placeholder="Todas..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Clase de bien</label>
            <Select
              size="sm"
              value={estado.claseBienId ?? ''}
              onChange={(e) =>
                setPadreYCascade('claseBienId', e.target.value, [
                  'tipoBienId',
                  'caracteristicaId',
                ])
              }
              options={opClasesBien}
              placeholder={
                estado.categoriaBienId ? 'Todas...' : 'Seleccione categoría...'
              }
              disabled={!estado.categoriaBienId}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Tipo de bien</label>
            <Select
              size="sm"
              value={estado.tipoBienId ?? ''}
              onChange={(e) => set('tipoBienId', e.target.value)}
              options={opTiposBien}
              placeholder="Todos..."
              disabled={!estado.claseBienId}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Característica</label>
            <Select
              size="sm"
              value={estado.caracteristicaId ?? ''}
              onChange={(e) => set('caracteristicaId', e.target.value)}
              options={opCaracteristicas}
              placeholder="Todas..."
              disabled={!estado.claseBienId}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Característica (texto)</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.caracteristicaBien ?? ''}
              onChange={(e) => set('caracteristicaBien', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Lugar de secuestro</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.lugarSecuestro ?? ''}
              onChange={(e) => set('lugarSecuestro', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Valor del bien (desde)</label>
            <Input
              size="sm"
              type="number"
              min={0}
              step="0.01"
              value={estado.valorBienDesde ?? ''}
              onChange={(e) => set('valorBienDesde', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Valor del bien (hasta)</label>
            <Input
              size="sm"
              type="number"
              min={0}
              step="0.01"
              value={estado.valorBienHasta ?? ''}
              onChange={(e) => set('valorBienHasta', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>¿Pericia realizada?</label>
            <Select
              size="sm"
              value={estado.periciaBien ?? ''}
              onChange={(e) => set('periciaBien', e.target.value)}
              options={BOOLEANO_OPTS}
              placeholder="Todos..."
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Resultado de la pericia</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.resultadoPericiaBien ?? ''}
              onChange={(e) => set('resultadoPericiaBien', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Registro del bien (desde)</label>
            <Input
              size="sm"
              type="date"
              value={estado.bienRegistroDesde ?? ''}
              onChange={(e) => set('bienRegistroDesde', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Registro del bien (hasta)</label>
            <Input
              size="sm"
              type="date"
              value={estado.bienRegistroHasta ?? ''}
              onChange={(e) => set('bienRegistroHasta', e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL_CAMPO}>Situación legal</label>
            <Select
              size="sm"
              value={estado.situacionLegalBien ?? ''}
              onChange={(e) =>
                set('situacionLegalBien', e.target.value as SituacionLegalBien)
              }
              options={op.situacionesLegalesBien}
              placeholder="Todas..."
              disabled={estado.bienSinSituacionLegal === 'true'}
            />
            <div className="mt-2">
              <Switch
                label="Bienes sin situación legal registrada"
                checked={estado.bienSinSituacionLegal === 'true'}
                onChange={(e) =>
                  setSwitchExcluyente(
                    'bienSinSituacionLegal',
                    'situacionLegalBien',
                    e.target.checked
                  )
                }
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL_CAMPO}>Situación jurídica</label>
            <Select
              size="sm"
              value={estado.situacionJuridicaBienId ?? ''}
              onChange={(e) => set('situacionJuridicaBienId', e.target.value)}
              options={op.situacionesJuridicasBien}
              placeholder={
                op.situacionesJuridicasBien.length === 0
                  ? 'Sin opciones disponibles'
                  : 'Todas...'
              }
              disabled={
                cargandoCatalogos ||
                estado.bienSinSituacionJuridica === 'true' ||
                op.situacionesJuridicasBien.length === 0
              }
            />
            <div className="mt-2">
              <Switch
                label="Bienes sin situación jurídica registrada"
                checked={estado.bienSinSituacionJuridica === 'true'}
                onChange={(e) =>
                  setSwitchExcluyente(
                    'bienSinSituacionJuridica',
                    'situacionJuridicaBienId',
                    e.target.checked
                  )
                }
              />
            </div>
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Seccion 5: Empresa ────────────────────────────────────────────── */}
      <SeccionFiltro
        titulo="Empresa / Persona jurídica"
        icono="business"
        colorClass="bg-rose-50/70 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className={LABEL_CAMPO}>Nombre o razón social</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.nombreEmpresa ?? ''}
              onChange={(e) => set('nombreEmpresa', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>NIT</label>
            <Input
              size="sm"
              maxLength={250}
              value={estado.nit ?? ''}
              onChange={(e) => set('nit', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Matrícula</label>
            <Input
              size="sm"
              maxLength={250}
              value={estado.matricula ?? ''}
              onChange={(e) => set('matricula', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Representante</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.representante ?? ''}
              onChange={(e) => set('representante', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Dirección</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.direccionEmpresa ?? ''}
              onChange={(e) => set('direccionEmpresa', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Vínculo</label>
            <Select
              size="sm"
              value={estado.vinculoEmpresaId ?? ''}
              onChange={(e) => set('vinculoEmpresaId', e.target.value)}
              options={op.vinculosEmpresa}
              placeholder="Todos..."
              disabled={cargandoCatalogos}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>¿Pericia realizada?</label>
            <Select
              size="sm"
              value={estado.periciaEmpresa ?? ''}
              onChange={(e) => set('periciaEmpresa', e.target.value)}
              options={BOOLEANO_OPTS}
              placeholder="Todos..."
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Resultado de la pericia</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.resultadoPericiaEmpresa ?? ''}
              onChange={(e) => set('resultadoPericiaEmpresa', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Observaciones</label>
            <Input
              size="sm"
              uppercase
              maxLength={250}
              value={estado.observacionesEmpresa ?? ''}
              onChange={(e) => set('observacionesEmpresa', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Registro de empresa (desde)</label>
            <Input
              size="sm"
              type="date"
              value={estado.empresaRegistroDesde ?? ''}
              onChange={(e) => set('empresaRegistroDesde', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL_CAMPO}>Registro de empresa (hasta)</label>
            <Input
              size="sm"
              type="date"
              value={estado.empresaRegistroHasta ?? ''}
              onChange={(e) => set('empresaRegistroHasta', e.target.value)}
            />
          </div>

          <div className="lg:col-span-2">
            <label className={LABEL_CAMPO}>Situación jurídica</label>
            <Select
              size="sm"
              value={estado.situacionEmpresaId ?? ''}
              onChange={(e) => set('situacionEmpresaId', e.target.value)}
              options={op.situacionesEmpresa}
              placeholder="Todas..."
              disabled={
                cargandoCatalogos || estado.empresaSinSituacion === 'true'
              }
            />
            <div className="mt-2">
              <Switch
                label="Empresas sin situación jurídica registrada"
                checked={estado.empresaSinSituacion === 'true'}
                onChange={(e) =>
                  setSwitchExcluyente(
                    'empresaSinSituacion',
                    'situacionEmpresaId',
                    e.target.checked
                  )
                }
              />
            </div>
          </div>
        </div>
      </SeccionFiltro>

      {/* ── Acciones ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {BOTONES_EXPORTAR.map((btn) => (
            <Button
              key={btn.formato}
              type="button"
              variant={btn.variant}
              size="sm"
              onClick={() => exportar(btn.formato)}
              disabled={cargando || exportando !== null}
              loading={exportando === btn.formato}
            >
              {exportando !== btn.formato && (
                <Icono className="w-4 h-4 mr-1">download</Icono>
              )}
              {exportando === btn.formato
                ? 'Exportando...'
                : `Exportar ${btn.label}`}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={buscar}
          disabled={cargando}
          loading={cargando}
        >
          {!cargando && <Icono className="w-4 h-4 mr-2">search</Icono>}
          Buscar casos
        </Button>
      </div>
    </div>
  )
}
