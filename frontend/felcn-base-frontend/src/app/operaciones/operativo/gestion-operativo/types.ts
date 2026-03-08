export interface GestionOperativoItem {
    id: number
    codigo: string
    nombreCaso: string
    fechaRegistro: string
    estado: string
}

export interface GestionOperativoCabeceraPayload {
    codigo?: string
    nombreCaso?: string
    descripcion?: string
}

export interface SeccionPayloadBase {
    [key: string]: unknown
}
