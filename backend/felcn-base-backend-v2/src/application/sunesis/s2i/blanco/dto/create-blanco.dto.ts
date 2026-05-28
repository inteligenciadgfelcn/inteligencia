import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

/**
 * DTO para registrar un blanco (persona investigada) en un caso
 * Equivalente a RegBlancos.InsertBlancos del sistema legado
 * El sistema aplica .toUpperCase() en nombres y apellidos automáticamente
 */
export class CreateBlancoDto {
  @ApiProperty({
    description: 'Nombres del investigado',
    example: 'JUAN CARLOS',
    maxLength: 75,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(75)
  deNombres: string

  @ApiProperty({
    description: 'Apellido paterno',
    example: 'MAMANI',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  dePaterno: string

  @ApiPropertyOptional({
    description: 'Apellido materno (usa "*" si se omite)',
    example: 'QUISPE',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  deMaterno?: string

  @ApiPropertyOptional({
    description: 'Apellido de esposo/a (usa "*" si se omite)',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  deEsposo?: string

  @ApiProperty({
    description: 'ID del país de origen del investigado',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  idPais: number

  @ApiPropertyOptional({
    description: 'Alias o apodo (usa "*" si se omite)',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  alias?: string
}
