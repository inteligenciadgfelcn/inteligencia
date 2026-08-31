import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTOs de asignación de juzgado (3.17 / 3.18).
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export class ActualizarJuzgadoCasoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  pol_caso_id: number

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  juzgado_id: number
}

export class ActualizarJuzgadoSujetosDto {
  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  pol_caso_persona_ids: number[]

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  juzgado_id: number
}
