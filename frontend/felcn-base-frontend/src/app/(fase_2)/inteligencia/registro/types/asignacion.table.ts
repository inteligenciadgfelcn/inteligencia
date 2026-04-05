export interface AsignacionTable {
  idAsignacion: string
  letra: null
  nroCaso: null
  nroCasoPerDom: null
  nroOperativo: string
  codigoServicio: string
  ianus: null
  nombreCaso: string
  nombreSolicitud: string
  telefonoSolicitud: string
  asignado: string
  telefonoAsignado: string
  fiscalAsignado: string
  telefonoFiscal: string
  etapaInvestigacion: null
  resultado: null
  fechaSolicitud: Date
  usuario: null
  departamento?: Departamento
  unidad: {
    idUnidad: string
    descripcion: string
  }
}

interface Departamento {
  idDepartamento: number
  abreviatura: string
  descripcion: string
  estado: string
}

interface Grupo {
  idGrupo: number
  descripcion: string
  estado: string
  distrital: Distrital
}

interface Distrital {
  idDistrital: number
  descripcion: string
  estado: string
  unidad: Unidad
}

interface Unidad {
  idUnidad: number
  abreviatura: string
  descripcion: string
  abreviaturaIcia: string
  es_operativa_admin: boolean
  abreviaturaReporte: string
  estado: string
}
