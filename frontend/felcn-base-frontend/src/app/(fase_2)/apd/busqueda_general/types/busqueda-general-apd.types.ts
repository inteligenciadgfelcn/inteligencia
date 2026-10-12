export type FormatoExportacion = 'pdf' | 'csv' | 'excel' | 'json'

export type SituacionLegalBien =
  | 'SECUESTRADO'
  | 'INCAUTADO'
  | 'CONFISCADO'
  | 'PERDIDA_DOMINIO'

export type SexoValor = 'M' | 'F'

/** Espejo de FiltrosVariablesCruzadasPdDto (backend). Todos los campos son opcionales. */
export interface FiltrosBusquedaApd {
  filtro?: string
  numeroCaso?: string
  nombreCaso?: string
  cud?: string
  numeroCasoFiscalia?: string
  departamentoCodigo?: string
  unidadId?: number
  distritalId?: number
  grupoId?: number
  etapaInvestigacionId?: number
  estadoProcesalId?: number
  tipologiaId?: number
  inicioCasoDesde?: string
  inicioCasoHasta?: string
  numeroActuacion?: string
  tipoInformeId?: number
  lugarActuacion?: string
  informeDesde?: string
  informeHasta?: string

  nombres?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  apellidoEsposo?: string
  numeroDocumento?: string
  tipoDocumentoId?: number
  paisId?: number
  estadoCivilId?: number
  profesionId?: number
  sexo?: SexoValor
  relacionPersona?: string
  observacionesPersona?: string
  situacionPersonaId?: number
  personaSinSituacion?: boolean
  personaRegistroDesde?: string
  personaRegistroHasta?: string

  categoriaBienId?: number
  claseBienId?: number
  tipoBienId?: number
  caracteristicaId?: number
  caracteristicaBien?: string
  lugarSecuestro?: string
  periciaBien?: boolean
  resultadoPericiaBien?: string
  valorBienDesde?: number
  valorBienHasta?: number
  situacionLegalBien?: SituacionLegalBien
  bienSinSituacionLegal?: boolean
  situacionJuridicaBienId?: number
  bienSinSituacionJuridica?: boolean
  bienRegistroDesde?: string
  bienRegistroHasta?: string

  nombreEmpresa?: string
  nit?: string
  matricula?: string
  representante?: string
  direccionEmpresa?: string
  vinculoEmpresaId?: number
  periciaEmpresa?: boolean
  resultadoPericiaEmpresa?: string
  observacionesEmpresa?: string
  situacionEmpresaId?: number
  empresaSinSituacion?: boolean
  empresaRegistroDesde?: string
  empresaRegistroHasta?: string
}

export interface PaginacionBusquedaApd {
  pagina: number
  limite: number
  filtro?: string
}

/** Persona resumida que el listado agrega por caso (sin detalle completo). */
export interface PersonaResumenApd {
  casosId: string
  deId: string
  nombreCompleto: string | null
  numeroDocumento: string | null
}

export interface TotalesCasoApd {
  personas: number
  actuaciones: number
  registrosBienes: number
  /** Suma de bigints: llega como texto para no perder precisión. */
  cantidadBienes: string
  empresas: number
}

export interface FilaCasoApd {
  casosId: string
  numeroCasoGiaef: string | null
  nombreCaso: string | null
  numeroCaso: string | null
  numeroCasoFiscalia: string | null
  /** Llega como texto; puede ser cadena vacía en lugar de null. */
  cud: string | null
  fechaInicio: string | null
  estado: string | null
  departamentoCodigo: string | null
  unidadAbreviada: string | null
  unidadId: string | null
  unidad: string | null
  distritalId: string | null
  distrital: string | null
  grupoId: string | null
  grupo: string | null
  etapaInvestigacionId: string | null
  etapaInvestigacion: string | null
  estadoProcesalId: string | null
  estadoProcesal: string | null
  personasInvestigadas: PersonaResumenApd[]
  totales: TotalesCasoApd
}

export interface DatosBuscarApd {
  total: number
  filas: FilaCasoApd[]
}

export interface RespuestaBuscarApd {
  finalizado: boolean
  mensaje: string
  datos: DatosBuscarApd
}

/* ── Catálogos ────────────────────────────────────────────────────────────── */

export interface ItemCatalogo {
  id: string
  descripcion: string | null
}

export interface ItemCatalogoVinculado extends ItemCatalogo {
  unidadId?: string
  distritalId?: string
  etapaId?: string
  categoriaId?: string
  claseId?: string
}

export interface ItemDepartamento {
  codigo: string
}

