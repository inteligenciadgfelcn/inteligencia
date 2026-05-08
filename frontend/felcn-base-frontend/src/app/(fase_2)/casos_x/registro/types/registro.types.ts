export interface Departamento {
  abreviatura: string
  descripcion: string
  idDepartamento: number
  estado: string
}

export interface RegistroCompletoPayload {
  numeroCaso: string | null
  numeroOperativo: string
  fechaOperativo: string
  idDepartamento?: string
  idProvincia?: number
  idLocalidad?: number
  lugar?: string
  idCategoriaOperativo?: number
  idItemOperativo?: number
  idUnidad?: number
  idDistrital?: number
  idGrupo?: number
  mando?: string
  [key: string]: unknown
}

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

/// Persona types
export interface Pais {
  idPais: number
  descripcion: string
}

export interface TipoDocumento {
  idTipoDocumento: number
  descripcion: string
}

export interface EstadoPersona {
  idEstado: number
  descripcion: string
}

export interface Detenido {
  idDetenido: number
  idOperativo: number
  nombreCompleto: string
  numeroDocumento: string
  genero: string
  idEstado: number
  estado: string
  tipoDocumento: string
  idTipoDocumento: 1
  pais: string
  idPais: number
  fechaCreacion: string
}
