export function formatearFecha(fecha: Date) {
  const y = fecha.getFullYear()
  const m = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const d = fecha.getDate().toString().padStart(2, '0')

  const h = fecha.getHours().toString().padStart(2, '0')
  const min = fecha.getMinutes().toString().padStart(2, '0')
  const s = fecha.getSeconds().toString().padStart(2, '0')

  return `${y}-${m}-${d} ${h}:${min}:${s}`
}