export interface Vinculo {
  idVinculo: number
  descripcion: string
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
  quienAutoriza?: string
  aQuienEntregan?: string
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
  propietarioSocio?: string | null
  beneficiariosFinales?: string | null
  capitalSocial?: string | null
  direccion?: string | null
  latitud?: string | null
  longitud?: string | null
  idTipoVinculo?: string | null
  pericia: boolean
  resultado?: string | null
  documento?: string | null
  fechaHoraIngreso?: string
  usuario?: string | null
  tieneImagen?: boolean
  tieneDocumento?: boolean
  tipoVinculo?: (TipoVinculo & { vinculo?: Vinculo | null }) | null
  ultimaSituacionJuridica?: UltimaSituacionJuridicaEmpresa | null
  [key: string]: unknown
}

export interface SituacionJuridicaEmpresaPayload {
  idEmpresa: number
  fecha: string
  quienAutoriza: string
  aQuienEntregan: string
  idTipoSituacionJuridica: number
}

export const VALORES_POR_DEFECTO = {
  nombre: '',
  nit: '',
  matricula: '',
  representante: '',
  observaciones: '',
  propietarioSocio: '',
  beneficiariosFinales: '',
  capitalSocial: '',
  direccion: '',
  latitud: null as number | null,
  longitud: null as number | null,
  idVinculo: 0,
  idTipoVinculo: 0,
  pericia: false,
  resultado: '',
  fecha: '',
  quienAutoriza: '',
  aQuienEntregan: '',
  idTipoSituacionJuridica: 0,
  imagen: null as File | null,
  documento: null as File | null,
}