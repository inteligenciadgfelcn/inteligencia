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
  idTipoInforme: number
  otroInforme: string
  rutaArchivo: string | null
  estado: string
  fechaHoraIng: string
  usuario: string
  usuarioActualizacion: string | null
  fechaActualizacion: string
  tipologiasIdentificadas?: string | null
  verbosRectores?: string | null
  etapasCicloLgi?: string | null
  [key: string]: unknown
}

export interface ConclusionCasoPayload {
  tipologiasIdentificadas: string
  verbosRectores: string
  etapasCicloLgi: string
}

export interface TipoInforme {
  id: number
  descripcion: string
}

export interface ActuacionPayload {
  casosId: number
  opNrooper: string
  idTipoInforme: number
  otroInforme?: string
  opLugar: string
  opDescripcion: string
  archivo?: File
}
