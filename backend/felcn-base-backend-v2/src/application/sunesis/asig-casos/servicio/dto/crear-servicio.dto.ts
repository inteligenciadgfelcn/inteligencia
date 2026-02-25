import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, IsDateString } from 'class-validator'

export class CrearServicioDto {
  @ApiProperty({ description: 'Código del servicio', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  codigoServicio: string

  @ApiProperty({ description: 'Usuario login', maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  usuarioLogin: string

  @ApiProperty({ description: 'Usuario ejecutor', maxLength: 15 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  usuarioEjecutor: string

  @ApiProperty({ description: 'Fecha hora de ingreso' })
  @IsNotEmpty()
  @IsDateString()
  fechaHoraIngreso: string

  @ApiProperty({ description: 'Fecha hora de salida' })
  @IsNotEmpty()
  @IsDateString()
  fechaHoraSalida: string
}
