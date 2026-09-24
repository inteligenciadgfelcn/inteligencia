/**
 * Formatea una fecha usando la zona horaria local del servidor.
 *
 * Resultado:
 * yyyy-MM-dd HH:mm:ss
 *
 * Se conserva por compatibilidad con los módulos existentes.
 */
export function formatearFecha(fecha: Date): string {
  const y = fecha.getFullYear()
  const m = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const d = fecha.getDate().toString().padStart(2, '0')

  const h = fecha.getHours().toString().padStart(2, '0')
  const min = fecha.getMinutes().toString().padStart(2, '0')
  const s = fecha.getSeconds().toString().padStart(2, '0')

  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

/**
 * Formatea una fecha para visualización en español.
 *
 * Sin hora:
 * dd/MM/yyyy
 *
 * Con hora:
 * dd/MM/yyyy HH:mm
 *
 * Se conserva por compatibilidad con los módulos existentes.
 */
export function formatearFechaVisualizacion(
  fecha: Date | string | null | undefined,
  incluirHora = false
): string {
  if (!fecha) return 'N/A'

  const d = fecha instanceof Date ? fecha : new Date(fecha)

  if (Number.isNaN(d.getTime())) {
    return 'N/A'
  }

  const pad = (numero: number) =>
    numero.toString().padStart(2, '0')

  const base =
    `${pad(d.getDate())}/` +
    `${pad(d.getMonth() + 1)}/` +
    `${d.getFullYear()}`

  if (!incluirHora) {
    return base
  }

  return (
    `${base} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}`
  )
}

/**
 * Convierte una fecha a la zona horaria de Bolivia.
 *
 * Resultado:
 * yyyy-MM-ddTHH:mm:ss.sss-04:00
 *
 * Se conserva sin cambios para no afectar módulos existentes.
 */
export function formatearFechaBolivia(
  fecha: Date | string | null | undefined
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

  // Bolivia utiliza UTC-04:00.
  const fechaBolivia = new Date(
    date.getTime() - 4 * 60 * 60 * 1000
  )

  return fechaBolivia
    .toISOString()
    .replace('Z', '-04:00')
}

/**
 * Formatea solamente la fecha usando la zona horaria de Bolivia.
 *
 * Resultado:
 * yyyy-MM-dd
 *
 * Recomendada para:
 * - Fecha de nacimiento.
 * - Fecha de operativo cuando no se muestra la hora.
 * - Comparación y presentación de fechas calendario.
 */
export function formatearFechaBoliviaSoloFecha(
  fecha: Date | string | null | undefined
): string | null {
  if (!fecha) {
    return null
  }

  /*
   * Si ya llega como yyyy-MM-dd o yyyy-MM-dd HH:mm:ss,
   * conserva directamente la parte de la fecha.
   *
   * Esto evita que una fecha calendario cambie de día
   * al convertirse a UTC mediante new Date().
   */
  if (typeof fecha === 'string') {
    const coincidencia = fecha.match(
      /^(\d{4}-\d{2}-\d{2})/
    )

    if (coincidencia) {
      return coincidencia[1]
    }
  }

  const date =
    fecha instanceof Date
      ? fecha
      : new Date(fecha)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return formatearPartesBolivia(date).fecha
}

/**
 * Formatea fecha y hora usando la zona horaria de Bolivia.
 *
 * Resultado:
 * yyyy-MM-dd HH:mm:ss
 *
 * Recomendada para:
 * - Fecha de ingreso.
 * - Fecha de creación.
 * - Fecha de actualización.
 * - Registros que necesitan conservar la hora.
 */
export function formatearFechaHoraBolivia(
  fecha: Date | string | null | undefined
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

  const partes = formatearPartesBolivia(date)

  return `${partes.fecha} ${partes.hora}`
}

/**
 * Formatea una fecha de Bolivia para reportes o interfaz.
 *
 * Sin hora:
 * dd/MM/yyyy
 *
 * Con hora:
 * dd/MM/yyyy HH:mm
 */
export function formatearFechaVisualizacionBolivia(
  fecha: Date | string | null | undefined,
  incluirHora = false
): string {
  if (!fecha) {
    return 'N/A'
  }

  /*
   * Para una fecha pura evitamos new Date('yyyy-MM-dd'),
   * porque JavaScript la interpreta como UTC.
   */
  if (typeof fecha === 'string') {
    const coincidencia = fecha.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    )

    if (coincidencia && !incluirHora) {
      const [, anio, mes, dia] = coincidencia

      return `${dia}/${mes}/${anio}`
    }
  }

  const date =
    fecha instanceof Date
      ? fecha
      : new Date(fecha)

  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  const partes = formatearPartesBolivia(date)

  const fechaVisual =
    `${partes.dia}/${partes.mes}/${partes.anio}`

  if (!incluirHora) {
    return fechaVisual
  }

  return (
    `${fechaVisual} ` +
    `${partes.horaTexto}`
  )
}

/**
 * Extrae los componentes de fecha/hora correspondientes
 * a la zona horaria America/La_Paz.
 */
function formatearPartesBolivia(date: Date): {
  anio: string
  mes: string
  dia: string
  horas: string
  minutos: string
  segundos: string
  fecha: string
  hora: string
  horaTexto: string
} {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const obtener = (
    tipo: Intl.DateTimeFormatPartTypes
  ): string => {
    return (
      partes.find((parte) => parte.type === tipo)?.value ??
      ''
    )
  }

  const anio = obtener('year')
  const mes = obtener('month')
  const dia = obtener('day')
  const horas = obtener('hour')
  const minutos = obtener('minute')
  const segundos = obtener('second')

  return {
    anio,
    mes,
    dia,
    horas,
    minutos,
    segundos,
    fecha: `${anio}-${mes}-${dia}`,
    hora: `${horas}:${minutos}:${segundos}`,
    horaTexto: `${horas}:${minutos}`,
  }
}
/**
 * Convierte una fecha pura (yyyy-MM-dd) a un Date a medianoche en hora local.
 *
 * new Date('yyyy-MM-dd') se interpreta como UTC; al guardarlo en una columna
 * `timestamp` (sin zona) el driver lo convierte a hora local y la fecha se
 * corre un día atrás. Construirlo con componentes locales lo evita.
 *
 * Si el valor no es una fecha pura (por ejemplo un ISO con hora), se
 * interpreta con new Date() como hasta ahora.
 */
export function parsearFechaPura(valor: string): Date {
  const coincidencia = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!coincidencia) {
    return new Date(valor)
  }

  const [, anio, mes, dia] = coincidencia

  return new Date(Number(anio), Number(mes) - 1, Number(dia))
}
