import dayjs from 'dayjs'

export type FormatoFecha = 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm:ss'

const FORMATOS: Record<FormatoFecha, string> = {
  'dd/MM/yyyy': 'DD/MM/YYYY',
  'dd/MM/yyyy HH:mm:ss': 'DD/MM/YYYY HH:mm:ss',
}

export const formatFecha = (
  fecha: string | Date | null | undefined,
  formato: FormatoFecha = 'dd/MM/yyyy HH:mm:ss'
): string => {
  if (fecha == null || fecha === '') return '-'
  const d = dayjs(fecha)
  if (!d.isValid()) return String(fecha)
  return d.format(FORMATOS[formato])
}