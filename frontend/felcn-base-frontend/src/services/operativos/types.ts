export interface RespuestaApi<T> {
    finalizado: boolean
    mensaje: string
    datos: T
}

export interface RespuestaApiPaginada<T> {
    filas: T[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
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

export interface SustanciaPayload {
    cantidad: number
    costo: number
}

export interface SustanciaSolidaPayload extends SustanciaPayload {
    idSustanciaSolidaDescripcion: number
}

export interface SustanciaSolidaRespuesta {
    id: number
    idOerativo: number
    idSustanciaSolidaDescripcion: number
    descripcionSustancia: string
    cantidad: number
    costo: number
}

export interface SustanciaLiquidaPayload extends SustanciaPayload {
    idSustanciaLiquidaDescripcion: number
}

export interface SustanciaLiquidaRespuesta {
    id: number
    idOerativo: number
    idSustanciaLiquidaDescripcion: number
    descripcionSustancia: string
    cantidad: number
    costo: number
}

export interface FabricaPayload {
    idTipoFabrica: number
    idFabricaModelo: number
    cantidad: number
    costo: number
}

export interface FabricaRespuesta {
    id: number
    idOerativo: number
    idFabricaModelo: number
    fabricaModelo: string
    cantidad: number
    costo: number
}
