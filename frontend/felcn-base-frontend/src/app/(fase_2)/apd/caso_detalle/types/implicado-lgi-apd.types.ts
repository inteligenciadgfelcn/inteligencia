export interface ImplicadoRow {
  id: string
  operativoId: string
  tipoImplicadoId: string
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  apellidoEsposo: string
  tipoDocumentoId: string
  numeroDocumento: string
  fechaHoraIngreso?: string
  usuario?: string
  empresaId?: number | null
  fechaHoraActualizacion?: string | null
  usuarioActualizacion?: string | null
  estado?: string
}

export interface TipoImplicado {
  idTipoImplicado: string
  descripcion: string
}

export interface TipoDocumentoLgi {
  td_id: string
  descripcion: string
}

export interface ImplicadoPayload {
  operativoId: string
  tipoImplicadoId: string
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  apellidoEsposo: string
  tipoDocumentoId: string
  numeroDocumento: string
  empresaId?: number | null
}

export const IMPLICADO_POR_DEFECTO = {
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  apellidoEsposo: '',
  tipoImplicadoId: '',
  tipoDocumentoId: '',
  numeroDocumento: '',
}
