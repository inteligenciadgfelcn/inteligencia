import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

/**
 * DTO para crear un caso de investigación (tabla public.asignacion)
 * Equivalente a RegCasos.InsertRegCasos del sistema legado
 */
export class CreateCasoDto {
  @ApiProperty({ description: 'ID del país donde ocurre el caso', example: 1 })
  @Type(() => Number)
  @IsInt()
  idPais: number

  @ApiProperty({
    description: 'Lugar del hecho',
    example: 'La Paz - Zona Norte',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lugar: string

  @ApiProperty({
    description: 'Nombre descriptivo del caso',
    example: 'Operación Tormenta',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombreCaso: string

  @ApiPropertyOptional({
    description:
      'Palabra clave / código de caso (se calcula automáticamente si se omite)',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  palabraClave?: string

  @ApiProperty({ description: 'ID del estado del caso', example: 1 })
  @Type(() => Number)
  @IsInt()
  idEstadoCaso: number

  @ApiPropertyOptional({
    description: 'Número de caso CER (se calcula si se omite)',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nroCasoCer?: string

  @ApiProperty({
    description:
      'ID de etapa de investigación (1=Inicial, 2=Intermedia, 3=Juicio)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  idEtapaInvestigacion: number

  @ApiProperty({
    description: 'Fecha de inicio del caso (ISO 8601)',
    example: '2026-05-24',
  })
  @IsDateString()
  fechaInicio: string

  @ApiProperty({ description: 'Antecedentes y descripción del caso' })
  @IsNotEmpty()
  @IsString()
  antecedentes: string
}
