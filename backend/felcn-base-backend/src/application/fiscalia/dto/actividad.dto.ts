import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTOs de actividades / actos investigativos (3.15).
 * meta_data es polimórfico según tipo_solicitud_id (detención preventiva,
 * sentencia condenatoria, medidas de protección, plazos procesales, baja de
 * actividad) — se valida lo estructural y se conserva íntegro en el payload.
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export class ActividadItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  mp_caso_actividad_id: number

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @IsOptional()
  respuesta_oj_caso_actividad_id?: number

  @ApiProperty({ example: 10 })
  @IsInt()
  @IsNotEmpty()
  actividad_id: number

  @ApiProperty({ example: 'Requerimiento fiscal 123/2026' })
  @IsString()
  @IsNotEmpty()
  referencia: string

  @ApiPropertyOptional({ example: 'pdf' })
  @IsString()
  @IsOptional()
  archivo_extension?: string

  @ApiPropertyOptional({ example: 'https://mp.gob.bo/archivos/abc' })
  @IsString()
  @IsOptional()
  archivo_link?: string

  @ApiPropertyOptional({ example: 204800, description: 'Bytes' })
  @IsInt()
  @IsOptional()
  archivo_tamano?: number

  @ApiPropertyOptional({ example: 12 })
  @IsInt()
  @IsOptional()
  archivo_paginas?: number

  @ApiProperty({ example: 'a1b2c3d4e5f6' })
  @IsString()
  @IsNotEmpty()
  archivo_hash: string

  @ApiPropertyOptional({ type: [Object] })
  @IsArray()
  @IsOptional()
  aprobaciones_cd?: Record<string, unknown>[]

  @ApiPropertyOptional({ type: [Object] })
  @IsArray()
  @IsOptional()
  firmas_digitales?: Record<string, unknown>[]

  @ApiPropertyOptional({
    type: Object,
    description:
      'Objeto polimórfico según tipo_solicitud_id (detención preventiva, ' +
      'sentencia, medidas de protección, plazos, baja de actividad)',
  })
  @IsObject()
  @IsOptional()
  meta_data?: Record<string, unknown>
}

export class CrearActividadesDto {
  @ApiProperty({ type: [ActividadItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ActividadItemDto)
  actividades: ActividadItemDto[]
}
