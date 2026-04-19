import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'
export class CreateColorOjoDto {
  @ApiProperty({
    example: 'Café oscuros',
    description: 'Descripción de color de ojos',
    required: false,
  })
  @IsString()
  @MaxLength(30)
  descripcion?: string
}
