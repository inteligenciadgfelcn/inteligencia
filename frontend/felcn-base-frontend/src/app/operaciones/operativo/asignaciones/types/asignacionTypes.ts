

export interface AsignacionType {
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
}

export interface AsignacionesRespuesta {
    finalizado: boolean
    mensaje: string
    datos: AsignacionType[]
}