/** GET /catalogos no devuelve `mensaje`, sólo `finalizado` y `datos`. */
export interface RespuestaCatalogosApd {
  finalizado: boolean
  datos: CatalogosApd
}

export interface CatalogosApd {
  departamentos: ItemDepartamento[]
  unidades: ItemCatalogo[]
  distritales: ItemCatalogoVinculado[]
  grupos: ItemCatalogoVinculado[]
  etapasInvestigacion: ItemCatalogo[]
  estadosProcesales: ItemCatalogoVinculado[]
  tipologias: ItemCatalogo[]
  tiposInforme: ItemCatalogo[]
  paises: ItemCatalogo[]
  estadosCiviles: ItemCatalogo[]
  profesiones: ItemCatalogo[]
  tiposDocumento: ItemCatalogo[]
  situacionesPersona: ItemCatalogo[]
  categoriasBien: ItemCatalogo[]
  clasesBien: ItemCatalogoVinculado[]
  tiposBien: ItemCatalogoVinculado[]
  caracteristicas: ItemCatalogoVinculado[]
  situacionesJuridicasBien: ItemCatalogo[]
  situacionesEmpresa: ItemCatalogo[]
  vinculosEmpresa: ItemCatalogo[]
  situacionesLegalesBien: ItemCatalogo[]
}

/* ── Detalle del caso ─────────────────────────────────────────────────────── */

export interface EventoHistorialApd {
  id: string
  fecha: string | null
  fechaRegistro: string | null
  descripcion?: string | null
  tipo?: string | null
  situacionId?: string | null
  documento?: string | null
  numeroResolucion?: string | null
}

export interface PersonaDetalleApd {
  deId: string
  nombres: string | null
  apellidoPaterno: string | null
  apellidoMaterno: string | null
  apellidoEsposo: string | null
  nombreCompleto: string | null
  numeroDocumento: string | null
  tipoDocumentoId: string | null
  tipoDocumento: string | null
  sexo: string | null
  paisId: string | null
  pais: string | null
  estadoCivil: string | null
  profesion: string | null
  relacion: string | null
  observaciones: string | null
  fechaRegistro: string | null
  situacionJuridicaActualId: string | null
  situacionJuridicaActual: string | null
  historialSituaciones: EventoHistorialApd[]
}

export interface CaracteristicaBienApd {
  id: string
  caracteristicaId: string | null
  caracteristica: string | null
  valor: string | null
}

export interface BienDetalleApd {
  itemBienSecId: string
  opId: string
  tipoBienId: string | null
  tipo: string | null
  clase: string | null
  categoria: string | null
  cantidad: number | null
  valorAproximado: number | null
  valorCuantificado: number | null
  lugarSecuestro: string | null
  latitud: number | null
  longitud: number | null
  /** El módulo LGI no lo expone: sólo el repositorio PD lo devuelve. */
  enInvestigacion: boolean | null
  pericia: boolean | null
  resultadoPericia: string | null
  fechaRegistro: string | null
  situacionLegalActual: string | null
  situacionJuridicaActualId: string | null
  situacionJuridicaActual: string | null
  caracteristicas: CaracteristicaBienApd[]
  historialLegal: EventoHistorialApd[]
  historialJuridico: EventoHistorialApd[]
}

export interface EmpresaDetalleApd {
  empId: string
  opId: string
  nombre: string | null
  nit: string | null
  matricula: string | null
  representante: string | null
  direccion: string | null
  capitalSocial: number | null
  observaciones: string | null
  pericia: boolean | null
  resultadoPericia: string | null
  documento: string | null
  latitud: number | null
  longitud: number | null
  vinculoId: string | null
  vinculo: string | null
  fechaRegistro: string | null
  situacionJuridicaActualId: string | null
  situacionJuridicaActual: string | null
  historialSituaciones: EventoHistorialApd[]
}

export interface ActuacionDetalleApd {
  opId: string
  numeroActuacion: string | null
  fechaInforme: string | null
  lugar: string | null
  descripcion: string | null
  tipoInformeId: string | null
  tipoInforme: string | null
  otroInforme: string | null
  bienes: BienDetalleApd[]
  empresas: EmpresaDetalleApd[]
}

export interface DetalleCasoApd
  extends Omit<FilaCasoApd, 'personasInvestigadas' | 'totales'> {
  personasInvestigadas: PersonaDetalleApd[]
  actuaciones: ActuacionDetalleApd[]
}

export interface RespuestaDetalleApd {
  finalizado: boolean
  datos: DetalleCasoApd
}
