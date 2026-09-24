export interface GestionOperativoItem {
  idCaso: string
  unidadDescripcion: string
  distritaleDescripcion: string
  grupoDescripcion: string
  numeroCaso: string
  numeroCasoPerDom: string
  numeroOperativo: string
  nombreCaso: string
  asignadoCaso: string
  fiscalAsignadoCaso: string
  ianus?: string
  /** true cuando existe la fila en la tabla operativo (solo en el listado de no aprobados) */
  tieneOperativo?: boolean
  id?: number | string
  idOperativo?: number | string
  departamento?: string
  idDepartamentoCaso?: string
  abreviaturaUnidad?: string
  idDistrital?: number
  idGrupo?: number
  numeroInforme?: string
  fechaOperativo?: string
  descripcionOperativo?: string
}

export interface GestionOperativoCabeceraPayload {
  codigo?: string
  nombreCaso?: string
  descripcion?: string
}

export interface SeccionPayloadBase {
  [key: string]: unknown
}
