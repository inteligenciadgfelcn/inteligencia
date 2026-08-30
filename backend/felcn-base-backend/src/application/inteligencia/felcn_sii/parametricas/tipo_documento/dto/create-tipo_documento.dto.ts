import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTipoDocumentoDto {
  @ApiProperty({
    example: 'Cedula de Identidad',
    description: 'Descripción tipo documento',
    required: false,
  })
  @IsString()
  @MaxLength(50)
  descripcion?: string
}
