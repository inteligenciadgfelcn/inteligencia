import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsISO8601,
  Matches,
  IsString,
  MaxLength,
} from 'class-validator'

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
  usuarioPrincipal!: string

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
  usuarioEmergencia!: string

  @ApiProperty({
    example: '2026-06-03T14:50:16.451Z',
    description: 'Fecha de ingreso en formato UTC ISO 8601 con sufijo Z',
  })
  @IsString()
  @IsNotEmpty({ message: 'La fecha de ingreso es obligatoria' })
  @IsISO8601(
    { strict: true, strictSeparator: true },
    { message: 'La fecha de ingreso debe estar en formato ISO 8601 válido' },
  )
  @Matches(/Z$/, {
    message: 'La fecha de ingreso debe estar en UTC y terminar con Z',
  })
  fechaIngreso!: string

  @ApiProperty({
    example: '2026-06-03T18:00:00.000Z',
    description: 'Fecha de salida en formato UTC ISO 8601 con sufijo Z',
  })
  @IsString()
  @IsNotEmpty({ message: 'La fecha de salida es obligatoria' })
  @IsISO8601(
    { strict: true, strictSeparator: true },
    { message: 'La fecha de salida debe estar en formato ISO 8601 válido' },
  )
  @Matches(/Z$/, {
    message: 'La fecha de salida debe estar en UTC y terminar con Z',
  })
  fechaSalida!: string
}