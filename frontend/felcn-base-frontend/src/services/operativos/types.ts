export interface RespuestaApi<T> {
    finalizado: boolean
    mensaje: string
    datos: T
}

export interface GestionOperativoResumen {
    id: number
    codigo: string
    nombreCaso: string
    fechaRegistro: string
    estado: string
}

export interface GestionOperativoCabecera {
    id: number
    codigo: string
    nombreCaso: string
    descripcion?: string
}

export interface GestionOperativoCabeceraPayload {
    codigo?: string
    nombreCaso?: string
    descripcion?: string
}

export interface SeccionPayload {
    [key: string]: unknown
}

export interface OperativoPayload {
    numeroOperativo: string
    idTipoRelevancia: number
    idTipoDenuncia: number
    idTipoPenal: number
    fechaOperativo: string
    idDepartamento: number
    idProvincia: number
    idLocalidad: number
    lugar: string
    idCategoriaOperativo: number
    idItemOperativo: number
    idUnidad: number
    idDistrital: number
    idGrupo: number
    mando: string
    coordX: number
    coordY: number
    idPlanOperacion: number
    breveDetalle: string
    descripcion: string
    idTipoOperacion: number
    organizacion: string
    clanFamiliar: string
}

export interface LogotipoCasoPayload {
  imagen: string
  descripcionLogo: string
  organizacion: string
  blanco?: string
  observacion?: string
  fotografia?: File
}
