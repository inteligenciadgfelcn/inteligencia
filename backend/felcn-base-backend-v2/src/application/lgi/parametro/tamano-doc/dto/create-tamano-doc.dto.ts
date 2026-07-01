import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateTamanoDocDto {
  @ApiProperty({ example: 'Carta' })
  @IsString()
  @MaxLength(255)
  descripcion: string;

  @ApiProperty({ example: 216 })
  @IsNumber()
  ancho: number;

  @ApiProperty({ example: 279 })
  @IsNumber()
  alto: number;
}