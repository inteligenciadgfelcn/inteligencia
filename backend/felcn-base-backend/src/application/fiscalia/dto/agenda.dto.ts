import {
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTOs de agenda de audiencias (3.19 / 3.16b + 3.20 unificados).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export class CrearAgendaDto {
  @ApiProperty({ example: 100 })
  @IsInt()
  @IsNotEmpty()
  oj_audiencia_id: number

  @ApiProperty({ example: 200 })
  @IsInt()
  @IsNotEmpty()
  oj_audiencia_detalle_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tipo_audiencia_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tipo_actividad_id: number

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  juzgado_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  sala_audiencia_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  estado_audiencia_id: number

  @ApiPropertyOptional({
    example: 1,
    description: '1: presencial, 2: virtual, 3: mixta',
  })
  @IsIn([1, 2, 3])
  @IsOptional()
  modalidad?: number

  @ApiProperty({ example: '2026-08-01T09:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fecha_hora_inicio: string

  @ApiProperty({ example: '2026-08-01T11:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  fecha_hora_fin: string

  @ApiProperty({
    example: 'Audiencia de medidas cautelares',
    description:
      'Cuando se realiza en lugar distinto a las salas de audiencia del OJ',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string

  @ApiPropertyOptional({ example: '-16.500000' })
  @IsString()
  @IsOptional()
  latitud?: string

  @ApiPropertyOptional({ example: '-68.150000' })
  @IsString()
  @IsOptional()
  longitud?: string

  @ApiPropertyOptional({ example: 'Av. del Poder Judicial Nro. 1' })
  @IsString()
  @IsOptional()
  direccion?: string

  @ApiPropertyOptional({ example: 'https://meet.oj.bo/audiencia-123' })
  @IsString()
  @IsOptional()
  enlace_audiencia?: string

  @ApiPropertyOptional({
    example: [1, 2],
    type: [Number],
    description: 'Notificados para la audiencia',
  })
  @IsArray()
  @IsOptional()
  mp_caso_persona_ids?: number[]
}

/**
 * Unifica las dos variantes de edición del convenio (3.16b y 3.20):
 * todos los campos opcionales salvo los identificadores del evento.
 */
export class ActualizarAgendaDto {
  @ApiPropertyOptional({ example: 200 })
  @IsInt()
  @IsOptional()
  mp_audiencia_detalle_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  tipo_audiencia_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  tipo_actividad_id?: number

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @IsOptional()
  juzgado_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  sala_audiencia_id?: number

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  estado_audiencia_id?: number

  @ApiPropertyOptional({
    example: 1,
    description: '1: presencial, 2: virtual, 3: mixta',
  })
  @IsIn([1, 2, 3])
  @IsOptional()
  modalidad?: number

  @ApiPropertyOptional({ example: '2026-08-01T09:00:00Z' })
  @IsDateString()
  @IsOptional()
  fecha_hora_inicio?: string

  @ApiPropertyOptional({ example: '2026-08-01T11:00:00Z' })
  @IsDateString()
  @IsOptional()
  fecha_hora_fin?: string

  @ApiPropertyOptional({ example: 'Audiencia reprogramada' })
  @IsString()
  @IsOptional()
  descripcion?: string

  @ApiPropertyOptional({ example: '-16.500000' })
  @IsString()
  @IsOptional()
  latitud?: string

  @ApiPropertyOptional({ example: '-68.150000' })
  @IsString()
  @IsOptional()
  longitud?: string

  @ApiPropertyOptional({ example: 'Av. del Poder Judicial Nro. 1' })
  @IsString()
  @IsOptional()
  direccion?: string

  @ApiPropertyOptional({ example: '2026-08-01T09:05:00Z' })
  @IsDateString()
  @IsOptional()
  fecha_hora_inicio_grabacion?: string

  @ApiPropertyOptional({ example: '01:45:00' })
  @IsString()
  @IsOptional()
  duracion_grabacion?: string

  @ApiPropertyOptional({ example: 'https://meet.oj.bo/audiencia-123' })
  @IsString()
  @IsOptional()
  enlace_audiencia?: string

  @ApiPropertyOptional({ example: 'mp4' })
  @IsString()
  @IsOptional()
  archivo_extension?: string

  @ApiPropertyOptional({ example: 'https://oj.bo/grabaciones/abc' })
  @IsString()
  @IsOptional()
  archivo_enlace?: string

  @ApiPropertyOptional({ example: 1048576, description: 'Bytes' })
  @IsInt()
  @IsOptional()
  archivo_tamano?: number

  @ApiPropertyOptional({ example: 'a1b2c3d4' })
  @IsString()
  @IsOptional()
  archivo_hash?: string

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  suspencion_audiencia_id?: number

  @ApiPropertyOptional({ example: 'Suspendida por inasistencia' })
  @IsString()
  @IsOptional()
  observaciones?: string

  @ApiPropertyOptional({
    example: 0,
    description: '0 para dar de baja el evento',
  })
  @IsIn([0, 1])
  @IsOptional()
  estado?: number

  @ApiPropertyOptional({
    example: [1, 2],
    type: [Number],
    description: 'Asistentes en la audiencia',
  })
  @IsArray()
  @IsOptional()
  mp_caso_persona_ids?: number[]
}
