export function formatearFecha(fecha: Date) {
  const y = fecha.getFullYear()
  const m = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const d = fecha.getDate().toString().padStart(2, '0')

  const h = fecha.getHours().toString().padStart(2, '0')
  const min = fecha.getMinutes().toString().padStart(2, '0')
  const s = fecha.getSeconds().toString().padStart(2, '0')

  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

/**
 * Formatea una fecha para visualización en español: `dd/MM/yyyy`
 * (o `dd/MM/yyyy HH:mm` con `incluirHora`). Uso en reportes/UI, a
 * diferencia de `formatearFecha` (yyyy-MM-dd, para APIs/logs).
 */
export function formatearFechaVisualizacion(
  fecha: Date | string | null | undefined,
  incluirHora = false
): string {
  if (!fecha) return 'N/A'
  const d = fecha instanceof Date ? fecha : new Date(fecha)
  if (isNaN(d.getTime())) return 'N/A'

  const pad = (n: number) => n.toString().padStart(2, '0')
  const base = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
  if (!incluirHora) return base
  return `${base} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatearFechaBolivia(
  fecha: Date | string | null | undefined,
): string | null {
  if (!fecha) {
    return null
  }

  const date =
    fecha instanceof Date
      ? fecha
      : new Date(fecha)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  // Bolivia utiliza UTC-04:00
  const fechaBolivia = new Date(
    date.getTime() - 4 * 60 * 60 * 1000,
  )

  return fechaBolivia
    .toISOString()
    .replace('Z', '-04:00')
}
