import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateContinenteDto {
  @ApiProperty({
    example: 'Sudamérica',
    description: 'Nombre oficial del continente',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  descripcion: string
}

