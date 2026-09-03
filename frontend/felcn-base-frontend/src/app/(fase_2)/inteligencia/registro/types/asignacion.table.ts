export interface AsignacionTable {
  idAsignacion: string
  idDepartamento: string
  idUnidad: string
  codigoLetra: string | null
  nroCaso: string | null
  nroOperativo: string
  fechaOperativo: string
  nombreCaso: string
  nombreSolicitud: string
  codigoServicio: string
  fiscalAsignado: string
  idCasoSiii: number | null
  fechaSolicitud: string
  usuario: string
  departamento: {
    idDepartamento: string
    descripcion: string
  }
  unidad: {
    idUnidad: string
    descripcion: string
  }
  letra: string | null
  servicio: {
    codigoServicio: string
    usuarioPrincipal: string
    usuarioEmergencia: string
    fechaIngreso: string
    fechaSalida: string
    estado: string
  }
  siii: SiiiData
}

export interface SiiiData {
  id_caso: string
  id_departamento_caso: string
  abreviatura_unidad: string
  id_distrital: number
  id_grupo: number
  letras: string | null
  numero_caso: string | null
  numero_caso_per_dom: string | null
  numero_operativo: string
  codigo_servicio: string
  ianus: string | null
  nombre_caso: string
  fiscal_solicitud: string
  telefono_solicitud: string
  asignado_caso: string
  telefono_asignado: string
  fiscal_asignado_caso: string
  telefono_fiscal: string
  id_etapa_investigacion: string | null
  resultado: string | null
  fecha_hora_ingreso: string
  usuario: string
  _estado: string
  _transaccion: string
  _usuario_creacion: string
  _fecha_creacion: string
  _usuario_modificacion: string | null
  _fecha_modificacion: string | null
}
