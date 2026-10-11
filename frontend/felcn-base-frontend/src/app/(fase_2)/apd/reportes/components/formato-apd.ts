const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

/** Convierte ['2026-01', ...] → ['Ene 2026', ...] */
export function etiquetarMeses(meses: string[]): string[] {
  return meses.map((m) => {
    const [anio, mes] = m.split('-')
    const idx = Number(mes) - 1
    return `${MESES_CORTOS[idx] ?? mes} ${anio}`
  })
}

/** Formatea un valor numérico como Bolivianos. */
export function formatoBs(valor: number): string {
  return `Bs ${(valor ?? 0).toLocaleString('es-BO', { maximumFractionDigits: 2 })}`
}

/** Formatea un número entero en notación local. */
export function formatoNumero(valor: number): string {
  return (valor ?? 0).toLocaleString('es-BO')
}

export const COLORES_GRAFICO = [
  '#4361ee',
  '#805dca',
  '#e7515a',
  '#2196f3',
  '#00ab55',
  '#e2a03f',
  '#3b3f5c',
  '#1abc9c',
  '#d63031',
  '#f39c12',
  '#9b59b6',
  '#2ecc71',
  '#3498db',
  '#e67e22',
  '#34495e',
]

export const COLOR_BUCKETS: Record<string, string> = {
  muebles: '#4361ee',
  inmuebles: '#805dca',
  dineros: '#00ab55',
  otros: '#e2a03f',
}

export const ETIQUETA_BUCKETS: Record<string, string> = {
  muebles: 'Muebles',
  inmuebles: 'Inmuebles',
  dineros: 'Dineros',
  otros: 'Otros',
}

export const COLOR_TIPO_SITUACION: Record<number, string> = {
  1: '#4361ee',
  2: '#00ab55',
  3: '#e7515a',
  4: '#e2a03f',
  5: '#805dca',
}