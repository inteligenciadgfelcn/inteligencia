import { ApiProperty } from '@nestjs/swagger'
import {
  ArrayUnique,
  IsArray,
  IsDefined,
  IsString,
  Matches,
} from 'class-validator'

export class CreateConclusionCasoDto {
  @ApiProperty({
    description: 'ID del caso',
    example: '60',
    type: String,
  })
  @IsDefined()
  @IsString()
  @Matches(/^[1-9]\d*$/, {
    message: 'casoId debe ser un entero positivo enviado como texto',
  })
  casoId: string

  @ApiProperty({
    description: 'IDs de los ciclos seleccionados; [] si no hay selección',
    example: ['5', '7'],
    type: [String],
  })
  @IsDefined()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[1-9]\d*$/, {
    each: true,
    message: 'Cada cicloId debe ser un entero positivo enviado como texto',
  })
  cicloIds: string[]

  @ApiProperty({
    description: 'IDs de los verbos rectores seleccionados',
    example: ['2', '5'],
    type: [String],
  })
  @IsDefined()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[1-9]\d*$/, {
    each: true,
    message: 'Cada verboRectorId debe ser un entero positivo enviado como texto',
  })
  verboRectorIds: string[]

  @ApiProperty({
    description: 'IDs de las tipologías seleccionadas',
    example: ['2', '8'],
    type: [String],
  })
  @IsDefined()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[1-9]\d*$/, {
    each: true,
    message: 'Cada tipologiaId debe ser un entero positivo enviado como texto',
  })
  tipologiaIds: string[]
}