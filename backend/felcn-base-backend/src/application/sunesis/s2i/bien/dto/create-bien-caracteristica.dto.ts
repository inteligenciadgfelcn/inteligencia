import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'

/**
 * DTO para registrar una característica de un bien investigado
 * Equivalente a RegBienes.InsertCaracteristica del sistema legado
 * El servicio aplica .toUpperCase() en descripcion
 */
export class CreateBienCaracteristicaDto {
  @ApiProperty({ description: 'ID del catálogo de característica', example: 3 })
  @Type(() => Number)
  @IsInt()
  idCatalogoCaracteristica: number

  @ApiProperty({
    description: 'Valor de la característica',
    example: 'COLOR NEGRO',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  descripcion: string
}
