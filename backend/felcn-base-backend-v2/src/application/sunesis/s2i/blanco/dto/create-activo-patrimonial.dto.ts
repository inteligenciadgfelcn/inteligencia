import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'

/**
 * DTO para registrar un activo patrimonial del blanco
 * El archivo binario se recibe vía multipart/form-data en el campo "archivo"
 */
export class CreateActivoPatrimonialDto {
  @ApiProperty({ description: 'ID del tipo de activo', example: 1 })
  @Type(() => Number)
  @IsInt()
  idTipoActivo: number

  @ApiProperty({
    description: 'Gestión (año) del activo declarado',
    example: '2026',
    maxLength: 4,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(4)
  gestion: string

  @ApiProperty({ description: 'Contenido / descripción del activo declarado' })
  @IsNotEmpty()
  @IsString()
  contenido: string
}
