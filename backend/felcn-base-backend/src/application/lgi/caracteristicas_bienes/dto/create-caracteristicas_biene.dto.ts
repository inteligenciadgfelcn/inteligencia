import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min, IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateCaracteristicasBieneDto {
  @ApiProperty({
    description: 'Identificador del bien secuestrado',
    example: 4300,
  })
  @IsInt({
    message: 'El identificador del bien secuestrado debe ser un número entero',
  })
  @Min(1, {
    message: 'El identificador del bien secuestrado debe ser mayor a cero',
  })
  itembiensecId: number

  @ApiProperty({
    description: 'Identificador del catálogo de características',
    example: 3,
  })
  @IsInt({
    message: 'El identificador de la característica debe ser un número entero',
  })
  @Min(1, {
    message: 'El identificador de la característica debe ser mayor a cero',
  })
  catcaracId: number

  @ApiProperty({
    description: 'Descripción o valor de la característica',
    example: 'Color negro',
  })
  @IsString({
    message: 'La descripción debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La descripción es obligatoria',
  })
  @MaxLength(1000, {
    message: 'La descripción no puede superar los 1000 caracteres',
  })
  descripcion: string
}
