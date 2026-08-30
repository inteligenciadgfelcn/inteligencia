import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTipoOjoDto {
  @ApiProperty({
    example: 'Alargados',
    description: 'Descripción de tipo de ojos',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  descripcion?: string
}
