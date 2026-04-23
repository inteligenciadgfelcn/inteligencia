export type SelectOption<T = unknown> = {
  value: number
  label: string
  original: T
}

export interface CasoResumen {
  mensaje: string | null
  numeroCaso: string | null
  nombreCaso: string | null
  asignado: string | null
  fiscalAsignado: string | null
}

export interface Provincia {
  idProvincia: number
  descripcion: string
}

export interface Municipio {
  idLocalidad: number
  descripcion: string
}

export interface CategoriaOperativo {
  idCategoriaOperativo: number
  descripcion: string
}

export interface IdItemOperativo {
  idItemOperativo: number
  descripcion: string
}

export interface Unidad {
  id: number
  descripcion: string
}

export interface Distrito {
  idDistrital: number
  descripcion: string
}

export interface Grupo {
  idGrupo: number
  descripcion: string
}

export interface Pais {
  id: number
  descripcion: string
}

export interface TipoDocumento {
  id: number
  descripcion: string
}

export interface EstadoPersona {
  id: number
  descripcion: string
}

export interface OperativoPayload {
  codigoRadiograma: string
  fechaHoraOperativo: string
  idDepartamento: number
  idProvincia: number
  idMunicipio: number
  localidadODireccion: string
  operativoRealizadoEn: string
  unidadOperativa: string
  alMandoDe: string
  resumen: string
}

export interface PersonaPayload {
  nombres: string
  paterno: string
  materno: string
  apEsposo?: string
  idPais: number
  sexo: 'MASCULINO' | 'FEMENINO'
  direccion: string
  idTipoDocumento: number
  numeroDocumento: string
  idEstado: number
}

export interface RegistroCompletoPayload {
  nroCaso: string
  operativo: OperativoPayload
  persona: PersonaPayload
}

export interface RegistroResponse {
  idRegistro: string
  mensaje: string
}
