import { BadRequestException } from '@nestjs/common'

export function validarRangoFechas(
  dateIngreso: Date,
  dateSalida: Date,
) {
  const hoy = new Date()
  // Comparar por día calendario (no por instante exacto): "no puede ser de
  // un día pasado" debía rechazar días anteriores a hoy, pero al comparar
  // timestamps completos (dateIngreso <= hoy) también rechazaba fechas de
  // HOY MISMO o de mañana si se registraban entrada la noche, ya que la
  // hora fija que arma el datepicker terminaba siendo anterior al instante
  // exacto de la petición.
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  const inicioIngreso = new Date(
    dateIngreso.getFullYear(),
    dateIngreso.getMonth(),
    dateIngreso.getDate()
  )

  if (inicioIngreso < inicioHoy) {
    throw new BadRequestException(
      'La fecha de ingreso no puede ser de un día pasado',
    )
  }

  if (dateSalida <= dateIngreso) {
    throw new BadRequestException(
      'La fecha de salida debe ser mayor o igual a la fecha de ingreso',
    )
  }

}
