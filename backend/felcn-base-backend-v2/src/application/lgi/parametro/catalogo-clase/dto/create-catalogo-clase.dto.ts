import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateCatalogoClaseDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  bienId: number

  @ApiProperty({ example: 'Computadora portátil' })
  @IsString()
  @MaxLength(255)
  descripcion: string

  @ApiProperty({ example: true })
  @IsBoolean()
  fungible: boolean
}