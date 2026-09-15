export type FiliacionValor = 'TODOS' | 'FILIADO' | 'SIN_FILIAR'

export type FormatoExportacion = 'pdf' | 'csv' | 'excel' | 'json'

export interface FiltrosVariablesCruzadas {
  numeroCaso?: string
  nombreCaso?: string
  cud?: string
  nombres?: string
  apellidoPaterno?: string
  apellidoMaterno?: string
  apellidoEsposo?: string
  idPais?: number
  genero?: 'MASCULINO' | 'FEMENINO'
  fechaNacimientoDesde?: string
  fechaNacimientoHasta?: string
  numeroDocumento?: string
  direccion?: string
  estadoPersona?: string
  fechaRegistroDesde?: string
  fechaRegistroHasta?: string
  fechaOperativoDesde?: string
  fechaOperativoHasta?: string
  idUnidad?: number
  idGrupo?: number
  idDistrito?: number
  idDepartamento?: number
  filiacion?: FiliacionValor
  idEstadoCivil?: number
  estaVivo?: boolean
  fechaIngresoSiiDesde?: string
  fechaIngresoSiiHasta?: string
}

export interface DatosSiiFila {
  nombres: string
  apellido_paterno: string
  apellido_materno: string
  apellido_esposo: string
  id_pais: number
  pais: string
  genero: string
  fecha_nacimiento: string
  id_estado_civil: number
  estado_civil: string
  direccion: string
  esta_vivo: boolean
  tiene_tarjeta: boolean
  fecha_ingreso: string
  documentos: string[]
}

export interface FilaResultado {
  id_caso: string
  numero_caso: string
  nombre_caso: string
  cud: string | null
  id_departamento_caso: string
  id_distrital_asignacion: number
  id_grupo_asignacion: number
  abreviatura_unidad: string
  numero_operativo_asignacion: string
  id_operativo: string
  fecha_operativo: string
  lugar: string
  id_departamento_operativo: number
  id_provincia: number
  id_localidad: number
  id_unidad: number
  id_distrital_operativo: number
  id_grupo_operativo: number
  es_positivo: boolean
  es_aprehendido: boolean
  es_arrestado: boolean
  id_persona_auxiliar: string
  nombres_auxiliar: string
  apellido_paterno_auxiliar: string
  apellido_materno_auxiliar: string
  apellido_esposo_auxiliar: string
  id_pais_auxiliar: number
  id_tipo_documento_auxiliar: number
  documento_auxiliar: string
  fecha_nacimiento_auxiliar: string
  direccion_auxiliar: string
  estado_persona: string
  fecha_registro_persona: string
  genero_auxiliar_codigo: string
  enviado: number
  genero_auxiliar: string
  edad: number
  filiacion: string
  id_detenido: number | null
  datos_sii: DatosSiiFila | null
  coincidencia_sii: string
}

export interface DatosBuscarVariablesCruzadas {
  total: number
  filas: FilaResultado[]
}

export interface RespuestaBuscarVariablesCruzadas {
  finalizado: boolean
  mensaje: string
  datos: DatosBuscarVariablesCruzadas
}