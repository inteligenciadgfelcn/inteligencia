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
