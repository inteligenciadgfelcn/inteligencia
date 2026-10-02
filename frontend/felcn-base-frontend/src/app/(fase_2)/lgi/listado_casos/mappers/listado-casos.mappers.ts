import { formatFecha as formatFechaUtil } from '../../utils/fechas'

import type {
  AsignacionCasoApiRow,
  AsignacionCasoListadoRow,
} from '../types/listado-casos.types'

export const mapAsignacionCasoRow = (
  row: AsignacionCasoApiRow
): AsignacionCasoListadoRow => ({
  casos_id: row.casos_id,
  dptoav_id: row.dptoav_id,
  uni_abrev: row.uni_abrev,
  dis_id: row.dis_id,
  nombrecaso: row.nombrecaso,
  nrocasogiaef: row.nrocasogiaef,
  nrocaso: row.nrocaso,
  nrocasofis: row.nrocasofis,
  cudifp: row.cudifp,
  perddom: row.perddom,
  eta_inv: row.eta_inv,
  remitefiscal: row.remitefiscal,
  conformea: row.conformea,
  fechainicio: row.fechainicio ?? '',
  fechahoraing: row.fechahoraing ?? '',
  regional: row.regional,
  etapaInvestigacion: row.etapaInvestigacion,
  usuario: row.usuario,
  usuario_actualizacion: row.usuario_actualizacion ?? '',
  fecha_actualizacion: '',
  estado: '',
  descripcion_grupo: '',
  responsable_llenado: '',
  codigo_servicio: '',
  unidad: '',
  puesto: ''
})

export const formatFecha = (fecha: string | null | undefined): string =>
  formatFechaUtil(fecha, 'dd/MM/yyyy')
