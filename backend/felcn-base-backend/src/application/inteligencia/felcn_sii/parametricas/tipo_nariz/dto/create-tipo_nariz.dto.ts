import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTipoNarizDto {
  @ApiProperty({
    example: 'Aguileña',
    description: 'Descripción de tipo de nariz',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  descripcion?: string
}
