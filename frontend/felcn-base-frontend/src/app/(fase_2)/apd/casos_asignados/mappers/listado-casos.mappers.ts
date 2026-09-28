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

export interface TiempoTranscurrido {
  anos: number
  meses: number
  dias: number
}

export const calcularTiempoTranscurridos = (
  fecha: string | null | undefined
): TiempoTranscurrido | null => {
  if (!fecha) return null
  
  const start = dayjs(fecha)
  if (!start.isValid()) return null

  const now = dayjs().startOf('day')
  const startDate = start.startOf('day')

  // 1. Calcular años transcurridos
  const anos = now.diff(startDate, 'year')
  const afterYears = startDate.add(anos, 'year')

  // 2. Calcular meses restantes después de los años
  const meses = now.diff(afterYears, 'month')
  const afterMonths = afterYears.add(meses, 'month')

  // 3. Calcular días restantes después de los meses
  const dias = now.diff(afterMonths, 'day')

  return { anos, meses, dias }
}
