export interface ActuacionRow {
  opId: string
  casosId: string
  opNrooper: string
  opFechainf: string
  dptoId: string | null
  provId: string | null
  locId: string | null
  opLugar: string | null
  uniId: string | null
  disId: string | null
  opDescripcion: string
  idEtapa: number
  idEstado: number
  diasOtorgados: number
  idTipoInforme: number
  otroInforme: string
  fechaRecepcionFiscalia: string
  rutaArchivo: string | null
  estado: string
  fechaHoraIng: string
  usuario: string
  usuarioActualizacion: string | null
  fechaActualizacion: string
  [key: string]: unknown
}

export interface TipoInforme {
  id: number
  descripcion: string
}

export interface Etapa {
  et_id: number
  descripcion: string
}

export interface DetalleEtapa {
  estId: number
  etId: string
  descripcion: string
}

export interface ActuacionPayload {
  casosId: number
  opNrooper: string
  idTipoInforme: number
  idEtapa: number
  idEstado: number
  diasOtorgados: number
  fechaRecepcionFiscalia: string
  opDescripcion: string
  archivo?: File
}
