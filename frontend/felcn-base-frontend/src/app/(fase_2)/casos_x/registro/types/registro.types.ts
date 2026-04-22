export type SelectOption<T = unknown> = {
  value: number
  label: string
  original: T
}

export interface CasoResumen {
  nroCaso: string
  nombreCaso: string
  asignadoAlCaso: string
  fiscalAsignado: string
  operativoRegistrado: boolean
}

export interface Departamento {
  id: number
  descripcion: string
}

export interface Provincia {
  id: number
  idDepartamento: number
  descripcion: string
}

export interface Municipio {
  id: number
  idProvincia: number
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
