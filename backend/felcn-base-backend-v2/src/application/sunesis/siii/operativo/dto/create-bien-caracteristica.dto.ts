import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateBienCaracteristicaDto {
  @ApiProperty({
    description: 'ID del catálogo de características',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  idCatalogoCaracteristica: number

  @ApiProperty({
    description: 'Descripción de la característica',
    example: 'Color rojo',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  descripcion: string
}
