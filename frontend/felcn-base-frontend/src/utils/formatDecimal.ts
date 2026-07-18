/**
 * Formato decimal boliviano: "," como separador decimal, "." como separador de miles.
 * Ej: 1234.5 -> "1.234,50"
 */
export function formatDecimal(
  value: number | null | undefined,
  decimals = 2
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return ''
  return value.toLocaleString('es-BO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Convierte un texto en formato boliviano ("1.234,56") o plano ("1234.56")
 * a un número JS. Devuelve null si el texto está vacío o no es un número válido.
 */
export function parseDecimal(text: string | null | undefined): number | null {
  if (text === null || text === undefined) return null
  const limpio = text.trim()
  if (!limpio) return null
  const normalizado = limpio.replace(/\./g, '').replace(',', '.')
  const num = Number(normalizado)
  return Number.isNaN(num) ? null : num
}
