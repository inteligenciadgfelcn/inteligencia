export interface CasoDetalleApiRow {
  casosId?: string
  casos_id?: string
  dptoavId?: string
  dptoav_id?: string
  uniAbrev?: string
  uni_abrev?: string
  disId?: string
  dis_id?: string
  descripcionGrupo?: string
  descripcion_grupo?: string
  nombreCaso?: string
  nombrecaso?: string
  tipoCaso?: string | null
  tipocaso?: string | null
  nroCasoGlaef?: string | null
  nrocasoglaef?: string | null
  nroCaso?: string
  nrocaso?: string
  nroCasoFis?: string | null
  nrocasofis?: string | null
  tiPenId?: string | null
  ti_pen_id?: string | null
  nroCasoIfp?: string | null
  nrocasoifp?: string | null
  cudIfp?: string
  cudifp?: string
  perddom?: string | null
  nroCasoPerdom?: string | null
  nrocasoperdom?: string | null
  ianus?: string | null
  etaInv?: string | null
  eta_inv?: string | null
  remiteFiscal?: string
  remitefiscal?: string
  remiteFecha?: string | null
  remitefecha?: string | null
  conformeA?: string
  conformea?: string
  fechaInicio?: string | null
  fechainicio?: string | null
  estado?: string
  fechaHoraIng?: string
  fechahoraing?: string
  usuario?: string
  usuarioActualizacion?: string | null
  usuario_actualizacion?: string | null
  fechaActualizacion?: string
  fecha_actualizacion?: string
  [key: string]: unknown
}

export interface CasoDetalle {
  casosId: string
  dptoavId: string
  uniAbrev: string
  disId: string
  descripcionGrupo: string
  nombreCaso: string
  tipoCaso: string | null
  nroCasoGlaef: string | null
  nroCaso: string
  nroCasoFis: string | null
  tiPenId: string | null
  nroCasoIfp: string | null
  cudIfp: string
  perddom: string | null
  nroCasoPerdom: string | null
  ianus: string | null
  etaInv: string | null
  remiteFiscal: string
  remiteFecha: string | null
  conformeA: string
  fechaInicio: string | null
  estado: string
  fechaHoraIng: string
  usuario: string
  usuarioActualizacion: string | null
  fechaActualizacion: string
}
