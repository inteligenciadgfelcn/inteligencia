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
  id?: number | string
  idOperativo?: number | string
}

export interface GestionOperativoCabeceraPayload {
  codigo?: string
  nombreCaso?: string
  descripcion?: string
}

export interface SeccionPayloadBase {
  [key: string]: unknown
}
