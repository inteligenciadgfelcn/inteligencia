import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateUnidadDto {
  @ApiProperty({ example: 'UOP' })
  @IsString()
  @MaxLength(3)
  uniAbrev: string

  @ApiProperty({ example: 'Unidad Operativa' })
  @IsString()
  @MaxLength(80)
  uniDescripcion: string

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  uniOpadm?: boolean
}