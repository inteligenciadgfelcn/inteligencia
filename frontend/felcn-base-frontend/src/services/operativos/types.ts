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
  id: number
  imagen: string
  descripcionLogo: string
  organizacion: string
  blanco?: string
  observacion?: string
  fotografia?: File
}
export interface DrogaCasoPayload {
  id: number
  idTipoDroga: number
  idEstadoDroga: number
  cantidadGramos: number
  cantidadUnidades: number
  idFormaTransporte: number
  idPaisProcedencia: number
  idPaisDestino: number
  observaciones?: string
  pruebaCampo?: File
  pesaje?: File
}
export interface ResponseDroga {
  id: number;
  idOperativo: string;
  idEstadoDroga: number;
  cantidadGramos: number;
  cantidadUnidades: number;
  idFormaTransporte: number;
  idPaisProcedencia: number;
  idPaisDestino: number;
  fechaHoraIngreso: string;
  usuario: string;
  urlFotoPruebaCampo: string;
  urlFotoPesaje: string;
}

export interface SustanciaPayload {
    cantidad: number
}

export interface SustanciaSolidaPayload extends SustanciaPayload {
    idSustanciaSolidaDescripcion: number
}

export interface SustanciaLiquidaPayload extends SustanciaPayload {
    idSustanciaLiquidaDescripcion: number
}

export interface SustanciaLiquidaRespuesta {
    id: number
    idOerativo: number
    idSustanciaLiquidaDescripcion: number
    cantidad: number
}
export interface EstadoDroga {
    id: number
    idTipoDroga: number
    descripcion: string 
}

export interface ItemCategoriaOperativo {
    id: number
    idCategoriaOperativo: number  
    descripcion: string
}

