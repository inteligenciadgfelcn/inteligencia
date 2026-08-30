import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateColorPielDto {
  @ApiProperty({
    example: 'Amarilla',
    description: 'Descripción de color de piel',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  descripcion?: string
}
