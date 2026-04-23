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

