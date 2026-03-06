import { BadRequestException } from '@nestjs/common'

export function validarRangoFechas(
  fechaIngreso: Date,
  fechaSalida: Date,
  ahora: Date
) {
  const hoy = new Date(ahora)
  hoy.setHours(0, 0, 0, 0)

  const ingreso = new Date(fechaIngreso)
  ingreso.setHours(0, 0, 0, 0)

  const salida = new Date(fechaSalida)
  salida.setHours(0, 0, 0, 0)

  if (ingreso < hoy) {
    throw new BadRequestException(
      'La fecha de ingreso no puede ser de un día pasado'
    )
  }

  if (salida < ingreso) {
    throw new BadRequestException(
      'La fecha de salida debe ser mayor o igual a la fecha de ingreso'
    )
  }
}

export function formatearFecha(fecha: Date) {
  const y = fecha.getFullYear()
  const m = (fecha.getMonth() + 1).toString().padStart(2, '0')
  const d = fecha.getDate().toString().padStart(2, '0')

  const h = fecha.getHours().toString().padStart(2, '0')
  const min = fecha.getMinutes().toString().padStart(2, '0')
  const s = fecha.getSeconds().toString().padStart(2, '0')

  return `${y}-${m}-${d} ${h}:${min}:${s}`
}