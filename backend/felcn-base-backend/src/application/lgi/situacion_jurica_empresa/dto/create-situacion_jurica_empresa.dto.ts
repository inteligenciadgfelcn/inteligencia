import {
  Type,
} from 'class-transformer'

import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator'

import {
  ApiProperty,
} from '@nestjs/swagger'

export class CreateSituacionJuridicaEmpresaDto {
  @ApiProperty({
    description:
      'Identificador de la empresa',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  idEmpresa: number

  @ApiProperty({
    description:
      'Fecha de la situación jurídica',
    example: '2026-09-06',
  })
  @IsDateString()
  fecha: string

  @ApiProperty({
    description:
      'Persona o autoridad que autoriza',
    example:
      'Fiscal de Materia',
  })
  @IsString()
  @IsNotEmpty()
  quienAutoriza: string

  @ApiProperty({
    description:
      'Persona o institución a quien se entrega',
    example: 'DIRCABI',
  })
  @IsString()
  @IsNotEmpty()
  aQuienEntregan: string

  @ApiProperty({
    description:
      'Tipo de situación jurídica',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  idTipoSituacionJuridica: number
}