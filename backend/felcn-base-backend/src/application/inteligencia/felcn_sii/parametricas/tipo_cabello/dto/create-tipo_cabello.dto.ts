import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTipoCabelloDto {
  @ApiProperty({
    example: 'Abundante',
    description: 'Descripción de tipo de cabello',
    required: false,
  })
  @IsString()
  @MaxLength(50)
  descripcion?: string
}
