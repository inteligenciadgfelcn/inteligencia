export type SolicitudRegistroEstadoType =
  | 'PENDIENTE_APROBACION'
  | 'APROBADA'
  | 'RECHAZADA'

export interface SolicitudRegistroType {
  id: string
  estado: SolicitudRegistroEstadoType
  nombres: string
  primerApellido?: string | null
  segundoApellido?: string | null
  nroDocumento: string
  fechaNacimiento: string
  correoElectronico: string
  telefono: string
  idGrado: number
  grado?: { id: number; abreviatura: string; descripcion: string } | null
  numeroPase: string
  fechaResolucion?: string | null
  idAdminResolutor?: string | null
  comentarioRechazo?: string | null
  idUsuarioCreado?: string | null
  fechaCreacion: string
}
