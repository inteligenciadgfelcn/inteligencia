const pad = (n: number): string => n.toString().padStart(2, '0')

/**
 * Formatea una fecha en español (DD/MM/YYYY) y agrega la hora (HH:mm) solo
 * si el valor trae una hora distinta de medianoche — así una fecha de
 * nacimiento no muestra "00:00" pero un fecha_hora_ingreso sí.
 */
export function formatearFecha(valor: unknown): string | null {
  if (!valor) return null
  const fecha = valor instanceof Date ? valor : new Date(valor as string)
  if (isNaN(fecha.getTime())) return null

  const soloFecha = `${pad(fecha.getDate())}/${pad(fecha.getMonth() + 1)}/${fecha.getFullYear()}`
  const tieneHora = fecha.getHours() !== 0 || fecha.getMinutes() !== 0 || fecha.getSeconds() !== 0

  return tieneHora ? `${soloFecha} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}` : soloFecha
}
