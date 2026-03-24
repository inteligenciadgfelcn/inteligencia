import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateColorCabelloDto {
  @ApiProperty({
    example: 'Rubio',
    description: 'Descripción de color de cabello',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  descripcion?: string
}
