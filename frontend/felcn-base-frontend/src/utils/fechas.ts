import dayjs, { ManipulateType } from 'dayjs'
import { imprimir } from '@/utils/imprimir'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/es'

import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

// Agregar el plugin relativeTime a Dayjs
dayjs.extend(relativeTime)

// Configurar el idioma español como predeterminado en Dayjs
dayjs.locale('es')

export const stringToDate = (fecha: string, formatoInicial: string): Date => {
  return dayjs(fecha, formatoInicial, true).toDate()
}

export const stringToDayjs = (fecha: string, formatoInicial: string) => {
  return dayjs(fecha, formatoInicial, true)
}

export const validarFechaFormato = (date: string, format: string) => {
  imprimir(`${date} -> ${dayjs(date).format(format)}`)
  return dayjs(dayjs(date).format(format), format, true).isValid()
}

export const formatoFecha = (fecha: string, formatoNuevo: string): string => {
  imprimir(`${fecha} -> ${formatoNuevo}:${dayjs(fecha).format(formatoNuevo)}`)
  return dayjs(fecha).format(formatoNuevo)
}

export const formatoLiteral = (fecha: Date) => {
  // Crear un objeto Date para representar una fecha
  // Convertir el objeto Date a Dayjs
  const fechaDayjs = dayjs(fecha)

  if (!fechaDayjs.isValid()) {
    return 'Fecha inválida'
  }

  // Obtener la diferencia relativa al tiempo actual
  return fechaDayjs.fromNow()
}

// función que genera fecha con un formato
export const generarFechaAnterior = (
  value: number,
  unit: ManipulateType,
  formato: string
): string => dayjs().subtract(value, unit).format(formato)

export const dateToString = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const formatted = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

  return formatted
}

export const nowDateToString = () => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return formatted
}

export const tomorrowDateToString = () => {
  const now = new Date()
  now.setDate(now.getDate() + 1)
  const pad = (n: number) => n.toString().padStart(2, '0')
  const formatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

  return formatted
}

export const dateToStringAmPm = (date: string | Date) => {
  if (typeof date === 'string') {
    date = date.replace(' ', 'T')
  }

  const validDate = new Date(date)

  if (isNaN(validDate.getTime())) {
    throw new Error('Fecha inválida')
  }

  const pad = (n: number) => n.toString().padStart(2, '0')
  const hours = validDate.getHours()
  const period = hours >= 12 ? 'pm' : 'am'
  const hour12 = hours % 12 === 0 ? 12 : hours % 12

  return `${pad(validDate.getDate())}/${pad(validDate.getMonth() + 1)}/${validDate.getFullYear()} ${pad(hour12)}:${pad(validDate.getMinutes())}:${pad(validDate.getSeconds())} ${period}`
}
