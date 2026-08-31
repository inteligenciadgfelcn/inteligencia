import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/* eslint-disable camelcase */

/**
 * DTOs de delitos del caso (3.3–3.6). Cubre el delito inicial y el
 * principal: es_principal / es_tentativo son opcionales en la creación.
 * Contrato: docs/fiscalia/PROPUESTA-APIS-FISCALIA.md
 */
export class DelitoItemDto {
  @ApiProperty({ example: 1, description: 'Primary key del delito en el MP' })
  @IsInt()
  @IsNotEmpty()
  mp_caso_delito_id: number

  @ApiProperty({ example: 10, description: 'Id del delito en el catálogo' })
  @IsInt()
  @IsNotEmpty()
  delito_id: number

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  es_principal?: boolean

  @ApiPropertyOptional({
    example: false,
    description: 'Tentativo / consumado',
  })
  @IsBoolean()
  @IsOptional()
  es_tentativo?: boolean
}

export class CrearDelitosDto {
  @ApiProperty({ type: [DelitoItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DelitoItemDto)
  delitos: DelitoItemDto[]
}

export class ActualizarDelitoDto {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  es_principal?: boolean

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  es_tentativo?: boolean

  @ApiPropertyOptional({
    example: 0,
    description: '0 para dar de baja el delito del caso',
  })
  @IsIn([0, 1])
  @IsOptional()
  estado?: number
}
