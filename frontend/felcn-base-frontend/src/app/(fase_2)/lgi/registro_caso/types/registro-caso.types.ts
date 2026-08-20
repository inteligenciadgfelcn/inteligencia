import type {
  CatalogoLgi,
  DepartamentoLgi,
  DistritalLgi,
  GrupoLgi,
} from '../../(parametricas)/types/parametricas.types'

export interface CatalogOption<T = unknown> {
  value: string
  label: string
  original: T
}

export interface DatosGeneralesFormValues {
  disId: CatalogOption<DistritalLgi> | null
  idGrupo: CatalogOption<GrupoLgi> | null
  departamento: CatalogOption<DepartamentoLgi> | null
  nombreCaso: string
  nroCaso: string
  cudIfp: string
  remiteFiscal: string
  conformeA: string
  controlJurisdiccional: string
}

export interface DatosGeneralesPayload {
  disId: number
  idGrupo: number
  dptoavId: string
  conformeA: string
  nombreCaso: string
  nroCaso: string
  cudIfp: string
  remiteFiscal: string
  controlJurisdiccional: string
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
  [key: string]: unknown
}

export interface PersonaImplicadaFormValues {
  nombres: string
  paterno: string
  materno: string
  esposo: string
  paisId: CatalogOption<CatalogoLgi> | null
  estadoCivilId: CatalogOption<CatalogoLgi> | null
  profesionId: CatalogOption<CatalogoLgi> | null
  tipoDocumentoId: CatalogOption<CatalogoLgi> | null
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

export interface SituacionLegalCatalogo {
  slId: number
  descripcion: string
  [key: string]: unknown
}

export interface SituacionJuridicaFormValues {
  situacionLegalId: CatalogOption<SituacionLegalCatalogo> | null
  fecha: string
}

export interface SituacionJuridicaPayload {
  detenidoId: number
  situacionLegalId: number
  fecha: string
}

export interface RespuestaCrud {
  message: string
  id: number
}

export interface RespuestaPaginadaDatos<T> {
  total: number
  filas: T[]
}
