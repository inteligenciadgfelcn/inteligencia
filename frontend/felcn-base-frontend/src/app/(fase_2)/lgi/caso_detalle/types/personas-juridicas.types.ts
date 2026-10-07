import type { ImplicadoRow } from './implicado-lgi.types'

export interface Vinculo {
  idVinculo: number
  descripcion: string
  empresa?: boolean
}

export interface TipoVinculo {
  idTipoVinculo: number
  idVinculo: number
  descripcion: string
}

export interface TipoSituacionJuridicaEmpresa {
  idTipoSituacionJuridica: string
  descripcion: string
}

export interface UltimaSituacionJuridicaEmpresa {
  idSituacionJuridicaEmpresa?: string
  idEmpresa?: string
  fecha?: string
  fechaHoraIngreso?: string
  usuario?: string
  idTipoSituacionJuridica?: string
  descripcionTipo?: string
}

export interface PersonaJuridicaRow {
  empId: string
  opId: string
  nombre: string
  nit: string
  matricula: string
  representante: string
  observaciones?: string | null
  capitalSocial?: string | null
  direccion?: string | null
  latitud?: string | null
  longitud?: string | null
  idVinculo?: string | number | null
  pericia: boolean
  resultado?: string | null
  documento?: string | null
  fechaHoraIngreso?: string
  usuario?: string | null
  tieneImagen?: boolean
  tieneDocumento?: boolean
  vinculo?: { idVinculo: string | number; descripcion: string } | null
  ultimaSituacionJuridica?: UltimaSituacionJuridicaEmpresa | null
  implicados?: ImplicadoRow[]
  [key: string]: unknown
}

export interface SituacionJuridicaEmpresaPayload {
  idEmpresa: number
  fecha: string
  idTipoSituacionJuridica: number
}

export const VALORES_POR_DEFECTO = {
  nombre: '',
  nit: '',
  matricula: '',
  representante: '',
  observaciones: '',
  capitalSocial: '',
  direccion: '',
  latitud: null as number | null,
  longitud: null as number | null,
  idVinculo: 0,
  pericia: false,
  resultado: '',
  imagen: null as File | null,
  documento: null as File | null,
}

export const SITUACION_POR_DEFECTO = {
  fecha: '',
  idTipoSituacionJuridica: 0,
}
