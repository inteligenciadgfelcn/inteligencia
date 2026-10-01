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
  casos_id: string;
  dptoav_id: string;
  uni_abrev: string;
  dis_id: string;
  nombrecaso: string;
  nrocasogiaef: string;
  nrocaso: string;
  nrocasofis: string;
  perddom: boolean;
  eta_inv: string;
  remitefiscal: string;
  conformea: string;
  fechainicio: string;
  fechahoraing: string;
  usuario: string;
  usuario_actualizacion: string;
  fecha_actualizacion: string;
  estado: string;
  descripcion_grupo: string;
  responsable_llenado: string;
  codigo_servicio: string;
  cudifp: string;
  etapaInvestigacion: string;
  unidad: string;
  regional: string;
  puesto: string;
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
