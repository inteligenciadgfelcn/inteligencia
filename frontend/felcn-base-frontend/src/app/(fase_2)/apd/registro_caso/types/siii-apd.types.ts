export interface PersonaSiiiRow {
  id: string;
  idOperativo: string;
  idPais: number;
  idTipoDocumento: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  apellidoEsposo: string;
  nroDocumento: string;
  fechaNacimiento: string;
  genero: boolean;
  direccion: string;
  estado: string;
  fechaHoraIngreso: string;
  usuario: string;
  enviado: number;
  descripcionPais: string;
  descripcionTipoDocumento: string;
  generoTexto: string;
  urlFotoFrente: string;
  urlFotoDocumento: string;
  urlFotoPerfilIzquierdo: string;
}

export interface BienSiiiRow {
  estado: string;
  transaccion: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  id: string;
  idOperativo: string;
  idCatalogoTipo: number;
  cantidadBien: string;
  costoAproximado: number;
  costoCuantificado: number;
  enInvestigacion: boolean;
  fechaHoraIngreso: string;
  usuario: string;
  idCatalogoClase: number;
  idBien: number;
  descripcionCatalogoTipo: string;
  descripcionCatalogoClase: string;
  descripcionBien: string;
  urlFotoBien: string;
}

interface RespuestaPaginadaSiiiDatos<T> {
  filas: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface RespuestaPaginadaSiii<T> {
  finalizado: boolean;
  mensaje: string;
  datos: RespuestaPaginadaSiiiDatos<T>;
}

export interface PaginatedResult<T> {
  filas: T[];
  total: number;
}

export interface CasoSiiiRow {
  id_caso: string;
  id_departamento_caso: string;
  abreviatura_unidad: string;
  id_distrital: number;
  id_grupo: number;
  letras: string;
  numero_caso: string;
  numero_caso_per_dom: string | null;
  numero_operativo: string;
  codigo_servicio: string;
  ianus: string | null;
  nombre_caso: string;
  fiscal_solicitud: string;
  telefono_solicitud: string;
  asignado_caso: string;
  telefono_asignado: string;
  fiscal_asignado_caso: string;
  telefono_fiscal: string;
  id_etapa_investigacion: string | null;
  resultado: string | null;
  fecha_hora_ingreso: string;
  usuario: string;
  _estado: string;
  _transaccion: string;
  _usuario_creacion: string;
  _fecha_creacion: string;
  _usuario_modificacion: string;
  _fecha_modificacion: string;
  idOperativo: string;
  unidad: string;
  distrito: string;
  grupo: string;
}

export interface RespuestaCasoSiii {
  finalizado: boolean;
  mensaje: string;
  datos: {
    filas: CasoSiiiRow;
  };
}

export interface ConsultaSiiiQueryDto {
  codigoServicio?: string;
  fechaInicio?: string;
  fechaFin?: string;
  numeroCaso?: string;
  nombreCaso?: string;
  nombresPersona?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nroDocumento?: string;
}

export interface BienDetalleAvanzado {
  idItemBienSecuestrado: string;
  tipoBien: string;
  cantidad: number;
  costoAproximado: number;
  costoCuantificado: number;
  enInvestigacion: boolean;
  caracteristicas: Array<{
    idCatalogoCaracteristica: number;
    descripcion: string;
  }>;
  esSecuestrado: boolean;
  esIncautado: boolean;
  esConfiscado: boolean;
}

export interface ResultadoBusquedaAvanzada {
  idOperativo: string;
  fechaOperativo: string;
  numeroCaso: string;
  numeroOperativo: string;
  numeroInforme: string;
  ubicacionInstitucional: string;
  ubicacionGeografica: string;
  nombreCaso: string;
  ianus: string;
  fiscalSolicitud: string;
  asignado: string;
  asignadoFiscal: string;
  tipoOperativo: string;
  tipoRelevancia: string;
  colorRelevancia: string;
  categoriaOperativo: string;
  planOperacion: string;
  tipoDenuncia: string | null;
  tipoPenal: string | null;
  organizacion: string;
  alMandoDe: string;
  clanFamiliar: string | null;
  esPositivo: boolean;
  esAprehendido: boolean;
  esArrestado: boolean;
  esIcia: boolean;
  esParteDiario: boolean;
  esRevisado: boolean;
  coordX: number;
  coordY: number;
  personasImplicadas: string;
  detalleBienes: BienDetalleAvanzado[];
  costoTotalAproximadoBienes: number;
  costoTotalCuantificadoBienes: number;
}

export interface RespuestaBusquedaAvanzada {
  finalizado: boolean;
  mensaje: string;
  datos: {
    filas: ResultadoBusquedaAvanzada[];
  };
}