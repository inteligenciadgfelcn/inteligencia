import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayUnique,
  IsArray,
  IsInt,
  Max,
  Min,
} from 'class-validator'

export class CreateConclusionPdDto {
  @ApiProperty({
    description: 'Identificador del caso',
    type: Number,
    example: 191,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2147483647)
  casosId: number

  @ApiProperty({
    description:
      'IDs de bienes sujetos a pérdida de dominio seleccionados',
    type: [Number],
    example: [1, 2],
  })
  @Type(() => Number)
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(2147483647, { each: true })
  bienesSujetosPd: number[]

  @ApiProperty({
    description: 'IDs de sentencias seleccionadas',
    type: [Number],
    example: [1],
  })
  @Type(() => Number)
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(2147483647, { each: true })
  sentencias: number[]
}