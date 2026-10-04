import { formatearFechaVisualizacionBolivia } from '@/common/utils/date.util'

// Copia aquí el contenido actual de cada método.
export function formatearNumeroActuacion(
  numero: number | string | null | undefined,
  gestion: number | string | null | undefined
): string {
  const correlativo = Number(numero)
  const anio = Number(gestion)

  if (
    !Number.isInteger(correlativo) ||
    correlativo <= 0 ||
    !Number.isInteger(anio) ||
    anio <= 0
  ) {
    return 'Sin especificar'
  }

  return `${correlativo.toString().padStart(2, '0')}/${anio}`
}

export function construirNombreCompleto(persona: {
  nombres?: string | null
  paterno?: string | null
  materno?: string | null
  esposo?: string | null
}): string {
  return [
    persona.nombres,
    persona.paterno,
    persona.materno,
    persona.esposo,
  ]
    .map((valor) => valor?.trim())
    .filter((valor): valor is string => Boolean(valor))
    .join(' ') || 'Sin especificar'
}

export function convertirFotografia(
  fotografia?: Buffer | null
): string {
  if (!fotografia?.length) {
    return ''
  }

  return `data:image/jpeg;base64,${fotografia.toString('base64')}`
}

export function formatearFechaReporte(
  fecha: Date | string | null | undefined
): string {
  if (!fecha) {
    return 'Sin especificar'
  }

  const resultado = formatearFechaVisualizacionBolivia(fecha)

  return resultado === 'N/A' ? 'Sin especificar' : resultado
}

const formatoDolares = new Intl.NumberFormat('es-BO', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatearMoneda(valor: number): string {
  return formatoDolares.format(Number.isFinite(valor) ? valor : 0)
}

export function convertirMontoLiteral(valor: number): string {
  if (!Number.isFinite(valor) || valor < 0) {
    return 'Monto no válido'
  }

  const totalCentavos = Math.round(valor * 100)

  if (
    !Number.isSafeInteger(totalCentavos) ||
    totalCentavos >= 1_000_000_000_000 * 100
  ) {
    return 'Monto fuera del rango de conversión'
  }

  const entero = Math.floor(totalCentavos / 100)
  const centavos = String(totalCentavos % 100).padStart(2, '0')

  const unidades = [
    'cero', 'uno', 'dos', 'tres', 'cuatro',
    'cinco', 'seis', 'siete', 'ocho', 'nueve',
    'diez', 'once', 'doce', 'trece', 'catorce',
    'quince', 'dieciséis', 'diecisiete', 'dieciocho',
    'diecinueve', 'veinte', 'veintiuno', 'veintidós',
    'veintitrés', 'veinticuatro', 'veinticinco',
    'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
  ]

  const decenas = [
    '', '', '', 'treinta', 'cuarenta',
    'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa',
  ]

  const centenas = [
    '', 'ciento', 'doscientos', 'trescientos',
    'cuatrocientos', 'quinientos', 'seiscientos',
    'setecientos', 'ochocientos', 'novecientos',
  ]

  const apocopar = (texto: string): string =>
    texto
      .replace(/veintiuno$/, 'veintiún')
      .replace(/uno$/, 'un')

  const convertir = (numero: number): string => {
    if (numero < 30) {
      return unidades[numero]
    }

    if (numero < 100) {
      const resto = numero % 10

      return decenas[Math.floor(numero / 10)] +
        (resto ? ` y ${unidades[resto]}` : '')
    }

    if (numero === 100) {
      return 'cien'
    }

    if (numero < 1000) {
      const resto = numero % 100

      return centenas[Math.floor(numero / 100)] +
        (resto ? ` ${convertir(resto)}` : '')
    }

    if (numero < 1_000_000) {
      const miles = Math.floor(numero / 1000)
      const resto = numero % 1000

      const textoMiles = miles === 1
        ? 'mil'
        : `${apocopar(convertir(miles))} mil`

      return textoMiles +
        (resto ? ` ${convertir(resto)}` : '')
    }

    const millones = Math.floor(numero / 1_000_000)
    const resto = numero % 1_000_000

    const textoMillones = millones === 1
      ? 'un millón'
      : `${apocopar(convertir(millones))} millones`

    return textoMillones +
      (resto ? ` ${convertir(resto)}` : '')
  }

  const texto = apocopar(convertir(entero))

  const moneda = entero === 1
    ? 'dólar estadounidense'
    : entero > 0 && entero % 1_000_000 === 0
      ? 'de dólares estado unidenses'
      : 'dólares estado unidenses'

  return `${texto} ${centavos}/100 ${moneda}`.toUpperCase()
}