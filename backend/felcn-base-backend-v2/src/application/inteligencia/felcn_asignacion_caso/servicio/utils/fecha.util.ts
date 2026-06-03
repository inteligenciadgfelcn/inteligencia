import { BadRequestException } from '@nestjs/common'

export function validarRangoFechas(
  dateIngreso: Date,
  dateSalida: Date,
) {
  
  const hoy = new Date()

  console.log(dateIngreso);
  console.log(dateSalida);
  console.log(hoy);

  if (dateIngreso <= hoy) {
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
