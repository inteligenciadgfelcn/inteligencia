export interface OperativoListadoItem {
  idOperativo: number
  numeroCaso: string
  numeroOperativo: string
  fechaOperativo: string
  lugar: string
  mando: string
  descripcion: string
  revisado: boolean
  actualizacion: string | null
  fechaCreacion: string
  usuarioCreacion: string
  fechaActualizacion: string | null
  usuarioActualizacion: string | null
  departamento?: {
    descripcion: string
  } | null
  provincia?: {
    descripcion: string
  } | null
  municipio?: {
    descripcion: string
  } | null
  unidad?: {
    descripcion: string
  } | null
  distrito?: {
    descripcion: string
  } | null
  grupo?: {
    descripcion: string
  } | null
  categoriaOperativo?: {
    descripcion: string
  } | null
  itemOperativo?: {
    descripcion: string
  } | null
}

export interface OperativosResponse {
  finalizado: boolean
  mensaje: string
  datos: {
    total: number
    filas: OperativoListadoItem[]
  }
}
