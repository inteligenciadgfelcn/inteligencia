import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

/**
 * DTO para registrar un bien en investigación en un caso
 * Equivalente a RegBienes.InsertBien del sistema legado
 * El tipo del bien se selecciona mediante jerarquía: bien → clase → tipo
 */
export class CreateBienInvestigadoDto {
  @ApiProperty({
    description: 'ID del catálogo tipo (nivel 3 de jerarquía)',
    example: 5,
  })
  @Type(() => Number)
  @IsInt()
  idCatalogoTipo: number

  @ApiProperty({
    description: 'ID del tipo de investigación de bien',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  idTipoInvestigacionBien: number
}
