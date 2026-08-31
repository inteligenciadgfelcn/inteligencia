import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, IsNotEmpty } from 'class-validator'

export class CrearNumeroCasoDto {
  @ApiProperty({
    example: 'LP',
    description: 'Abreviatura de departamento',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2)
  codigoDepartamento!: string

  @ApiProperty({
    example: 'A',
    description: 'Letra del caso',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 3)
  letra!: string
}