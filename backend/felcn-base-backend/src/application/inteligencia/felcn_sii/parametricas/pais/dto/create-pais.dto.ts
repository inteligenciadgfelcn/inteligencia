import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'

export class CreatePaisDto {
  @ApiProperty({
    example: 'Bolivia',
    description: 'Nombre oficial del país',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  descripcion: string

  @ApiProperty({
    example: 1,
    description: 'ID del continente al que pertenece el país',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  idContinente: number
}
