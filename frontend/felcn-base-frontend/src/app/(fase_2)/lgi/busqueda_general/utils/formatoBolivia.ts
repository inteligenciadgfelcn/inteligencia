import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * El backend serializa los timestamptz en UTC (p. ej. `2026-10-10T04:00:00.000Z`)
 * pero los fija en `America/La_Paz` dentro de la transacción. Sin fijar la zona,
 * `dayjs(fecha)` usa la del navegador y un usuario en UTC-5 ve el día corrido.
 *
 * No se extiende `lgi/utils/fechas.ts` a propósito: ese helper lo consumen las
 * siete páginas de reportes LGI y no deben cambiar de comportamiento.
 */
export const ZONA_HORARIA = 'America/La_Paz'

export type FormatoFechaBolivia = 'DD/MM/YYYY' | 'DD/MM/YYYY HH:mm'

/** Formatea una fecha del backend en la zona horaria de Bolivia. */
export const formatFechaBolivia = (
  fecha: string | null | undefined,
  formato: FormatoFechaBolivia = 'DD/MM/YYYY HH:mm',
  vacio = '—'
): string => {
  if (fecha == null || fecha === '') return vacio
  const d = dayjs(fecha)
  if (!d.isValid()) return String(fecha)
  return d.tz(ZONA_HORARIA).format(formato)
}

/** Formatea un monto de un bien como bolivianos. */
export const formatMontoBolivia = (
  valor: number | string | null | undefined
): string => {
  if (valor == null || valor === '') return '—'
  const n = typeof valor === 'string' ? Number(valor) : valor
  if (Number.isNaN(n)) return String(valor)
  return `Bs ${n.toLocaleString('es-BO', { maximumFractionDigits: 2 })}`
}

/** Normaliza los valores que el backend entrega como texto vacío en vez de null. */
export const textoOguion = (valor: string | null | undefined): string =>
  valor == null || valor === '' ? '—' : valor
