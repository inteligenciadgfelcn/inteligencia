import dayjs from 'dayjs'

import { formatFecha as formatFechaUtil } from '../../utils/fechas'

import type {
  AsignacionCasoApiRow,
  AsignacionCasoListadoRow,
} from '../types/listado-casos.types'

export const mapAsignacionCasoRow = (
  row: AsignacionCasoApiRow
): AsignacionCasoListadoRow => ({
  casosId: row.casos_id,
  dptoavId: row.dptoav_id,
  uniAbrev: row.uni_abrev,
  disId: row.dis_id,
  nombreCaso: row.nombrecaso,
  tipoCaso: row.tipocaso,
  nroCasoGiaef: row.nrocasogiaef,
  nroCaso: row.nrocaso,
  nroCasoFis: row.nrocasofis,
  cudIfp: row.cudifp,
  perddom: row.perddom,
  nroCasoPerdom: row.nrocasoperdom,
  ianus: row.ianus,
  etaInv: row.eta_inv,
  remiteFiscal: row.remitefiscal,
  remiteFecha: row.remitefecha,
  conformeA: row.conformea,
  fechaInicio: row.fechainicio,
  fechahoraing: row.fechahoraing,
  regional: row.regional,
  etapaInvestigacion: row.etapaInvestigacion,
})

export const formatFecha = (fecha: string | null | undefined): string =>
  formatFechaUtil(fecha, 'dd/MM/yyyy')

export const calcularDiasTranscurridos = (
  fecha: string | null | undefined
): number | null => {
  if (!fecha) return null
  const d = dayjs(fecha)
  if (!d.isValid()) return null
  return dayjs().startOf('day').diff(d.startOf('day'), 'day')
}
