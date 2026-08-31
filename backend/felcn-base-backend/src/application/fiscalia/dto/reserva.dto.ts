import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTO de reserva de caso / sujeto / actividad (3.16).
 * tabla: 1 = caso (pol_caso_id), 2 = sujeto (pol_caso_persona_id),
 * 3 = actividad (pol_caso_actividad_id).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export class CrearReservaDto {
  @ApiProperty({ example: 1, description: '1 reservado, 0 sin reserva' })
  @IsIn([0, 1])
  @IsNotEmpty()
  estado: number

  @ApiProperty({
    example: 1,
    description: '1 = caso, 2 = sujeto, 3 = actividad',
  })
  @IsIn([1, 2, 3])
  @IsNotEmpty()
  tabla: number

  @ApiProperty({
    example: 1,
    description: 'pol_caso_id | pol_caso_persona_id | pol_caso_actividad_id',
  })
  @IsInt()
  @IsNotEmpty()
  tabla_id: number

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  fecha_fin_reserva?: string
}
