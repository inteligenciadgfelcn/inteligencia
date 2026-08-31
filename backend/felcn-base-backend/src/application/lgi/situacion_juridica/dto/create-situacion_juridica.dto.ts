import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDateString, IsInt } from 'class-validator'

export class CreateSituacionJuridicaDto {
  @ApiProperty({
    description: 'Identificador de la persona implicada',
    example: 912,
  })
  @Type(() => Number)
  @IsInt()
  detenidoId!: number

  @ApiProperty({
    description: 'Identificador de la situación jurídica',
    example: 3,
  })
  @Type(() => Number)
  @IsInt()
  situacionLegalId!: number

  @ApiProperty({
    description: 'Fecha de la situación jurídica',
    example: '2026-08-17',
  })
  @IsDateString()
  fecha!: string
}
