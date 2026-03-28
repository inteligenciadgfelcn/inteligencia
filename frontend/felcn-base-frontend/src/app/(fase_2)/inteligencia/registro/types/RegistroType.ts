export interface RegistroTypeCRUD {
  id: number
  estado: string
  departamento: Departamento
  grupo: Grupo
  nroOperativo: string
  nombreCaso: string
  fechaSolicitud: string
  asignado: string
  fiscalAsignado: string
}

export interface Departamento {
  id: number
  nombre: string
}

export interface Grupo {
  id: number
  distrital: Distrital
}

export interface Distrital {
  id: number
  unidad: Unidad
}

export interface Unidad {
  id: number
  descripcion: string
}
