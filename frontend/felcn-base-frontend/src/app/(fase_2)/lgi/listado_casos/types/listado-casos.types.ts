export interface AsignacionCasoApiRow {
  casos_id: string
  dptoav_id: string
  uni_abrev: string
  dis_id: string
  nombrecaso: string
  tipocaso: string
  nrocasogiaef: string
  nrocaso: string
  nrocasofis: string
  ti_pen_id: string
  nrocasoifp: string
  cudifp: string
  perddom: boolean
  nrocasoperdom: string
  ianus: string
  eta_inv: string
  remitefiscal: string
  remitefecha: string | null
  conformea: string
  fechainicio: string | null
  fechahoraing: string
  usuario: string
  usuario_actualizacion: string | null
  fecha_actualizacion: string
  regional: string
  etapaInvestigacion: string
  [key: string]: unknown
}

export interface AsignacionCasoListadoRow {
  casosId: string
  dptoavId: string
  uniAbrev: string
  disId: string
  nombreCaso: string
  tipoCaso: string
  nroCasoGiaef: string
  nroCaso: string
  nroCasoFis: string
  cudIfp: string
  perddom: boolean
  nroCasoPerdom: string
  ianus: string
  etaInv: string
  remiteFiscal: string
  remiteFecha: string | null
  conformeA: string
  fechaInicio: string | null
  regional: string
  etapaInvestigacion: string
  [key: string]: unknown
}

export interface ListadoCasosParams {
  pagina: number
  limite: number
  filtro?: string
  orden?: string
}

export interface ListadoCasosResponse {
  total: number
  filas: AsignacionCasoApiRow[]
}
