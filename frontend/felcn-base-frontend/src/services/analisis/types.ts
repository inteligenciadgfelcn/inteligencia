// ─── Shared ───────────────────────────────────────────────────────────────────

export interface RespuestaApi<T = unknown> {
  finalizado: boolean
  mensaje: string
  datos: T
}

// ─── Lookups ──────────────────────────────────────────────────────────────────

export interface LookupSimple {
  id: number | string
  descripcion: string
}

// ─── Casos ────────────────────────────────────────────────────────────────────

export interface CasoS2i {
  [x: string]: any
  idCaso: string
  idPais: number
  lugar: string
  nombreCaso: string
  palabraClave: string
  idEstadoCaso: number
  nroCasoCer: string
  idEtapaInvestigacion: number
  fechaInicio: string
  antecedentes: string
  usuario: string
  fechaHoraIngreso: string
  descripcionPais?: string
  descripcionEstadoCaso?: string
  descripcionEtapa?: string
}

export interface CreateCasoPayload {
  idPais: number
  lugar: string
  nombreCaso: string
  palabraClave?: string
  idEstadoCaso: number
  nroCasoCer?: string
  idEtapaInvestigacion: number
  fechaInicio: string
  antecedentes: string
}

// ─── Blancos ──────────────────────────────────────────────────────────────────

export interface BlancoS2i {
  idBlanco: string
  idCaso: string
  deNombres: string
  dePaterno: string
  deMaterno: string
  deEsposo: string
  alias: string
  idPais: number
  usuario: string
  fechaHoraIngreso: string
  descripcionPais?: string
}

export interface CreateBlancoPayload {
  deNombres: string
  dePaterno: string
  deMaterno?: string
  deEsposo?: string
  alias?: string
  idPais: number
}

export interface AntecedenteBlanco {
  idAntecedente: string
  idBlanco: string
  idTipoDelito: number
  idPais: number
  lugarHecho: string
  nroCaso: string
  fechaHecho: string
  hecho: string
  descripcionTipoDelito?: string
  descripcionPais?: string
}

export interface CreateAntecedentePayload {
  idTipoDelito: number
  idPais: number
  lugarHecho: string
  nroCaso: string
  fechaHecho: string
  hecho: string
}

export interface RedSocial {
  idRedSocial: string
  idBlanco: string
  tipoRed: string
  direccion: string
}

export interface CreateRedSocialPayload {
  tipoRed: string
  direccion: string
}

// ─── SIG (compartido) ─────────────────────────────────────────────────────────

export interface LugarSig {
  // blanco
  idLugarBlanco?: string
  // empresa
  idLugarEmpresa?: string
  // bien
  idLugarBien?: string
  descripcion: string
  coordenadasX: number
  coordenadasY: number
  contenido: string
}

export interface CreateLugarSigPayload {
  descripcion: string
  coordenadasX: number
  coordenadasY: number
  contenido: string
}

// ─── Archivos (compartido) ────────────────────────────────────────────────────

export interface ArchivoS2i {
  // blanco
  idArchivo?: string
  // bien
  idArchivoBien?: string
  idContenidoCaso: number | string
  tipo: string
  nombre: string
  nombreArchivo: string
  descripcionContenido?: string
}

export interface CreateArchivoPayload {
  idContenidoCaso: number | string
  tipo: string
  nombre: string
}

// ─── Organizaciones ───────────────────────────────────────────────────────────

export interface EmpresaS2i {
  idEmpresa: string
  idCaso: string
  idTipoOrganizacion: number
  nombre: string
  nit: string
  matricula: string
  representante: string
  observaciones: string
  usuario: string
  fechaHoraIngreso: string
  descripcionTipoOrganizacion?: string
}

export interface CreateEmpresaPayload {
  idTipoOrganizacion: number
  nombre: string
  nit?: string
  matricula?: string
  representante?: string
  observaciones?: string
}

// ─── Bienes ───────────────────────────────────────────────────────────────────

export interface BienS2i {
  idItemBienSecundario: string
  idCaso: string
  idCatalogoTipo: number
  idTipoInvestigacionBien: number
  usuario: string
  fechaHoraIngreso: string
  descripcionTipo?: string
  descripcionClase?: string
  descripcionBien?: string
  descripcionTipoInvestigacion?: string
}

export interface CreateBienPayload {
  idCatalogoTipo: number
  idTipoInvestigacionBien: number
}

export interface CaracteristicaBien {
  idItemBienCaracteristica: number
  idItemBienSecundario: string
  idCatalogoCaracteristica: number
  descripcion: string
  descripcionCaracteristica?: string
}

export interface CreateCaracteristicaPayload {
  idCatalogoCaracteristica: number
  descripcion: string
}

// ─── Telefonía ────────────────────────────────────────────────────────────────

export interface TelefonoS2i {
  idTelefono: string
  idCaso: string
  numero1: string
  propietario1: string
  mensaje: string
  numero2: string
  propietario2: string
}

export interface CreateTelefonoPayload {
  numero1: string
  propietario1: string
  mensaje: string
  numero2: string
  propietario2: string
}

// ─── Vehículos ────────────────────────────────────────────────────────────────

export interface VehiculoS2i {
  idVehiculo: string
  idCaso: string
  propietario: string
  placa: string
  color: string
  marca: string
}

export interface CreateVehiculoPayload {
  propietario: string
  placa: string
  color: string
  marca: string
}
