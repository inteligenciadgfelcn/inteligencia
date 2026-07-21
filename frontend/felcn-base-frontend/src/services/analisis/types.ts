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
  numeroDocumento: string
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
  numeroDocumento: string
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

// ─── Flujo Telefónico ─────────────────────────────────────────────────────────

export interface FlujoTelefonico {
  idFlujo: string
  idBlanco: string
  empresa: string
  direccion: string
  numero: string
}

export interface CreateFlujoTelefonicoPayload {
  empresa: string
  direccion: string
  numero: string
}

export interface FlujoFiscalia {
  idFlujoFiscalia: string
  idFlujo: string
  servicio: string
  registro: string
  numeroA: string
  imeiA: string
  rbsA: string
  celdaA: string
  latA: number
  lonA: number
  numeroB: string
  titular: string
  imeiB: string
  rbsB: string
  celdaB: string
  latB: number
  lonB: number
  fechaHora: string
  duracion: string
}

export interface CreateFlujoFiscaliaPayload {
  servicio: string
  registro: string
  numeroA: string
  imeiA: string
  rbsA: string
  celdaA: string
  latA: number
  lonA: number
  numeroB: string
  titular: string
  imeiB: string
  rbsB: string
  celdaB: string
  latB: number
  lonB: number
  fechaHora: string
  duracion: string
}

// ─── Activo Patrimonial ───────────────────────────────────────────────────────

export interface ActivoPatrimonial {
  idActivoPatrimonial: string
  idBlanco: string
  idTipoActivo: number
  gestion: string
  contenido: string
  descripcionTipoActivo?: string
}

export interface CreateActivoPatrimonialPayload {
  idTipoActivo: number
  gestion: string
  contenido: string
}

// ─── OVISE ────────────────────────────────────────────────────────────────────

export interface Ovise {
  idOvise: string
  idBlanco: string
  lugar: string
  latitud: number
  longitud: number
  reporte: string
  accion: string
  tieneArchivo?: boolean
}

export interface CreateOvisePayload {
  lugar: string
  latitud: number
  longitud: number
  reporte: string
  accion: string
  archivo?: File
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

// ─── Flujo de Transporte — Conductor ─────────────────────────────────────────

export interface ConductorS2i {
  numeroDocumento: string
  nombres: string
  paterno: string
  materno: string
  esposo: string
  idPais: number
  sexo: string
  ocupacion: string
  direccion: string
}

export interface CreateConductorPayload {
  documento: string
  nombres: string
  paterno: string
  materno: string
  esposo: string
  sexo: string
  ocupacion: string
  dir1: string
  dir2: string
  nomdep: string
  nomprov: string
  nommun: string
  fechanac: string
}

// ─── Flujo de Transporte — Transporte ────────────────────────────────────────

export interface TransporteS2i {
  codigoTransporte: string
  tipo: string
  marca: string
  modelo: string
  clase: string
  tipoTransporte: string
  color: string
  chasis: string
  motor: string
}

export interface CreateTransportePayload {
  placa: string
  tipoVehiculo: string
  marca: string
  modelo: string
  clase: string
  color: string
  motor: string
  chasis: string
}

// ─── Flujo de Transporte — Lugar ─────────────────────────────────────────────

export interface LugarS2i {
  idLugar: number
  descripcion: string
}

export interface CreateLugarPayload {
  descripcion: string
}

// ─── Flujo de Transporte — Color ─────────────────────────────────────────────

export interface ColorS2i {
  id: number
  descripcion: string
  color: string
  hexadecimal: string
}

// ─── Flujo de Transporte — registro final ────────────────────────────────────

export interface FlujoTransporteS2i {
  idFlujoTransporte: string
  codigoTransporte: string
  numeroDocumento: string
  idLugar: number
  origen: string
  destino: string
  carga: string
  fechaHora: string
  idColor: number
  latitud: number
  longitud: number
}

export interface CreateFlujoTransportePayload {
  codigoTransporte: string
  numeroDocumento: string
  idLugar: number
  idColor: number
  origen: string
  destino: string
  carga: string
  fechaHora: string
  latitud: number
  longitud: number
}

export interface ColorSugeridoItemS2i {
  idColor: number
  origen: 'PERSONA' | 'VEHICULO'
}

export interface ColorSugeridoS2i {
  colores: ColorSugeridoItemS2i[]
}
