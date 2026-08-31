import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTO para la creación de un caso enviado por el MP (3.1).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md — campos en snake_case.
 */
export class CrearCasoDto {
  @ApiProperty({
    example: 'LP2301234',
    description: 'Código único de denuncia',
  })
  @IsString()
  @IsNotEmpty()
  cud: string

  @ApiProperty({ example: 1, description: 'Primary key del caso en el MP' })
  @IsInt()
  @IsNotEmpty()
  mp_caso_id: number

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  mp_caso_padre_id?: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tipo_denuncia_id: number

  @ApiProperty({ example: '2026-07-01T10:30:00Z' })
  @IsDateString()
  @IsNotEmpty()
  creacion_fecha_hora: string

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  esta_reservado?: boolean

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  oficina_comun_id: number

  @ApiPropertyOptional({ example: 20101 })
  @IsInt()
  @IsOptional()
  hecho_municipio_id?: number

  @ApiPropertyOptional({ example: 'Zona Central' })
  @IsString()
  @IsOptional()
  hecho_zona?: string

  @ApiPropertyOptional({ example: 'Av. Principal Nro. 100' })
  @IsString()
  @IsOptional()
  hecho_direccion?: string

  @ApiPropertyOptional({ example: '-16.500000' })
  @IsString()
  @IsOptional()
  hecho_latitud?: string

  @ApiPropertyOptional({ example: '-68.150000' })
  @IsString()
  @IsOptional()
  hecho_longitud?: string

  @ApiPropertyOptional({ example: 'Frente a la plaza' })
  @IsString()
  @IsOptional()
  hecho_referencia_lugar?: string

  @ApiPropertyOptional({ description: 'Relato del hecho' })
  @IsString()
  @IsOptional()
  hecho_relato?: string

  @ApiPropertyOptional({ example: '2026-06-30T22:00:00Z' })
  @IsDateString()
  @IsOptional()
  hecho_fecha_hora?: string

  @ApiPropertyOptional({ example: '2026-06-30T23:00:00Z' })
  @IsDateString()
  @IsOptional()
  hecho_fecha_hora_fin?: string

  @ApiPropertyOptional({ example: 'aproximadamente 22:00' })
  @IsString()
  @IsOptional()
  hecho_fecha_hora_aproximada?: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  caso_estado_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  caso_etapa_id: number

  @ApiPropertyOptional({
    example: 'Caso mediático X',
    description: 'Solo si es mediático de la denuncia',
  })
  @IsString()
  @IsOptional()
  denominacion_caso?: string

  @ApiPropertyOptional({ example: ['misiles', 'china'], type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[]
}

/**
 * DTO para la edición de un caso enviado por el MP (3.2).
 */
export class ActualizarCasoDto {
  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  mp_caso_padre_id?: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tipo_denuncia_id: number

  @ApiPropertyOptional({ example: 20101 })
  @IsInt()
  @IsOptional()
  hecho_municipio_id?: number

  @ApiPropertyOptional({ example: 'Zona Central' })
  @IsString()
  @IsOptional()
  hecho_zona?: string

  @ApiPropertyOptional({ example: 'Av. Principal Nro. 100' })
  @IsString()
  @IsOptional()
  hecho_direccion?: string

  @ApiPropertyOptional({ example: '-16.500000' })
  @IsString()
  @IsOptional()
  hecho_latitud?: string

  @ApiPropertyOptional({ example: '-68.150000' })
  @IsString()
  @IsOptional()
  hecho_longitud?: string

  @ApiPropertyOptional({ example: 'Frente a la plaza' })
  @IsString()
  @IsOptional()
  hecho_referencia_lugar?: string

  @ApiPropertyOptional({ description: 'Relato del hecho' })
  @IsString()
  @IsOptional()
  hecho_relato?: string

  @ApiPropertyOptional({ example: '2026-06-30T22:00:00Z' })
  @IsDateString()
  @IsOptional()
  hecho_fecha_hora?: string

  @ApiPropertyOptional({ example: '2026-06-30T23:00:00Z' })
  @IsDateString()
  @IsOptional()
  hecho_fecha_hora_fin?: string

  @ApiPropertyOptional({ example: 'aproximadamente 22:00' })
  @IsString()
  @IsOptional()
  hecho_fecha_hora_aproximada?: string

  @ApiPropertyOptional({
    example: 'Caso mediático X',
    description: 'Solo si es mediático de la denuncia',
  })
  @IsString()
  @IsOptional()
  denominacion_caso?: string

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsArray()
  @IsOptional()
  tags_id?: number[]
}
