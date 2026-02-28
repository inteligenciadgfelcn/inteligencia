export interface DepartamentoType {
    idDepartamento: string
    descripcion: string
}

export interface UnidadType {
    idUnidad: string
    descripcion: string
}

export interface LetraType {
    codigo: string
    esMostrable: boolean
}

export interface AsignacionType {
    idAsignacion: string
    idDepartamento: string
    idUnidad: string
    codigoLetra: string
    numeroCaso: string
    numeroOperativo: string
    fechaOperativo: string | null
    nombreCaso: string
    asignacionCaso: string
    codigoServicio: string
    fiscalAsignado: string
    fechaHoraRegistro: string
    usuarioLogin: string
    departamento: DepartamentoType
    unidad: UnidadType
    letra: LetraType
}

export interface AsignacionesRespuesta {
    finalizado: boolean
    mensaje: string
    datos: AsignacionType[]
}
