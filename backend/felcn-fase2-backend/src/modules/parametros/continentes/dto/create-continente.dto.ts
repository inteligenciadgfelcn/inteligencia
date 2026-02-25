import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateContinenteDto {

  @ApiProperty({
    example: 'SA',
    description: 'Código único del continente',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  codigo: string

  @ApiProperty({
    example: 'Sudamérica',
    description: 'Nombre oficial del continente',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string
}

