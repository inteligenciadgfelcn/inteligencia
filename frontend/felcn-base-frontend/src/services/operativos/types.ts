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

export interface CasoResumen {
  idCaso: string
  numeroOperativo: string
  nombreCaso: string
  fiscalSolicitud: string
  telefonoSolicitud: string
  asignadoCaso: string
  telefonoAsignado: string
  fiscalAsignadoCaso: string
  telefonoFiscal: string
}
export interface OperativoPayload {
  numeroInforme: string
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
  gradosX?: number
  minX?: number
  segX?: number
  gradosY?: number
  minY?: number
  segY?: number
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
  costo?: number
  idFormaTransporte: number
  idPaisProcedencia: number
  idPaisDestino: number
  observaciones?: string
  pruebaCampo?: File
  pesaje?: File
}
export interface ResponseDroga {
  id: number
  idOperativo: string
  idTipoDroga?: number
  idEstadoDroga: number
  cantidadGramos: number
  cantidadUnidades: number
  costo?: number
  idFormaTransporte: number
  idPaisProcedencia: number
  idPaisDestino: number
  fechaHoraIngreso: string
  usuario: string
  urlFotoPruebaCampo: string
  urlFotoPesaje: string
  // Campos descripción (join de API)
  descripcionTipoDroga?: string
  descripcionEstadoDroga?: string
  descripcionFormaTransporte?: string
  descripcionPaisProcedencia?: string
  descripcionPaisDestino?: string
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
export interface EstadoDroga {
  id: number
  idTipoDroga: number
  descripcion: string
}

export interface CatalogoBien {
  id: number
  descripcion: string
}

export interface CatalogoClaseBien {
  id: number
  idBien: number
  descripcion: string
  esFungible: boolean
}

export interface CatalogoCaracteristica {
  id: number
  idCatalogoClase: number
  descripcion: string
}

export interface CatalogoTipoBien {
  id: number
  idCatalogoClase: number
  descripcion: string
}

export interface BienPayload {
  idCatalogoTipo: number
  cantidadBien: number
  costoAproximado: number
  costoCuantificado: number
  enInvestigacion: boolean
  foto?: File
}

export interface BienCaracteristicaPayload {
  idCatalogoCaracteristica: number
  descripcion: string
}

export interface BienCaracteristicaResponse {
  id: number
  idCatalogoCaracteristica: number
  descripcion: string
  descripcionCaracteristica: string
}

export interface BienResponse {
  id: string
  idOperativo: string
  idCatalogoTipo: number
  cantidadBien: string
  costoAproximado: number
  costoCuantificado: number
  enInvestigacion: boolean
  fechaHoraIngreso: string
  usuario: string
  idCatalogoClase: number
  idBien: number
  descripcionCatalogoTipo: string
  descripcionCatalogoClase: string
  descripcionBien: string
  urlFotoBien: string | null
}

export interface ItemCategoriaOperativo {
  id: number
  idCategoriaOperativo: number
  descripcion: string
}

export interface PersonaPayload {
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  apellidoCasada?: string
  /** true = Masculino, false = Femenino */
  genero: boolean
  idTipoDocumento: number
  nroDocumento: string
  fechaNacimiento: string
  direccion: string
  /** Valor exacto del enum: "Principal Implicado" | "Aprehendido" | "Arrestado" | "LGI O Perdida de Dominio" */
  estado: string
  idPais?: number
  fotoFrente?: File
  fotoDocumento?: File
  fotoPerfilIzquierdo?: File
}

export interface PersonaResponse {
  id: string
  idOperativo: string
  idPais: number
  idTipoDocumento: number
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  apellidoEsposo?: string
  nroDocumento: string
  fechaNacimiento: string
  /** true = Masculino, false = Femenino */
  genero: boolean
  direccion: string
  estado: string
  descripcionPais: string
  descripcionTipoDocumento: string
  urlFotoFrente: string | null
  urlFotoDocumento: string | null
  urlFotoPerfilIzquierdo: string | null
  fechaHoraIngreso?: string
  usuario?: string
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
export interface OperativoResponse {
  gradosX: number
  minX: number
  segX: number

  gradosY: number
  minY: number
  segY: number

  esRevisado: boolean
  esPositivo: boolean
  esAprehendido: boolean
  esArrestado: boolean
  esIcia: boolean
  esParteDiario: boolean

  id: number
  idCaso: string

  idTipoRelevancia: number
  numeroOperativo: string
  numeroInforme?: string
  idTipoDenuncia: number
  idTipoPenal: number

  fechaOperativo: string // o Date si lo transformas

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

  fechaHoraIngreso: string // o Date

  usuario: string
}

export interface GaleriaPayload {
  descripcion: string
  idTipoTamano: number
  foto?: File
}

export interface GaleriaResponse {
  id: number
  idOperativo: string
  descripcion: string
  idTipoTamano: number
  descripcionTipoTamano: string
  urlFotoThumbnail: string
  urlFotoMedium: string
  urlFotoFull: string
  fechaHoraIngreso?: string
  usuario?: string
}
