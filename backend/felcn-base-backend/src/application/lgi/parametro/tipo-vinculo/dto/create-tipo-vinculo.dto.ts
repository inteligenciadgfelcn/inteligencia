import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateTipoVinculoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  idVinculo: number

  @ApiProperty({ example: 'Inquilino' })
  @IsString()
  @MaxLength(255)
  descripcion: string
}