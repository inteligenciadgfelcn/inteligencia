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
 * DTO para registrar una organización investigada en un caso
 * Equivalente a RegOrganizacion.InsertOrganizacion del sistema legado
 * El servicio aplica .toUpperCase() en nombre, nit, matrícula y representante
 */
export class CreateOrganizacionDto {
  @ApiProperty({ description: 'ID del tipo de organización', example: 1 })
  @Type(() => Number)
  @IsInt()
  idTipoOrganizacion: number

  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'IMPORTADORA EL CONDOR SRL',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string

  @ApiPropertyOptional({
    description: 'Número de Identificación Tributaria',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nit?: string

  @ApiPropertyOptional({ description: 'Matrícula de comercio', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  matricula?: string

  @ApiPropertyOptional({ description: 'Representante legal', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  representante?: string

  @ApiPropertyOptional({ description: 'Observaciones adicionales' })
  @IsOptional()
  @IsString()
  observaciones?: string
}
