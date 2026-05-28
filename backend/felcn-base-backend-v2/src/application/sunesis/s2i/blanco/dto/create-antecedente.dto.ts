import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'

/**
 * DTO para registrar un antecedente penal del blanco
 * Equivalente a RegBlancos.Insertantecedente del sistema legado
 */
export class CreateAntecedenteDto {
  @ApiProperty({ description: 'ID del tipo de delito', example: 1 })
  @Type(() => Number)
  @IsInt()
  idTipoDelito: number

  @ApiProperty({
    description: 'ID del país donde ocurrió el hecho',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  idPais: number

  @ApiProperty({
    description: 'Lugar del hecho delictivo',
    example: 'El Alto, Zona Villa Adela',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lugarHecho: string

  @ApiProperty({
    description: 'Número de caso penal de referencia',
    example: '123/2025',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  nroCaso: string

  @ApiProperty({
    description: 'Fecha del hecho (ISO 8601)',
    example: '2025-01-15',
  })
  @IsDateString()
  fechaHecho: string

  @ApiProperty({ description: 'Descripción del hecho delictivo' })
  @IsNotEmpty()
  @IsString()
  hecho: string
}
