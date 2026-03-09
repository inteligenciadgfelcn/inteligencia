import { ApiProperty } from '@nestjs/swagger'
import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateServicioDto {

  @ApiProperty({
    example: 'G-AGAG-0508',
    description: 'Numero de pase de usuario Principal',
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty({ message: 'El numero de pase Principal es obligatoria' })
  @MaxLength(15, {
    message: 'El numero de pase no puede tener más de 15 caracteres',
  })
  usuarioPrincipal: string

  @ApiProperty({
    example: 'G-AAF-0465',
    description: 'Numero de pase de usuario de emergencia',
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty({ message: 'El numero de pase de emergencia es obligatoria' })
  @MaxLength(15, {
    message: 'El numero de pase de emergencia no puede tener más de 15 caracteres',
  })
  usuarioEmergencia: string

  @ApiProperty({ example: '2026-03-05 13:30:00' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de ingreso debe ser válida' })
  fechaIngreso: Date

  @ApiProperty({ example: '2026-03-05 18:00:00' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de salida debe ser válida' })
  fechaSalida: Date
}