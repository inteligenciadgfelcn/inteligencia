import dayjs from 'dayjs'

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
  regional: row.regional,
  etapaInvestigacion: row.etapaInvestigacion,
})

export const formatFecha = (fecha: string | null | undefined): string =>
  fecha ? dayjs(fecha).format('DD/MM/YYYY') : '-'
