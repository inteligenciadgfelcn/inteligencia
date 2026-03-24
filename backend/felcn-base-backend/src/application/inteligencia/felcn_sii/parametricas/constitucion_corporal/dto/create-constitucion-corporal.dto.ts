import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateConstitucionCorporalDto {
  @ApiProperty({
    example: 'Delgado',
    description: 'Descripción de constitucion corporal',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  descripcion?: string
}
