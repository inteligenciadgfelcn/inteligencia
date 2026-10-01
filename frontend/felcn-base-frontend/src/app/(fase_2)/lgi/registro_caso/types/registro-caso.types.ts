import type {
  DepartamentoLgi,
  DistritalLgi,
  EstadoCivilLgi,
  GrupoLgi,
  InicioCasoLgi,
  PaisLgi,
  ProfesionLgi,
  TipoDocumentoLgi,
} from '../../(parametricas)/types/parametricas.types'

export interface CatalogOption<T = unknown> {
  value: string
  label: string
  original: T
}

export interface AsignacionLgiDetalle {
  casosId: string
  dptoavId: string
  uniAbrev: string
  disId: string
  descripcionGrupo: string
  nombreCaso: string
  nroCasoGiaef: string | null
  nroCaso: string
  nroCasoFis: string | null
  cudifp: string | null
  perddom: boolean | null
  nroCasoPerdom: string | null
  idEtapa: number | null
  remiteFiscal: string
  fechaRecepcionFiscalia: string | null
  conformeA: string
  inicioCaso: string | null
  codigoServicio: string | null
  fechaInicio: string | null
  idEstado: number | null
  diasOtorgados: number | null
  estado: string
  fechaHoraIng: string
  usuario: string
  usuarioActualizacion: string | null
  fechaActualizacion: string
}

export interface DatosGeneralesFormValues {
  disId: CatalogOption<DistritalLgi> | null
  idGrupo: CatalogOption<GrupoLgi> | null
  departamento: CatalogOption<DepartamentoLgi> | null
  nombreCaso: string
  nroCaso: string
  nroCasoFis: string
  remiteFiscal: string
  conformeA: string
  controlJurisdiccional: string
  fechaInicio: string
  inicioCaso: CatalogOption<InicioCasoLgi> | null
  codigoServicio: string
}

export interface DatosGeneralesPayload {
  disId: number
  idGrupo: number
  dptoavId: string
  conformeA: string
  nombreCaso: string
  nroCaso: string
  nroCasoFis: string
  remiteFiscal: string
  controlJurisdiccional?: string
  fechaInicio: string
  inicioCaso: string
  codigoServicio: string
  cudifp: string 
}

export interface UltimaSituacionJuridica {
  situacionId: string
  detenidoId: string
  situacionLegalId: string
  fecha?: string
  situacionLegal: {
    slId: number
    descripcion: string
  }
}

export interface SituacionJuridicaDetalle {
  situacionId: string
  detenidoId: string
  fecha: string
  situacionLegal?: {
    slId: number
    descripcion: string
  }
}

export interface PersonaDetalle {
  deId: string
  casosId: string
  nombres: string
  paterno: string
  materno: string
  numeroDocumento?: string
  situacionesJuridicas?: SituacionJuridicaDetalle[]
  [key: string]: unknown
}

export interface PersonaImplicadaRow {
  deId: number
  casoId: number
  nombres: string
  paterno: string
  materno: string
  esposo: string
  paisId: number
  estadoCivilId: number
  profesionId: number
  tipoDocumentoId: number
  numeroDocumento: string
  relacion: string
  observaciones: string
  estado: boolean
  fechahoraing: string
  ultimaSituacionJuridica: UltimaSituacionJuridica | null
  [key: string]: unknown
}

export interface PersonaImplicadaFormValues {
  nombres: string
  paterno: string
  materno: string
  esposo: string
  paisId: CatalogOption<PaisLgi> | null
  estadoCivilId: CatalogOption<EstadoCivilLgi> | null
  profesionId: CatalogOption<ProfesionLgi> | null
  tipoDocumentoId: CatalogOption<TipoDocumentoLgi> | null
  numeroDocumento: string
}

export interface PersonaImplicadaPayload {
  casoId: number
  nombres: string
  paterno?: string
  materno?: string
  esposo?: string
  paisId: number
  estadoCivilId: number
  profesionId: number
  tipoDocumentoId: number
  numeroDocumento: string
}

export interface PersonaImplicadaShortPayload {
  casoId: number
  nombres: string
  paterno?: string
  materno?: string
  esposo?: string
  tipoDocumentoId: number
  numeroDocumento: string
}

export interface SituacionLegalCatalogo {
  slId: number
  descripcion: string
  [key: string]: unknown
}

export interface SituacionJuridicaFormValues {
  situacionLegalId: CatalogOption<SituacionLegalCatalogo> | null
  fecha: string
  numeroResolucion: string
  lugar: string
  autoridad: string
  fjt: string
}

export interface SituacionJuridicaPayload {
  detenidoId: number
  situacionLegalId: number
  fecha: string
  numeroResolucion: string
  lugar: string
  autoridad: string
  fjt: string
}

export interface RespuestaCrud {
  message: string
  id: number
}

export interface RespuestaPaginadaDatos<T> {
  total: number
  filas: T[]
}
