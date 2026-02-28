import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateGaleriaDto {
  @ApiProperty({
    description: 'Descripción de la foto',
    example: 'Vista frontal del operativo',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  descripcion: string
}
