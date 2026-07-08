import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTOs de fiscales del caso (3.13 / 3.14 — "investigadores" en el convenio).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export class FiscalItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  mp_caso_funcionario_id: number

  @ApiProperty({ example: 1, description: 'Catálogo de ministerio público' })
  @IsInt()
  @IsNotEmpty()
  tipo_responsable_id: number

  @ApiProperty({ example: '1234567' })
  @IsString()
  @IsNotEmpty()
  ci: string

  @ApiProperty({ example: 'María' })
  @IsString()
  @IsNotEmpty()
  nombres: string

  @ApiPropertyOptional({ example: 'Flores' })
  @IsString()
  @IsOptional()
  primer_apellido?: string

  @ApiPropertyOptional({ example: 'Gutiérrez' })
  @IsString()
  @IsOptional()
  segundo_apellido?: string

  @ApiProperty({ example: '1980-01-10' })
  @IsDateString()
  @IsNotEmpty()
  fecha_nacimiento: string
}

export class CrearFiscalesDto {
  @ApiProperty({ type: [FiscalItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FiscalItemDto)
  fiscales: FiscalItemDto[]
}

export class ActualizarFiscalDto {
  @ApiProperty({ example: 0, description: '0 para dar de baja al fiscal' })
  @IsIn([0, 1])
  @IsNotEmpty()
  estado: number
}
