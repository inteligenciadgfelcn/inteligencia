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
  fechaRequerimiento?: string
  fiscalRequirente?: string | null
  calbId?: number | null
  fechaEntrega?: string | null
  responsableEntrega?: string
  responsableRecepcion?: string
  institucion?: string
  ubicacion?: string | null
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
  idVinculo: 0,
  idTipoVinculo: 0,
  nombreCompletoVinculo: '',
  cedulaIdentidadVinculo: '',
  nombreDepositario: '',
  ciDepositario: '',
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
  fechaRequerimiento: '',
  fiscalRequirente: '',
  calbId: null as number | null,
  fechaEntrega: '',
  responsableEntrega: '',
  responsableRecepcion: '',
  institucion: '',
  ubicacion: '',
  fotografias: [] as File[],
}