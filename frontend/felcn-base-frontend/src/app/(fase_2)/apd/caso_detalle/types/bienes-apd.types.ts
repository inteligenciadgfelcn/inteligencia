import type { PersonaImplicadaRow } from '../../registro_caso/types/registro-caso-apd.types'

export interface BienCatalogo {
  bienId: number
  descripcion: string
}

export interface ClaseBien {
  catClasId: number
  bienId: number
  descripcion: string
  fungible: boolean
}

export interface TipoBien {
  cattipoId: number
  catclasId: number
  descripcion: string
}

export interface CaracteristicaCatalogo {
  catcaracId: number
  catclasId: number
  descripcion: string
}

export interface Vinculo {
  idVinculo: number
  descripcion: string
}

export interface TipoVinculo {
  idTipoVinculo: number
  idVinculo: number
  descripcion: string
}

export interface TipoSituacionBien {
  etId: number
  descripcion: string
  tabla: string
}

export interface CalidadBien {
  calbId: number
  descripcion: string
}

export interface TipoDocumento {
  td_id: string
  descripcion: string
}

export interface SituacionBienPayload {
  itemBienSecId: string
  fiscalRequirente: string
  calbId: string
  fechaEntrega: string
  responsableRecepcion: string
  institucion?: string | null
  ubicacion?: string | null
  idTipoDocumento?: number | null
  numeroDocumento?: string | null
}

export interface PersonaVinculo {
  deId: number
  nombres?: string | null
  paterno?: string | null
  materno?: string | null
  esposo?: string | null
  tipoDocumentoId?: number | null
  numeroDocumento?: string | null
  sexo?: string | null
  estado?: boolean | null
  relacion?: string | null
  observaciones?: string | null
  tipoDocumento?: { tdId: number; descripcion: string } | null
  [clave: string]: unknown
}

export interface VinculoBienRow {
  idVinculoBien: string
  idDetenidoAuxiliar: number | null
  idVinculo: number | null
  idTipoVinculo: number | null
  fechaHoraIngreso?: string | null
  idItemBienSecuestrado?: string | null
  detenidoAuxiliar: PersonaVinculo | null
}

export interface VinculoBienPayload {
  idDetenidoAuxiliar: number
  idVinculo: number
  idTipoVinculo: number
  idItemBienSecuestrado: string
}

export interface VinculoBorradorRow {
  idDetenidoAuxiliar: number
  idVinculo: number
  idTipoVinculo: number
  vinculoDescripcion: string
  tipoVinculoDescripcion: string
  persona: PersonaImplicadaRow
}

export interface CaracteristicaBien {
  catcaracId: number
  descripcion: string
}

export interface BienSecuestradoRow {
  itembiensecId: string
  opId: number
  cattipoId: number
  costoAprox: number
  costoCuant?: number | null
  latitud?: number | null
  longitud?: number | null
  lugarSecuestro?: string | null
  idTipoVinculo?: number | null
  nombreCompletoVinculo?: string | null
  cedulaIdentidadVinculo?: string | null
  pericia: boolean
  resultadoPericia?: string | null
  nombreDepositario?: string | null
  ciDepositario?: string | null
  estado: string
  fechaHoraIngreso?: string
  usuario?: string
  categoriaTipo?: TipoBien
  tipoVinculo?: TipoVinculo | null
  caracteristicas?: CaracteristicaBien[]
  ultimaSituacionJuridica?: unknown
  [key: string]: unknown
}

export interface DatosSituacionJuridicaBien {
  fiscal?: string | null
  fechaActaSecuestro?: string
  investigador?: string | null
  nroResol?: string | null
  fechaResolucion?: string
  numSentJud?: string | null
  fechaSenjud?: string
  autoridad?: string | null
}

export interface SituacionJuridicaBienPayload {
  itembiensecId: number
  idTipoSituacionLegalBien: number
  datos: DatosSituacionJuridicaBien
}

export interface CaracteristicaPayload {
  itembiensecId: number
  catcaracId: number
  descripcion: string
}

export const VALORES_POR_DEFECTO = {
  bienId: 0,
  claseId: 0,
  tipoId: 0,
  caracteristicas: [] as CaracteristicaBien[],
  direccion: '',
  latitud: null as number | null,
  longitud: null as number | null,
  costoAprox: 0,
  costoCuant: 0,
  pericia: false,
  resultadoPericia: '',
  idTipoSituacionLegalBien: 0,
  fiscal: '',
  fechaActaSecuestro: '',
  investigador: '',
  nroResol: '',
  fechaResolucion: '',
  numSentJud: '',
  fechaSenjud: '',
  autoridad: '',
  calbId: null as number | null,
  fiscalRequirente: '',
  fechaEntrega: '',
  responsableRecepcion: '',
  institucion: '',
  ubicacion: '',
  idTipoDocumento: null as number | null,
  numeroDocumento: '',
  fotografias: [] as File[],
}
